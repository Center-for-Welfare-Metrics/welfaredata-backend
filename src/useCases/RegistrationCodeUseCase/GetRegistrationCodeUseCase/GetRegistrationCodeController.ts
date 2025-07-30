import { Request, Response } from "express";
import { GetRegistrationCodeUseCase } from "./GetRegistrationCodeUseCase";

class GetRegistrationCodeController {
  async get(req: Request, res: Response) {
    try {
      const getRegistrationCodeUseCase = new GetRegistrationCodeUseCase();
      const config = await getRegistrationCodeUseCase.execute();

      if (!config) {
        return res.status(404).json({
          error: "Registration code not found",
        });
      }

      return res.status(200).json({
        registrationCode: config.registrationCode,
        createdAt: config.createdAt,
        updatedAt: config.updatedAt,
      });
    } catch (error: any) {
      console.error("Error in GetRegistrationCodeController:", error);
      return res.status(500).json({
        error: error.message || "Failed to get registration code",
      });
    }
  }
}

export const getRegistrationCodeController =
  new GetRegistrationCodeController();
