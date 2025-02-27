import { Router, Request, Response } from "express";
import connection from "../database/database";
import { createResponseObject } from "../util";
import { v4 } from "uuid";

const credentialsRouter = Router();

// this is used to get the information of the user
credentialsRouter.route("/get").get(async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const data = await connection.query(
      "SELECT * FROM  WHERE email=? AND password=?",
      [email, password]
    );
    res.send(createResponseObject(false, data, 200, "OK"));
  } catch (error: any) {
    res.send(createResponseObject(true, null, 400, error.message));
  }
});

// this is used to create a new user for the program
credentialsRouter.route("/create").post(async (req: Request, res: Response) => {
  try {
    const { userName, email, password } = req.body;
    const date = new Date();
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    const month =
      date.getMonth() < 10 ? `0${date.getMonth() + 1}` : date.getMonth();
    const year = date.getFullYear();
    const date_now = `${year}-${month}-${day}`;
    const data = await connection.query(
      "INSERT INTO users (user_id,userName,email,password,created_At) VALUES (?,?,?,?,?)",
      [v4(), userName, email, password, date_now]
    );
    res.send(createResponseObject(false, data, 200, "OK"));
  } catch (error: any) {
      res.send(createResponseObject(true, null, 400, error.message));
  }
});

// this is used to edit the user information
credentialsRouter.route("/edit").patch(async (req: Request, res: Response) => {
    try {
        const { changeProperty, new_value, user_id } = req.body;
        const response = await connection.query(`UPDATE users SET ${changeProperty}=? WHERE user_id=?`, [new_value, user_id]);
        res.send(createResponseObject(false, response, 200, "OK"));
    } catch (error:any) {
        res.send(createResponseObject(true, null, 400, error.message));
    }
})

// this is used to delete the user 
credentialsRouter.route("/delete").delete(async (req: Request, res: Response) => {
    try {
        const { user_id } = req.body;
        const response = await connection.query("DELETE FROM users WHERE user_id=?", [user_id]);
        res.send(createResponseObject(false, response, 200, "OK"));
    } catch (error:any) {
        res.send(createResponseObject(true, null, 400, error.message));
    }
})

export default credentialsRouter;