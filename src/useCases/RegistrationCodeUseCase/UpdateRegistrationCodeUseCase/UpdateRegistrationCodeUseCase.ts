import { Config, IConfig } from "@/src/models/Config";

interface UpdateRegistrationCodeParams {
  registrationCode: string;
}

export class UpdateRegistrationCodeUseCase {
  async execute(params: UpdateRegistrationCodeParams): Promise<IConfig> {
    const { registrationCode } = params;

    try {
      // Find existing config or create new one
      let config = await Config.findOne().exec();

      if (config) {
        // Update existing config
        config.registrationCode = registrationCode;
        await config.save();
      } else {
        // Create new config
        config = await Config.create({ registrationCode });
      }

      return config;
    } catch (error: any) {
      console.error("Error updating registration code:", error);
      throw new Error(error.message || "Failed to update registration code");
    }
  }
}
