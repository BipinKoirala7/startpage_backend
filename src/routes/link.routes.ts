import { Router, Request, Response } from "express";

import connection from "../database/database";
import { createResponseObject } from "../util";
import { QueryResult } from "pg";
import { linkT } from "../types";

const linkRouter = Router();

// this route is use to get the link with specific folder_id and link_id and  deletes a link from a folder using link_id and filder_id
linkRouter
  .route("/:folder_id/:link_id")
  .get(async (req: Request, res: Response) => {
    try {
      const { folder_id, link_id } = req.params;
      const { rows: data }: QueryResult<linkT> = await connection.query({
        text: "SELECT * FROM links WHERE folder_id = $1 AND link_id = $2",
        values: [folder_id, link_id],
      });
      res.send(createResponseObject(false, data, 200, "OK"));
    } catch (error: any) {
      res.send(createResponseObject(true, null, 400, error.message));
    }
  })
  .patch(async (req: Request, res: Response) => {
    try {
      const { folder_id, link_id } = req.params;
      if (req.body != null) throw new Error("Body is missing properties");
      const { new_value, changeProperty } = req.body;
      const { rows: data }: QueryResult<linkT> = await connection.query({
        text: `UPDATE links SET ${changeProperty}=$1 WHERE link_id=$2 AND folder_id=$3`,
        values: [new_value, link_id, folder_id],
      });
      res.send(createResponseObject(false, data, 200, "OK"));
    } catch (error: any) {
      res.send(createResponseObject(true, null, 400, error.message));
    }
  })
  .delete(async (req: Request, res: Response) => {
    try {
      const { folder_id, link_id } = req.params;
      const { rows: data }: QueryResult<linkT> = await connection.query({
        text: "DELETE FROM links WHERE link_id = $1 AND folder_id = $2",
        values: [link_id, folder_id],
      });
      res.send(createResponseObject(true, data, 400, "OK"));
    } catch (error: any) {
      res.send(createResponseObject(true, null, 400, error.message));
    }
  });

// you can join the get and the delete route by avoiding writing "get" and "delete" in the route

// this route creates a new link in the given folder
linkRouter.route("/create").post(async (req: Request, res: Response) => {
  try {
    if (req.body != null) throw new Error("Body is missing properties");
    const {
      link_id,
      folder_id,
      link_name,
      link_icon_url,
      link_background_color,
      link_url,
      created_at,
    }: linkT = req.body;
    const { rows: data }: QueryResult<linkT> = await connection.query({
      text: "INSERT INTO links (link_id,folder_id,link_name,link_icon_url,link_background_color,link_url,created_at) VALUES ($1,$2,$3,$4,$5,$6,$7)",
      values: [
        link_id,
        folder_id,
        link_name,
        link_icon_url,
        link_background_color,
        link_url,
        created_at,
      ],
    });
    res.send(createResponseObject(false, data, 201, "CREATED"));
  } catch (error: any) {
    res.send(createResponseObject(true, null, 400, error.message));
  }
});

// this route gets all the links in a folder
linkRouter.route("/:folder_id").get(async (req: Request, res: Response) => {
  try {
    const { folder_id } = req.params;
    const { rows: data }: QueryResult<linkT> = await connection.query({
      text: "SELECT * FROM links WHERE folder_id = $1",
      values: [folder_id],
    });
    res.send(createResponseObject(false, data, 200, "Sucess"));
  } catch (error: any) {
    res.send(createResponseObject(true, null, 400, error.message));
  }
});

export default linkRouter;
