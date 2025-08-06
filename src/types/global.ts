export {};

interface Size {
  w: number;
  h: number;
}

interface RotationTransform {
  angle: number;
  cx: number;
  cy: number;
}

interface BBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

declare global {
  interface Window {
    getScale: (
      relativeSize: number,
      minScale?: number,
      factor?: number
    ) => number;
    getRotationTransform: (element: SVGElement) => RotationTransform;
    getTransformedBBox: (element: SVGGraphicsElement) => BBox;
    getTransformData: (element: SVGGraphicsElement) => {
      rotation: RotationTransform;
      translation: { tx: number; ty: number };
    };
    getRelativeSizeFromBBox: (bbox: BBox) => Size;
    getRelativeSizeFromElement: (element: SVGGraphicsElement) => Size;
    getRelativeSizeFromElements: (elements: SVGGraphicsElement[]) => Size;
    getRelativeSizeFromElementsById: (ids: string[]) => Size;
    getRelativeSize: (first: Size, second: Size) => number;
    getElementNameFromId: (id: string) => string;
    getElementLevelFromId: (id: string) => string;
    getLevelFromId: (id: string) => string;
    deslugify: (slug: string) => string;
  }
}
