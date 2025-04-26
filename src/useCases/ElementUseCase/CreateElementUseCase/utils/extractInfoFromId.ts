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
