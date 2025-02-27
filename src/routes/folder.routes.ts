import { Router, Request, Response } from "express";

import connection from "../database/database";
import { createResponseObject } from "../util";
import { QueryResult } from "pg";
import { folderT } from "../types";

const folderRouter = Router();

folderRouter.route("").get(async (req: Request, res: Response) => {
  try {
    const {rows:data}:QueryResult<folderT> = await connection.query(`SELECT * FROM folders`);
    console.log(data)
    res.send(createResponseObject(false,data,200,"Success"))
  } catch (error:any) {
    res.send(createResponseObject(true, null, 400, error.message));
  }
})

folderRouter
  .route("/:folder_id")
  .get(async (req: Request, res: Response) => {
    const folder_id = req.params.folder_id;
    try {
      const {rows:data}: QueryResult<folderT> = await connection.query(
        "SELECT * FROM `folders` WHERE folder_id=?",
        [folder_id]
      );
      console.log(data);
      res.send(createResponseObject(false, data, 200, "Query Successful"));
    } catch (error: any) {
      res.send(createResponseObject(true, null, 400, error.message));
    }
  })
  .delete(async (req: Request, res: Response) => {
    // when you delete the folder then you have to delete all the links inside the folders also..... yo chahi hernw parxa
    const folder_id = req.params.folder_id;
    try {
      const { rows: data }: QueryResult<folderT> = await connection.query(
        "DELETE * FROM `folders` WHERE folder_id = ?",
        [folder_id]
      );
      console.log(data);
      res.send(createResponseObject(false, data, 200, "Data deleted"));
    } catch (error: any) {
      res.send(createResponseObject(true, null, 400, error.message));
    }
  });

folderRouter.route("/create").post(async (req: Request, res: Response) => {
  try {
    const {
      folder_id,
      folder_name,
      folder_description,
      folder_icon_url,
      folder_background_color,
      created_at,
      updated_at,
    }:folderT = req.body;
    const { rows: data }: QueryResult<folderT> = await connection.query(
      `INSERT INTO folders (folder_id,folder_name,folder_description,folder_icon_url,folder_background_color,created_at,updated_at) VALUES (?,?,?,?,?,?,?)`,
      [
        folder_id,
        folder_name,
        folder_description,
        folder_icon_url,
        folder_background_color,
        created_at,
        updated_at,
      ]
    );
    res.send(createResponseObject(false, data, 200, "OK"));
  } catch (error: any) {
    res.send(createResponseObject(true, null, 400, error.message));
  }
});

folderRouter
  .route("/:folder_id/edit")
  .put(async (req: Request, res: Response) => {
    try {
      const { folder_id, changeProperty, new_value } = req.body;
      const { rows: data }: QueryResult<folderT> = await connection.query(
        `UPDATE folders SET ${changeProperty}=? WHERE folder_id=?`,
        [new_value, folder_id]
      );
      res.send(createResponseObject(false, data, 200, "OK"));
    } catch (error: any) {
      res.send(createResponseObject(true, null, 400, error.message));
    }
  });

// A folder can be created,requested,changed/edited and deleted

export default folderRouter;
