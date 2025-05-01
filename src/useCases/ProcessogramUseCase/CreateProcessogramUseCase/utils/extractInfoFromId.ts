import { RasterizedElementHierarchy } from "./rasterizeSvg";

export const getElementNameFromId = (id: string): string => {
  const index = id.indexOf("--");
  const name = index !== -1 ? id.slice(0, index) : id;
  return name.replace(/^[^a-zA-Z]+|[^a-zA-Z]+$/g, "").trim();
};

const levelObject = {
  ps: "Production system",
  lf: "Life fate",
  ph: "Phase",
  ci: "Circumstance",
};

export const getElementLevelFromId = (id: string): string => {
  const level = id.split("--")[1];

  const levelWithoutNumbers = level.replace(/[^a-zA-Z]/g, "");

  if (levelObject[levelWithoutNumbers as keyof typeof levelObject]) {
    return levelObject[levelWithoutNumbers as keyof typeof levelObject];
  }
  return levelWithoutNumbers;
};

export const getElementIdentifier = (
  id: string,
  hierarchy: RasterizedElementHierarchy[]
) => {
  const name = getElementNameFromId(id);

  if (hierarchy.length === 0) {
    return name;
  }

  const hierarchyString = hierarchy
    .sort((a, b) => a.levelNumber - b.levelNumber)
    .map((item) => item.id)
    .join(".");

  return `${hierarchyString}.${name}`;
};

export const getHierarchyString = (hierarchy: RasterizedElementHierarchy[]) => {
  const hierarchyString = hierarchy
    .sort((a, b) => b.levelNumber - a.levelNumber)
    .map((item) => `${item.level} - ${item.name}`)
    .join(", ");

  return hierarchyString;
};
