import UserModel from "@/models/User";
import { signIn, logOut } from "@/helpers/auth/authentication";
import { Request, Response } from "express";
import { CREATE } from "@/useCases/CRUD";
import { ValidateRegistrationCodeUseCase } from "@/src/useCases/RegistrationCodeUseCase/ValidateRegistrationCodeUseCase/ValidateRegistrationCodeUseCase";
import { v4 as uuid } from "uuid";
import { UpdateRegistrationCodeUseCase } from "../useCases/RegistrationCodeUseCase/UpdateRegistrationCodeUseCase/UpdateRegistrationCodeUseCase";

const AuthControllerr = {
  /**
   * REQUEST BODY PARAMS
   * @param email string
   * @param password string
   * @returns User Object -> {_id, email, name,createdBy? }
   */
  login: async (request: Request, response: Response) => {
    const { email, password } = request.body;
    try {
      const user = await UserModel.findOne({ email }).exec();
      if (user) {
        user
          .validatePassword(password)
          .then((result) => {
            signIn(result, user, response);
          })
          .catch(() => {
            response.notFound({
              email: ["Credentials not found."],
            });
          });
      } else {
        response.notFound({
          email: ["Credentials not found."],
        });
      }
    } catch (error) {
      response.internalServerError(error);
    }
  },
  /**
   * REQUEST BODY PARAMS
   * @param name string
   * @param email string
   * @param password string
   * @param registrationCode string
   * @returns User Object -> {_id, email, name,createdBy? }
   */
  register: async (request: Request, response: Response) => {
    try {
      const { name, email, password, registrationCode } = request.body;

      // Validate registration code
      const validateRegistrationCodeUseCase =
        new ValidateRegistrationCodeUseCase();
      const isValidCode = await validateRegistrationCodeUseCase.execute({
        registrationCode,
      });

      if (!isValidCode) {
        return response.status(400).json({
          registrationCode: ["Invalid registration code"],
        });
      }

      const user = await CREATE({
        values: { name, email, password },
        Model: UserModel,
      });

      const updateRegistrationCode = new UpdateRegistrationCodeUseCase();

      await updateRegistrationCode.execute({
        registrationCode: uuid(),
      });

      return signIn(true, user, response);
    } catch (error) {
      response.internalServerError(error);
    }
  },
  logout: (request: Request, response: Response) => {
    logOut(response);
  },
};

export default AuthControllerr;
