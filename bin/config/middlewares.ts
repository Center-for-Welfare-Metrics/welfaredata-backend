import { Express } from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";

export default (app: Express) => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(
    cors({
      credentials: true,
      origin: [
        process.env.CLIENT_DOMAIN as string,
        process.env.CLIENT_DOMAIN_2 as string,
      ],
    })
  );
  app.use(helmet());
  app.use(morgan("dev"));
};
