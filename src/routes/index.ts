import { Express } from "express";
import root from "./root";
import admin from "./admin";
import issue from "./issue";
import publicRoutes from "./public";

export default (app: Express) => {
  app.use("/", root);
  app.use("/admin", admin);
  app.use("/issue", issue);
  app.use("/public", publicRoutes);
};
