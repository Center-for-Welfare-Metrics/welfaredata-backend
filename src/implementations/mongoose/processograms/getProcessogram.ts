import { ProcessogramModel, IProcessogram } from "../../../models/Processogram";

export const getProcessogramById = async (
  processogramId: string
): Promise<IProcessogram | null> => {
  try {
    const processogram = await ProcessogramModel.findById(processogramId);

    if (!processogram) {
      throw new Error("Processogram not found");
    }

    return processogram;
  } catch (error: any) {
    console.error(
      `Error fetching processogram with ID ${processogramId}:`,
      error
    );
    throw new Error(error.message || "Failed to fetch processogram");
  }
};
