import { ProcessogramModel } from "@/src/models/Processogram";
import { upload } from "@/src/storage/storage";
import mongoose from "mongoose";

/**
 * Data structure for SVG element information
 */
export interface ProcessogramModelData {
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
  fileNameLight: string;
  fileNameDark: string;
  /** Map of element IDs to their rasterized data */
  rasterImages: Map<string, RasterizedData>;
  /** SVG content as a string */
  svgLightString: string;
  svgDarkString: string;
  /** Name of the level this SVG represents */
  levelName: string;
}

interface UpdateElementParams {
  _id: string;

  fileNameLight: string;
  fileNameDark: string;

  originalSizeLight: number | undefined;
  originalSizeDark: number | undefined;

  svgLightString: string;
  svgDarkString: string;
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
  name: string;
  specie_id: string;
  production_module_id: string;
  original_size_light: number | undefined;
  original_size_dark: number | undefined;
  original_name_light: string | undefined;
  original_name_dark: string | undefined;
  is_published: boolean | undefined;
}

/**
 * Service responsible for managing SVG elements in the database
 */
export class ProcessogramService {
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
      const rootElement = new ProcessogramModel({
        name: params.name,
        specie_id: params.specie_id,
        production_module_id: params.production_module_id,
        raster_images: {},
        svg_url_light: "",
        svg_url_dark: "",
        status: this.DEFAULT_STATUS.PROCESSING,
        root_id: null,
        is_published: params.is_published || false,
        original_size_light: params.original_size_light,
        original_size_dark: params.original_size_dark,
        original_name_light: params.original_name_light,
        original_name_dark: params.original_name_dark,
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
      const svgDarkSource = await this.uploadSvgFile(
        params.fileNameDark,
        params.svgDarkString
      );

      const svgLightSource = await this.uploadSvgFile(
        params.fileNameLight,
        params.svgLightString
      );

      const rasterImagesObject = Object.fromEntries(rasterUrls);

      const savedElement = await ProcessogramModel.findByIdAndUpdate(
        params._id,
        {
          svg_url_light: svgLightSource.location,
          final_size_light: svgLightSource.fileSize,
          svg_url_dark: svgDarkSource.location,
          final_size_dark: svgDarkSource.fileSize,
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
   * Update element svg metadata for light and dark
   * @param params - Parameters for updating the element
   */

  async updateElementSvgMetadata(params: UpdateElementParams): Promise<void> {
    try {
      const svgDarkSource = await this.uploadSvgFile(
        params.fileNameDark,
        params.svgDarkString
      );

      const svgLightSource = await this.uploadSvgFile(
        params.fileNameLight,
        params.svgLightString
      );

      const updateBody: {
        svg_url_light?: string;
        final_size_light?: number;
        svg_url_dark?: string;
        final_size_dark?: number;
        original_name_light?: string;
        original_name_dark?: string;
        original_size_light?: number | undefined;
        original_size_dark?: number | undefined;
      } = {};

      if (svgLightSource.location) {
        updateBody.svg_url_light = svgLightSource.location;
        updateBody.final_size_light = svgLightSource.fileSize;
        updateBody.original_name_light = params.fileNameLight;
        updateBody.original_size_light = params.originalSizeLight;
      }

      if (svgDarkSource.location) {
        updateBody.svg_url_dark = svgDarkSource.location;
        updateBody.final_size_dark = svgDarkSource.fileSize;
        updateBody.original_name_dark = params.fileNameDark;
        updateBody.original_size_dark = params.originalSizeDark;
      }

      const updatedElement = await ProcessogramModel.findByIdAndUpdate(
        params._id,
        updateBody,
        { new: true }
      );

      if (!updatedElement) {
        throw new Error(`Could not find element with ID: ${params._id}`);
      }
    } catch (error) {
      console.error("Error updating element SVG metadata:", error);
      throw new Error(
        `Failed to update element SVG metadata: ${
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
  async updateProcessogramStatusToGenerating(
    id: string
  ): Promise<mongoose.Document | null> {
    try {
      const updatedElement = await ProcessogramModel.findByIdAndUpdate(
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
    if (!fileName || !svgString) {
      return {
        location: "",
        fileSize: 0,
      };
    }

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


  /**
   * Updates the description of a processogram element
   * @param id - The ID of the processogram element to update
   * @param description - The new description to set
   * @returns The updated processogram document
   */
  async updateProcessogramDescription(
    id: string,
    description: string
  ): Promise<mongoose.Document | null> {
    try {
      const updatedElement = await ProcessogramModel.findByIdAndUpdate(
        id,
        { description },
        { new: true }
      );

      if (!updatedElement) {
        throw new Error(`Could not find processogram with ID: ${id}`);
      }

      return updatedElement;
    } catch (error) {
      console.error("Error updating processogram description:", error);
      throw new Error(
        `Failed to update processogram description: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
}
