import { Request, Response } from "express";
import UserModel from "@/models/User";
import { READ, CREATE, UPDATE, DELETE_BY_ID } from "@/useCases/CRUD";

const ManageUsersController = {
  /**
   * REQUEST QUERY PARAMS
   * @param skip? number
   * @param limit? number
   * @param name? string
   * @param email? string
   * @param createdBy? objectId
   * @returns data: User Object Array -> [ {_id, email, name,createdBy? } ]
   * @returns count: Count of total documents matched on filter
   */
  get: async (request: Request, response: Response) => {
    let { skip, limit, createdBy } = request.query;
    try {
      const users = await UserModel.find(
        {},
        {
          password: 0,
        },
        {
          skip: Number(skip || 0) ?? 0,
          limit: Number(limit || 10) ?? 10,
        }
      );

      response.success(users);
    } catch (error) {
      response.internalServerError(error);
    }
  },
  /** 
        REQUEST BODY PARAMS
        @param name string
        @param email string
        @param password string
        @param role objectId
    */
  create: (request: Request, response: Response) => {
    let { name, email, password, role } = request.body;
    CREATE({
      values: {
        name,
        email,
        password,
        role,
        createdBy: request.auth_user?._id,
      },
      Model: UserModel,
    }).then(() => {
      response.success();
    });
  },
  /** 
        REQUEST BODY PARAMS
        @param role objectId
    */
  update: (request: Request, response: Response) => {
    let { _id } = request.params;
    let { role } = request.body;
    UPDATE({
      _id,
      values: {
        role,
      },
      Model: UserModel,
    }).then(() => {
      response.success();
    });
  },
  delete: (request: Request, response: Response) => {
    let { _id } = request.params;

    DELETE_BY_ID({ _id, Model: UserModel }).then(() => {
      response.success();
    });
  },
};

export default ManageUsersController;
