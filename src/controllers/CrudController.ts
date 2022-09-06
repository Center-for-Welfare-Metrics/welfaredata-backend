import mongoose from "mongoose";

import { NextFunction, Request, Response } from "express";

import {
  CREATE,
  DELETE_BY_ID,
  READ,
  READ_ONE,
  READ_ONE_BY_ID,
  UPDATE,
} from "@/useCases/CRUD";

import { upload } from "@/storage/storage";
import { IMedia } from "@/models/Processogram";

class RegularCrudController {
  model: mongoose.Model<any>;
  populate?: string;

  constructor(model: mongoose.Model<any>, populate?: string) {
    this.model = model;
    this.populate = populate;
  }

  get_one_by_id = (request: Request, response: Response) => {
    let { _id } = request.params;
    READ_ONE_BY_ID({
      _id,
      Model: this.model,
    })
      .then((document) => {
        if (document) {
          if (this.populate) {
            document
              .populate(this.populate)
              .execPopulate()
              .then((populated: any) => {
                response.success(populated);
              });
          } else {
            response.success(document);
          }
        } else {
          response.notFound();
        }
      })
      .catch((error) => {
        response.internalServerError(error);
      });
  };

  read_one = (request: Request, response: Response) => {
    let query = request.body;

    READ_ONE({
      query,
      Model: this.model,
    })
      .then((document) => {
        if (document) {
          response.success(document);
        } else {
          response.notFound();
        }
      })
      .catch((error) => {
        response.internalServerError(error);
      });
  };

  create = (request: Request, response: Response) => {
    let values = request.body;
    let { auth_user } = request;
    CREATE({
      values: { ...values, createdBy: auth_user?._id },
      Model: this.model,
    })
      .then((created: any) => {
        if (this.populate) {
          created
            .populate(this.populate)
            .execPopulate()
            .then((populated: any) => {
              response.success(populated);
            });
        } else {
          response.success(created);
        }
      })
      .catch((error: any) => {
        response.internalServerError(error);
      });
  };

  read = (request: Request, response: Response) => {
    let values = request.body;
    READ({
      skip: 0,
      limit: 50,
      query: values,
      Model: this.model,
    })
      .then((documents) => {
        response.success(documents);
      })
      .catch((error) => {
        response.internalServerError(error);
      });
  };

  update = (request: Request, response: Response) => {
    let values = request.body;
    let { auth_user } = request;
    let { _id } = request.params;
    UPDATE({
      _id,
      Model: this.model,
      values: { ...values, lastUpdatedBy: auth_user?._id },
    })
      .then((updated_document) => {
        response.success(updated_document);
      })
      .catch((error) => {
        response.internalServerError(error);
      });
  };

  update_next = (request: Request, response: Response, next: NextFunction) => {
    let values = request.body;
    let { auth_user } = request;
    let { _id } = request.params;
    UPDATE({
      _id,
      Model: this.model,
      values: { ...values, lastUpdatedBy: auth_user?._id },
    })
      .then(() => {
        next();
      })
      .catch((error) => {
        response.internalServerError(error);
      });
  };

  upload = (request: any, response: Response) => {
    let { _id } = request.params;

    let { originalname, buffer, mimetype, size } = request.file as any;

    upload(originalname, buffer, mimetype)
      .then((value) => {
        let source = value.Location;
        let new_media: IMedia = {
          originalName: originalname,
          url: source,
          size: size,
          type: mimetype,
        };
        this.model.findById(_id).then((document_finded) => {
          console.log(document_finded);
          document_finded.medias.push(new_media);

          document_finded.save();

          response.success(document_finded);
        });
      })
      .catch((error) => {
        response.internalServerError(error);
      });
  };

  deleteById = (request: Request, response: Response) => {
    let { _id } = request.params;
    DELETE_BY_ID({
      _id,
      Model: this.model,
    })
      .then(() => {
        response.success();
      })
      .catch((error) => {
        response.internalServerError(error);
      });
  };
}

export default RegularCrudController;
