import SvgElement from "@/src/models/SvgElement";
import { upload } from "@/src/storage/storage";
import mongoose from "mongoose";

/**
 * Data structure for SVG element information
 */
export interface SvgElementData {
  /** Unique identifier for the element */
  id: string;
  /** Data URL containing the element's image data */
  dataUrl: string;
  /** Optional name of the element */
  name?: string;
  /** Optional name of the level this element belongs to */
  levelName?: string;
}

/**
 * Represents rasterized data for an SVG element
 */
export interface RasterizedData {
  /** Data URL containing the image data */
  dataUrl: string;
  /** Width of the element in pixels */
  width: number;
  /** Height of the element in pixels */
  height: number;
  /** X-coordinate position */
  x: number;
  /** Y-coordinate position */
  y: number;

  skipUpload: boolean;
}

/**
 * Represents a processed rasterized element with storage info
 */
interface RasterizedElement {
  /** Source URL where the element is stored */
  src: string;
  /** Width of the element in pixels */
  width: number;
  /** Height of the element in pixels */
  height: number;
  /** X-coordinate position */
  x: number;
  /** Y-coordinate position */
  y: number;
}

/**
 * Parameters for creating a root SVG element
 */
interface CreateRootElementParams {
  /** MongoDB ObjectId for the element */
  _id: string;
  /** Unique identifier within the SVG */
  id: string;
  /** Original file name */
  fileName: string;
  /** Map of element IDs to their rasterized data */
  rasterImages: Map<string, RasterizedData>;
  /** SVG content as a string */
  svgString: string;
  /** Name of the level this SVG represents */
  levelName: string;
}

/**
 * Parameters for creating a child SVG element
 */
interface CreateElementParams {
  /** Unique identifier within the SVG */
  id: string;
  /** Name of the element */
  name: string;
  /** Name of the level this element belongs to */
  levelName: string;
  /** Species ID for taxonomy */
  specie_id: string;
  /** MongoDB ObjectId of the parent root element */
  rootId: mongoose.Types.ObjectId;
}

/**
 * Parameters for initializing a root SVG element
 */
interface InitializeRootElementParams {
  /** Name of the root element */
  name: string;
  /** Species ID for taxonomy */
  specie_id: string;
  fileSize: number;
}

/**
 * Service responsible for managing SVG elements in the database
 */
export class SvgElementService {
  private readonly STORAGE_BUCKET_FILE_PREFIX = "welfare";
  private readonly DEFAULT_STATUS = {
    PROCESSING: "processing",
    READY: "ready",
    GENERATING: "generating",
  };
  private readonly ELEMENT_TYPES = {
    ROOT: "root",
  };

