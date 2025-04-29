import puppeteer from "puppeteer-core";
import { puppeteerLaunchArgs } from "./puppeteerLaunchArgs";

interface Size {
  w: number;
  h: number;
}

const DIMENSIONS = {
  width: 1200,
  height: 1200,
};

export type RasterizedElementHierarchy = {
  levelNumber: number;
  level: string;
  name: string;
  id: string;
};

export type RasterizedElement = {
  dataUrl: string;
  id: string;
  name: string; // From data-name attribute
  levelName: string; // From data-level-name attribute
  x: number;
  y: number;
  width: number;
  height: number;
  skipUpload: boolean; // Optional property to skip upload
  hierarchy: RasterizedElementHierarchy[];
};

type SvgData = {
  svgName: string;
  svgLevelName: string;
  svgId: string;
};

type RasterizedData = {
  elements: RasterizedElement[];
  svgData: SvgData | null;
};

/**
 * Rasterizes the SVG string and his contents
 * Converts the SVG to a PNG image based on the SVG string and a query selector.
 * Uses Puppeteer to render the SVG and convert it to a PNG.
 * @param svgString - The SVG string to convert.
 * @param selector - The CSS selector to target the SVG element.
 *
 */

export async function rasterizeSvg(
  svgString: string,
  selector: string
): Promise<RasterizedData> {
  console.log("Prepare to launch browser and rasterize SVG elements");

  const browser = await puppeteer.launch(puppeteerLaunchArgs);

  console.log("Browser launched");
  const page = await browser.newPage();

  console.log("Setting content");
  // First, define the required functions in the browser context
  await page.evaluate(() => {
    // Copy getRotationTransform, getTransformedBBox, etc. here
    window.getRotationTransform = function getRotationTransform(
      element: SVGElement
    ) {
      const transformAttr = element.getAttribute("transform");
      if (!transformAttr) return { angle: 0, cx: 0, cy: 0 };

      // Match "rotate(angle cx cy)" format
      const match = transformAttr.match(
        /rotate\((-?\d+(?:\.\d+)?)(?:\s+(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?))?\)/
      );

      if (!match) return { angle: 0, cx: 0, cy: 0 };

      const angle = parseFloat(match[1]); // Rotation angle
      const cx = match[2] ? parseFloat(match[2]) : 0; // Center X (optional)
      const cy = match[3] ? parseFloat(match[3]) : 0; // Center Y (optional)

      return { angle, cx, cy };
    };

    window.getTransformedBBox = function getTransformedBBox(
      element: SVGGraphicsElement
    ) {
      const bbox = element.getBBox();
      const { angle, cx, cy } = window.getRotationTransform(element);

      if (angle === 0) return bbox; // No rotation, return normal bbox

      const radians = (angle * Math.PI) / 180; // Convert degrees to radians

      // Four original corners of the bbox
      const corners = [
        { x: bbox.x, y: bbox.y }, // Top-left
        { x: bbox.x + bbox.width, y: bbox.y }, // Top-right
        { x: bbox.x, y: bbox.y + bbox.height }, // Bottom-left
        { x: bbox.x + bbox.width, y: bbox.y + bbox.height }, // Bottom-right
      ];

      // Rotate each corner around (cx, cy)
      const rotatedCorners = corners.map(({ x, y }) => {
        const dx = x - cx;
        const dy = y - cy;
        return {
          x: cx + dx * Math.cos(radians) - dy * Math.sin(radians),
          y: cy + dx * Math.sin(radians) + dy * Math.cos(radians),
        };
      });

      // Compute new bbox from rotated corners
      const xValues = rotatedCorners.map((p) => p.x);
      const yValues = rotatedCorners.map((p) => p.y);

      const xMin = Math.min(...xValues);
      const xMax = Math.max(...xValues);
      const yMin = Math.min(...yValues);
      const yMax = Math.max(...yValues);

      return {
        x: parseFloat(xMin.toFixed(3)),
        y: parseFloat(yMin.toFixed(3)),
        width: parseFloat((xMax - xMin).toFixed(3)),
        height: parseFloat((yMax - yMin).toFixed(3)),
      };
    };

    window.getRelativeSize = function getRelativeSize(
      first: Size,
      second: Size
    ): number {
      // Calculate the area of the first element
      const area1 = first.w * first.h;

      // Calculate the area of the second element
      const area2 = second.w * second.h;

      // Calculate the relative size as a percentage
      const relativeSize = (area2 / area1) * 100;

      return relativeSize;
    };

    window.getScale = function getScale(
      relativeSize: number,
      minScale: number = 3,
      factor: number = 1
    ): number {
      // Ensure the relative size is not zero or negative
      if (relativeSize <= 0) {
        throw new Error("Relative size must be positive.");
      }

      // Calculate the scale using an inverse relationship
      const scale = minScale + (1 / relativeSize) * factor;

      // Ensure the scale is never below the minimum value
      return Math.max(scale, minScale);
    };

    window.getElementNameFromId = function (id: string) {
      const index = id.indexOf("--");
      const name = index !== -1 ? id.slice(0, index) : id;
      return name.replace(/^[^a-zA-Z]+|[^a-zA-Z]+$/g, "").trim();
    };

    window.getLevelFromId = function (id: string) {
      const level = id.split("--")[1];

      const levelWithoutNumbers = level.replace(/[^a-zA-Z]/g, "");

      return levelWithoutNumbers;
    };

    window.getElementLevelFromId = function (id: string) {
      const levelObject = {
        ps: "Production system",
        lf: "Life fate",
        ph: "Phase",
        ci: "Circumstance",
      };

      const levelWithoutNumbers = window.getLevelFromId(id);

      if (levelObject[levelWithoutNumbers as keyof typeof levelObject]) {
        return levelObject[levelWithoutNumbers as keyof typeof levelObject];
      }
      return levelWithoutNumbers;
    };

    window.deslugify = function (slug: string) {
      return slug
        .replace(/-/g, " ")
        .replace(/_/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/\b\w/g, (c) => c.toUpperCase());
    };
  });

  console.log("Functions defined in browser context");
  // Create HTML with the SVG
  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          html, body { 
            margin: 0; 
            padding: 0; 
            width: 100vw; 
            height: 100vh; 
            overflow: hidden;
          }
          body {
            display: flex;
            justify-content: center;
            align-items: center;
          }                
        </style>
      </head>
      <body>
        ${svgString}
      </body>
    </html>
  `);

  console.log("SVG content set");

  page.setViewport({
    height: DIMENSIONS.height,
    width: DIMENSIONS.width,
  });

  page.on("console", (message) => {
    console.log(`Browser console: ${message.text()}`);
  });

  console.log("Viewport set");

  // Get the SVG element and its bounding bo
  const elementsData = await page.evaluate((selectorParam) => {
    const levels = {
      ps: 0,
      lf: 1,
      ph: 2,
      ci: 3,
    };

    const levels_inverted = {
      0: "ps",
      1: "lf",
      2: "ph",
      3: "ci",
    };

    const svgElement = document.querySelector("svg");

    if (!svgElement) return;

    const allElements = document.querySelectorAll(selectorParam);

    const promises = [];

    for (const element of allElements) {
      const isCircumstance = element.id.includes("--ci");

      // Extract data-name and data-level-name attributes
      const name = window.getElementNameFromId(element.id);
      const levelName = window.getElementLevelFromId(element.id);

      const getHierarchy = (element: Element) => {
        const level = window.getLevelFromId(element.id);
        const levelNumber = levels[level as keyof typeof levels];

        if (!levelNumber) {
          return [];
        }

        let previousLevel = levelNumber - 1;

        const hierarchy: {
          levelNumber: number;
          level: string;
          name: string;
          id: string;
        }[] = [];

        let currentElement = element;

        while (currentElement && previousLevel >= 0) {
          const levelString =
            levels_inverted[previousLevel as keyof typeof levels_inverted];

          if (!levelString) {
            break;
          }

          const closest = currentElement.closest(`[id*="--${levelString}"]`);

          if (!closest) {
            break;
          }

          const elementName = window.getElementNameFromId(closest.id);
          const readableName = window.deslugify(elementName);
          const levelName = window.getElementLevelFromId(closest.id);

          hierarchy.push({
            levelNumber: previousLevel,
            level: levelName,
            name: readableName,
            id: elementName,
          });

          currentElement = closest;
          previousLevel--;
        }

        return hierarchy.reverse();
      };

      const hierarchy = getHierarchy(element);

      if (isCircumstance) {
        promises.push(
          Promise.resolve({
            dataUrl: "",
            id: element.id,
            name,
            levelName,
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            skipUpload: isCircumstance,
            hierarchy,
          })
        );
        continue; // Skip rasterization for this element
      }

      const { width, height, x, y } = window.getTransformedBBox(
        element as SVGGraphicsElement
      );
      const elementString = element.outerHTML;
      const svgString = `<svg 
        xmlns="http://www.w3.org/2000/svg" 
        xmlns:xlink="http://www.w3.org/1999/xlink" 
        viewBox="${x} ${y} ${width} ${height}"
      >
        ${elementString}
      </svg>`;

      if (width <= 0 || height <= 0) {
        console.log(
          `Element ${element.id} has invalid dimensions: width=${width}, height=${height}`
        );

        continue; // Skip this element
      }

      const relativeSize = window.getRelativeSize(
        { w: svgElement.clientWidth, h: svgElement.clientHeight },
        { w: width, h: height }
      );

      const scale = window.getScale(relativeSize, 3, 1);

      const svgBlob = new Blob([svgString], { type: "image/svg+xml" });
      const url = URL.createObjectURL(svgBlob);
      promises.push(
        new Promise<RasterizedElement | null>((resolve) => {
          const img = new Image();

          img.crossOrigin = "anonymous";

          img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            if (ctx) {
              ctx.imageSmoothingEnabled = false;
            }

            const safeScale = Math.min(scale, 10); // Cap maximum scale
            const safeWidth = Math.max(
              1,
              Math.min(width * safeScale, 8192 / 2)
            ); // Prevent zero width and cap maximum
            const safeHeight = Math.max(
              1,
              Math.min(height * safeScale, 8192 / 2)
            ); // Prevent zero height and cap maximum

            canvas.width = safeWidth;
            canvas.height = safeHeight;

            ctx?.drawImage(img, 0, 0);
            URL.revokeObjectURL(url);

            const dataUrl = canvas.toDataURL("image/png", 1.0);

            resolve({
              dataUrl,
              id: element.id,
              name,
              levelName,
              x,
              y,
              width,
              height,
              skipUpload: isCircumstance,
              hierarchy,
            });
          };

          // Handle errors in image loading
          img.onerror = (error) => {
            URL.revokeObjectURL(url);
            console.error(`Failed to load image for group ${element.id}:`, {
              dimensions: { width, height, x, y, scale },
              svgString: svgString, // Log part of the SVG string
            });
            resolve(null);
          };

          img.src = url;
        })
      );
    }

    const resolvedPromises = Promise.all(promises);

    return resolvedPromises;
  }, selector);

  console.log("SVG elements processed");
  const svgData = await page.evaluate(() => {
    const svgElement = document.querySelector("svg");
    console.log("SVG Element:", svgElement);
    if (!svgElement) return null;

    const svgName = window.getElementNameFromId(svgElement.id);
    const svgLevelName = window.getElementLevelFromId(svgElement.id);

    const svgId = svgElement.id || "root";

    return { svgName, svgLevelName, svgId };
  });

  await browser.close();

  if (!elementsData) {
    throw new Error("SVG processing failed");
  }

  const filteredElementsData = elementsData.filter(
    (element) => element !== null
  ) as RasterizedElement[];

  console.log("SVG processing completed");

  return { elements: filteredElementsData, svgData: svgData };
}
