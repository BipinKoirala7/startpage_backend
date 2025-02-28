import { Router, Request, Response } from "express";
import { v4 } from "uuid";
import jwt from "jsonwebtoken";
import { compareSync, hashSync } from "bcryptjs";
import { configDotenv } from "dotenv";

import { createResponseObject } from "../util";
import connection from "../database/database";
import { QueryResult } from "pg";
import { userT } from "../types";

configDotenv();

const authenticationRouter = Router();

authenticationRouter
  .route("/login")
  .post(async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      if (email === null || password === null) {
        throw new Error("Email or password not provided");
      }
      const { rows: data }: QueryResult<userT> = await connection.query({
        text: "SELECT * FROM users WHERE email = $1",
        values: [email],
      });
      if (!data || data.length === 0) {
        throw new Error("No any user with the given email");
      } else {
        const {
          password: hashPassword,
          } = data[0];
          console.log(hashPassword);
          const isVerified = compareSync(password, hashPassword as string);
        if (!isVerified) throw new Error("Incorrect email or password");
        else {
          jwt.sign(
            {
              user_id: data[0].user_id,
              email: email,
            },
            process.env.JWT_SECRET_KEY as string,
            {
              expiresIn: 2 * 24 * 60 * 60,
            },
            (err, token) => {
              if (err) throw new Error(err.message);
              res.status(200).send(
                createResponseObject(
                  false,
                  {
                    token,
                  },
                  200,
                  "Successfully logged in"
                )
              );
            }
          );
        }
      }
    } catch (error: any) {
      res
        .status(500)
        .send(createResponseObject(true, null, 500, error.message));
    }
  });

authenticationRouter
  .route("/register")
  .post(async (req: Request, res: Response) => {
    try {
      const info = req.body;
      const user_id = v4();
      if (info === null) throw new Error("No data provided");
      if (info.email === null || info.password === null)
        throw new Error("Email or password not provided");
      const hashPassword = hashSync(info.password, 10);
      const dateNow = new Date().toISOString();
      const { rows: data } = await connection.query({
        text: "INSERT INTO users (user_id,email,password,username,created_at) VALUES ($1,$2,$3,$4,$5)",
        values: [user_id, info.email, hashPassword, info.username, dateNow],
      });
      jwt.sign(
        {
          user_id,
          email: info.email,
        },
        process.env.JWT_SECRET_KEY as string,
        {
          expiresIn: 2 * 24 * 60 * 60,
        },
        (err, token) => {
          if (err) throw new Error(err.message);
          res.status(200).send(
            createResponseObject(
              false,
              {
                token,
              },
              200,
              "Successfully registered in"
            )
          );
        }
      );
    } catch (error: any) {
      res
        .status(500)
        .send(createResponseObject(true, null, 500, error.message));
    }
  });

export default authenticationRouter;
