import "dotenv/config";
import database from "./config/database";
database();
import middlewaresAppConfig from "./config/middlewares";
import express from "express";

import http from "http";

import routes from "../src/routes";

const app = express();

import express_custom from "./config/express-customizer";

express_custom(app);

middlewaresAppConfig(app);

app.use(express.static(__dirname, { dotfiles: "allow" }));

app.get("/test", (req, res) => {
  res.send("Server is running :)");
});

routes(app);

const server = new http.Server(app);
server.listen(process.env.PORT || 8080);
