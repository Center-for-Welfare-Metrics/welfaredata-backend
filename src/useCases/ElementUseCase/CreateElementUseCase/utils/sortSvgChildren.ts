import puppeteer from "puppeteer-core";
import { puppeteerLaunchArgs } from "./puppeteerLaunchArgs";

// Extend the Window interface to include custom properties
declare global {
  interface Window {
    getRotationTransform: any;
    getTransformedBBox: any;
    getRelativeSize: any;
    getScale: any;
    getElementNameFromId: any;
    getElementLevelFromId: any;
    getLevelFromId: any;
    deslugify: any;
  }
}

/**
 * Sorts the children of an SVG string based on their size (smallest first).
 * Recursively applies sorting to all levels of the SVG.
 * @param svgString - The SVG string to process.
 * @returns The updated SVG string with sorted children.
 */
export async function sortSvgChildren(svgString: string): Promise<string> {
  console.log("Prepare to launch browser and sort SVG elements");
  const browser = await puppeteer.launch(puppeteerLaunchArgs);
  console.log("Browser launched");
  const page = await browser.newPage();

  // Create HTML with the SVG
  console.log("Setting content");
  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <body>
        ${svgString}
      </body>
    </html>
  `);

  // Process the SVG with actual rendering information
  const sortedSvg = await page.evaluate(() => {
    function sortElementChildren(element: Element) {
      if (element.hasAttribute("id")) {
        const children = Array.from(element.children);

        children.sort((a, b) => {
          try {
            const aBBox = (a as SVGGraphicsElement).getBBox();
            const bBBox = (b as SVGGraphicsElement).getBBox();

            const aArea = aBBox.width * aBBox.height;
            const bArea = bBBox.width * bBBox.height;

            return bArea - aArea;
          } catch (error) {
            return 0;
          }
        });

        // Reorder children
        children.forEach((child) => element.appendChild(child));
      }

      // Process children recursively
      Array.from(element.children).forEach((child) =>
        sortElementChildren(child)
      );
    }

    const svg = document.querySelector("svg");
    if (svg) {
      sortElementChildren(svg);
      return svg.outerHTML;
    }
    return null;
  });

  await browser.close();

  if (!sortedSvg) {
    throw new Error("SVG processing failed");
  }

  console.log("SVG processing completed");

  return sortedSvg;
}
