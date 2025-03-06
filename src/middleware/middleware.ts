import { NextFunction, Request, Response } from "express";
import connection from "../database/database";
import { createResponseObject } from "../util";

const checkiFUserAlreadyExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;
    if (email === null) {
      throw new Error("Email not provided");
    }
    const { rows: data } = await connection.query({
      text: "SELECT * FROM users WHERE email = $1",
      values: [email],
    });
    if (data && data.length > 0) {
      throw new Error("User with the given email already exists");
    } else {
      next();
    }
  } catch (error: any) {
    res.status(400).send(createResponseObject(true, null, 400, error.message));
  }
};

export { checkiFUserAlreadyExists };
