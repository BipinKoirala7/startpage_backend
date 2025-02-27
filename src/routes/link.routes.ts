import { Router, Request, Response } from "express";

import connection from "../database/database";
import { createResponseObject } from "../util";
import { QueryResult } from "pg";
import {  linkT } from "../types";

const linkRouter = Router();

// this route is use to get the link with specific folder_id and link_id
linkRouter
  .route("/:folder_id/:link_id/get")
  .get(async (req: Request, res: Response) => {
    try {
      const { folder_id, link_id } = req.params;
      const { rows: data }: QueryResult<linkT> = await connection.query(
        "SELECT * FROM links WHERE folder_id = ? AND link_id = ?",
        [folder_id, link_id]
      );
      res.send(createResponseObject(false, data, 200, "Success"));
    } catch (error: any) {
      res.send(createResponseObject(true, null, 400, error.message));
    }
  });

// you can join the get and the delete route by avoiding writing "get" and "delete" in the route
// I choose it because it makes it easy for me to distinguish each route

// this router deletes a link from a folder using link_id and filder_id
linkRouter
  .route("/:folder_id/link_id/delete")
  .delete(async (req: Request, res: Response) => {
    try {
      const { folder_id, link_id } = req.params;
      const { rows: data }: QueryResult<linkT> = await connection.query(
        "DELETE FROM links WHERE link_id = ? AND folder_id = ? ",
        [link_id, folder_id]
      );
      res.send(createResponseObject(true, data, 400, "Success"));
    } catch (error: any) {
      res.send(createResponseObject(true, null, 400, error.message));
    }
  });

// this route creates a new link in the given folder
linkRouter.route("/create").post(async (req: Request, res: Response) => {
  try {
    const {
      link_id,
      folder_id,
      link_name,
      link_icon_url,
      link_background_color,
      link_url,
      created_at,
    }: linkT = req.body;
    const { rows: data }: QueryResult<linkT> = await connection.query(
      "INSERT INTO links (link_id,folder_id,link_name,link_icon_url,link_background_color,link_url,created_at) VALUES (?,?,?,?,?,?,?)",
      [
        link_id,
        folder_id,
        link_name,
        link_icon_url,
        link_background_color,
        link_url,
        created_at,
      ]
    );
    console.log("congratulation a new link is created");
    res.send(createResponseObject(false, data, 200, "OK"));
  } catch (error: any) {
    res.send(createResponseObject(true, null, 400, error.message));
  }
});

// this route gets all the links in a folder
linkRouter.route("/:folder_id").get(async (req: Request, res: Response) => {
  try {
    const { folder_id } = req.params;
    const { rows: data }: QueryResult<linkT> = await connection.query(
      "SELECT * FROM links WHERE folder_id = ?",
      [folder_id]
    );
    res.send(createResponseObject(false, data, 200, "Sucess"));
  } catch (error: any) {
    res.send(createResponseObject(true, null, 400, error.message));
  }
});

// this route is used to change the contains of the link
// linkRouter
//     .route("/:link_id/edit")
//     .put(async (req: Request, res: Response) => {
//         try {
//             const { link_id } = req.params;
//             const response = await connection.query("DELETE FROM links WHERE link_id = ?",[link_id]);
//             const info = req.body;
//             if (req.body != null) throw new Error("Body is missing properties");
//             const [data] = await connection.query(
//               "INSERT INTO links(link_id,folder_id,link_name,link_placeholder,link_icon_id,link_background_color,created_At) VALUES (?,?,?,?,?,?,?)"
//             );
//             res.send(createResponseObject(false,data,200,"OK"))
//         } catch (error:any) {
//             res.send(createResponseObject(true, null, 400, error.message));
//         }
//     })

linkRouter
  .route("/:link_id/edit")
  .patch(async (req: Request, res: Response) => {
    try {
      const { link_id, new_value, changeProperty } = req.body;
      const { rows: data }: QueryResult<linkT> = await connection.query(
        `UPDATE links SET ${changeProperty}=? WHERE link_id=?`,
        [new_value, link_id]
      );
      res.send(createResponseObject(false, data, 200, "OK"));
    } catch (error: any) {
      res.send(createResponseObject(true, null, 400, error.message));
    }
  });

// A link can be created,requested,changed the parts of it,deleted

export default linkRouter;
