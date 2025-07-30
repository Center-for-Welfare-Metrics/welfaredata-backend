import { Config, IConfig } from "@/src/models/Config";

export class GetRegistrationCodeUseCase {
  async execute(): Promise<IConfig | null> {
    try {
      const config = await Config.findOne().exec();
      return config;
    } catch (error: any) {
      console.error("Error getting registration code:", error);
      throw new Error(error.message || "Failed to get registration code");
    }
  }
}
