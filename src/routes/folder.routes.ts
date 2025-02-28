import { Router, Request, Response } from "express";

import connection from "../database/database";
import { createResponseObject } from "../util";
import { QueryResult } from "pg";
import { folderT, linkT } from "../types";

const folderRouter = Router();

folderRouter.route("").get(async (req: Request, res: Response) => {
  try {
    const { rows: data }: QueryResult<folderT> = await connection.query(
      `SELECT * FROM folders`
    );
    console.log(data);
    res.send(createResponseObject(false, data, 200, "Success"));
  } catch (error: any) {
    res.send(createResponseObject(true, null, 400, error.message));
  }
});

folderRouter
  .route("/:folder_id")
  .get(async (req: Request, res: Response) => {
    const folder_id = req.params.folder_id;
    try {
      const { rows: data }: QueryResult<folderT> = await connection.query({
        text: "SELECT * FROM folders WHERE folder_id=$1",
        values: [folder_id],
      });
      res.send(createResponseObject(false, data, 200, "Successful"));
    } catch (error: any) {
      res.send(createResponseObject(true, null, 400, error.message));
    }
  })
  .patch(async (req: Request, res: Response) => {
    try {
      const folder_id = req.params.folder_id;
      const { changeProperty, new_value } = req.body;
      const { rows: data }: QueryResult<folderT> = await connection.query({
        text: `UPDATE folders SET ${changeProperty}=$1 WHERE folder_id=$2`,
        values: [new_value, folder_id],
      });
      res.send(createResponseObject(false, data, 200, "OK"));
    } catch (error: any) {
      res.send(createResponseObject(true, null, 400, error.message));
    }
  })
  .delete(async (req: Request, res: Response) => {
    // when you delete the folder then you have to delete all the links inside the folders also..... yo chahi hernw parxa
    const folder_id = req.params.folder_id;
    try {
       await connection.query({
        text: "DELETE FROM links WHERE folder_id = $1",
        values:[folder_id]
      })
      const { rows: data }: QueryResult<folderT> = await connection.query({
        text:"DELETE FROM folders WHERE folder_id = $1",
        values:[folder_id]
      });
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
    }: folderT = req.body;
    const { rows: data }: QueryResult<folderT> = await connection.query({
      text:"INSERT INTO folders (folder_id,folder_name,folder_description,folder_icon_url,folder_background_color,created_at,updated_at) VALUES ($1,$2,$3,$4,$5,$6,$7)",
      values:[
        folder_id,
        folder_name,
        folder_description,
        folder_icon_url,
        folder_background_color,
        created_at,
        updated_at,
      ]
    });
    res.send(createResponseObject(false, data, 201, "CREATED "));
  } catch (error: any) {
    res.send(createResponseObject(true, null, 400, error.message));
  }
});


export default folderRouter;
