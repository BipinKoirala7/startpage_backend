import { Router, Response,Request } from "express";
import { v4 } from "uuid";
import { config } from "dotenv";

config();

import folderRouter from "./folder.routes";
import linkRouter from "./link.routes";
import credentialsRouter from "./credentials.routes";
import iconUrlRouter from "./IconURl.routes";
import { createResponseObject } from "../util";

const apiRouter = Router();

apiRouter.get("/id", (req:Request,res: Response) => {
  res.send(
    createResponseObject(
      false,
      { id: v4() },
      200,
      "Every time there will be a new id"
    )
  );
});

apiRouter.use("/folders", folderRouter);
apiRouter.use("/links", linkRouter);
apiRouter.use("/credentials", credentialsRouter);
apiRouter.use("/iconUrl", iconUrlRouter);

export default apiRouter;