  /**
   * Initializes a new root SVG element with minimal information
   * @param params - Parameters for initializing the root element
   * @returns The saved root element
   */
  async initializeRootElement(
    params: InitializeRootElementParams
  ): Promise<mongoose.Document> {
    try {
      const rootElement = new SvgElement({
        element_type: this.ELEMENT_TYPES.ROOT,
        name: params.name,
        specie_id: params.specie_id,
        raster_images: {},
        svg_url: "",
        status: this.DEFAULT_STATUS.PROCESSING,
        root_id: null,
        originalSize: params.fileSize,
      });

      return await rootElement.save();
    } catch (error) {
      console.error("Error initializing root element:", error);
      throw new Error(
        `Failed to initialize root element: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  /**
   * Creates or updates a root SVG element with all necessary data
   * @param params - Parameters for creating the root element
   * @returns The saved root element
   */
  async createRootElement(
    params: CreateRootElementParams
  ): Promise<mongoose.Document> {
    try {
      const rasterUrls = await this.processAndUploadRasterImages(
        params.rasterImages
      );
      const svgSource = await this.uploadSvgFile(
        params.fileName,
        params.svgString
      );

      const rasterImagesObject = Object.fromEntries(rasterUrls);

      const savedElement = await SvgElement.findByIdAndUpdate(
        params._id,
        {
          svg_url: svgSource.location,
          finalSize: svgSource.fileSize,
          raster_images: rasterImagesObject,
          status: this.DEFAULT_STATUS.PROCESSING,
          identifier: params.id,
          levelName: params.levelName,
        },
        { new: true }
      );

      if (!savedElement) {
        throw new Error(
          `Could not find or update element with ID: ${params._id}`
        );
      }

      return savedElement;
    } catch (error) {
      console.error("Error creating root element:", error);
      throw new Error(
        `Failed to create root element: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  /**
   * Updates the status of an SVG element to "generating"
   * @param id - The ID of the SVG element to update
   * @returns The updated SVG element
   */
  async updateSvgElementStatusToGenerating(
    id: string
  ): Promise<mongoose.Document | null> {
    try {
      const updatedElement = await SvgElement.findByIdAndUpdate(
        id,
        { status: this.DEFAULT_STATUS.GENERATING },
        { new: true }
      );

      if (!updatedElement) {
        throw new Error(`Could not find element with ID: ${id}`);
      }

      return updatedElement;
    } catch (error) {
      console.error("Error updating SVG element status:", error);
      throw new Error(
        `Failed to update SVG element status: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  /**
   * Processes and uploads raster images to storage
   * @param rasterImages - Map of element IDs to their rasterized data
   * @returns Map of element IDs to their uploaded rasterized elements
   * @private
   */
  private async processAndUploadRasterImages(
    rasterImages: Map<string, RasterizedData>
  ): Promise<Map<string, RasterizedElement>> {
    const rasterUrls = new Map<string, RasterizedElement>();
    const uploadPromises: Promise<void>[] = [];

    console.log("Processing raster images for upload...");
    for (const [key, value] of rasterImages.entries()) {
      if (value.skipUpload) continue;
      const uploadPromise = this.uploadRasterImage(key, value)
        .then((uploadedElement) => {
          rasterUrls.set(key, uploadedElement);
        })
        .catch((error) => {
          console.error(`Failed to upload raster image for key ${key}:`, error);
          throw error;
        });

      uploadPromises.push(uploadPromise);
    }
    console.log("Raster images processed, waiting for uploads to complete...");

    // Wait for all uploads to complete
    await Promise.all(uploadPromises);

    console.log("All raster images uploaded successfully.");
    return rasterUrls;
  }

  /**
   * Uploads a single rasterized image to storage
   * @param key - The element ID
   * @param data - The rasterized data for the element
   * @returns The uploaded rasterized element
   * @private
   */
  private async uploadRasterImage(
    key: string,
    data: RasterizedData
  ): Promise<RasterizedElement> {
    try {
      const fileName = `${key}.png`;
      const base64Data = data.dataUrl.split(",")[1];
      const buffer = Buffer.from(base64Data, "base64");
      const contentType = "image/png";

      const uploadResult = await upload(
        fileName,
        buffer,
        contentType,
        this.STORAGE_BUCKET_FILE_PREFIX
      );

      return {
        src: uploadResult.Location,
        width: data.width,
        height: data.height,
        x: data.x,
        y: data.y,
      };
    } catch (error) {
      console.error(`Error uploading raster image ${key}:`, error);
      throw new Error(
        `Failed to upload raster image ${key}: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  /**
   * Uploads an SVG file to storage
   * @param fileName - The original file name
   * @param svgString - The SVG content as a string
   * @returns The URL where the SVG is stored
   * @private
   */
  private async uploadSvgFile(
    fileName: string,
    svgString: string
  ): Promise<{
    location: string;
    fileSize: number;
  }> {
    try {
      const svgFileName = `${fileName}.svg`;
      const svgBuffer = Buffer.from(svgString, "utf-8");
      const svgContentType = "image/svg+xml";

      const svgUploadResult = await upload(
        svgFileName,
        svgBuffer,
        svgContentType,
        this.STORAGE_BUCKET_FILE_PREFIX
      );

      const fileSize = svgBuffer.byteLength;

      return { location: svgUploadResult.Location, fileSize };
    } catch (error) {
      console.error("Error uploading SVG file:", error);
      throw new Error(
        `Failed to upload SVG file: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
}
