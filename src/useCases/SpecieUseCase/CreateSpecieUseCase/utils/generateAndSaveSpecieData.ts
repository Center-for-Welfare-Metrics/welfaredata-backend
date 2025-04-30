import { generateSpecieData } from "./generateSpecieData";
import SpecieModel from "@/models/Specie";

type Params = {
  specieName: string;
  _id: string;
};

export const generateAndSaveSpecieData = async ({
  _id,
  specieName,
}: Params) => {
  console.log("Generating species data...");

  const specieData = await generateSpecieData({
    specieName,
  });

  if (!specieData) {
    console.error("Failed to generate species data");
    return;
  }

  console.log("Species data generated successfully!");

  console.log("Saving species data...");

  await SpecieModel.findByIdAndUpdate(
    _id,
    {
      description: specieData.description,
    },
    { new: true }
  );

  console.log("Species data generated and saved successfully:", specieName);
};
