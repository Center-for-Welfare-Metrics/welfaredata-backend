import { Express } from "express";
import root from "./root";
import processogram from "./processogram";
import admin from "./admin";
import specie from "./specie";
import production_system from "./production_system";
import life_fate from "./life_fate";
import phase from "./phase";
import circumstance from "./circumstance";
import issue from "./issue";
import publicRoutes from "./public";

export default (app: Express) => {
  app.use("/", root);
  app.use("/processogram", processogram);
  app.use("/admin", admin);
  app.use("/specie", specie);
  app.use("/productionSystem", production_system);
  app.use("/lifeFate", life_fate);
  app.use("/phase", phase);
  app.use("/circumstance", circumstance);
  app.use("/issue", issue);
  app.use("/public", publicRoutes);
};
