import { Router, Response,Request } from "express";
import { v4 } from "uuid";
import { config } from "dotenv";

config();

import folderRouter from "./folder.routes";
import linkRouter from "./link.routes";
import iconUrlRouter from "./IconURl.routes";
import authenticationRouter from "./authentication.routes";

const apiRouter = Router();

apiRouter.use("/o2auth", authenticationRouter);
apiRouter.use("/folders", folderRouter);
apiRouter.use("/links", linkRouter);
apiRouter.use("/iconUrl", iconUrlRouter);

export default apiRouter;
