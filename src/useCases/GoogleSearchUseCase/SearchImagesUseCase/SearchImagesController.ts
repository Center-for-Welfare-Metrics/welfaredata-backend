import { Request, Response } from "express";
import { SearchImagesUseCase } from "./SearchImagesUseCase";
import { RasterizedElementHierarchy } from "../../ProcessogramUseCase/CreateProcessogramUseCase/utils/rasterizeSvg";

type RequestBody = {
  hierarchy: RasterizedElementHierarchy[];
};

class SearchImagesController {
  async search(req: Request<any, any, RequestBody>, res: Response) {
    try {
      const { hierarchy } = req.body;

      const searchImagesUseCase = new SearchImagesUseCase();
      const result = await searchImagesUseCase.execute({
        hierarchy,
      });

      return res.status(200).json(result);
    } catch (error: any) {
      console.error("Error in SearchImagesController:", error);
      return res.status(500).json({
        error: error.message || "Failed to search images",
      });
    }
  }
}

export default new SearchImagesController();
