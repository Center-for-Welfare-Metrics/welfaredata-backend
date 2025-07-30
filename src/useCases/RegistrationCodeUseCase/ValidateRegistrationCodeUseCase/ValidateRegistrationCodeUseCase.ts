import { Config } from "@/src/models/Config";

interface ValidateRegistrationCodeParams {
  registrationCode: string;
}

export class ValidateRegistrationCodeUseCase {
  async execute(params: ValidateRegistrationCodeParams): Promise<boolean> {
    const { registrationCode } = params;

    try {
      const config = await Config.findOne().exec();

      if (!config) {
        throw new Error("No registration code configured");
      }

      return config.registrationCode === registrationCode;
    } catch (error: any) {
      console.error("Error validating registration code:", error);
      throw new Error(error.message || "Failed to validate registration code");
    }
  }
}
