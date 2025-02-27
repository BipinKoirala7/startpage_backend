import { Router, Request, Response } from "express";
import ogs from 'open-graph-scraper';
import { createResponseObject } from "../util";
import { ErrorResult, SuccessResult } from "open-graph-scraper/types/lib/types";

const iconUrlRouter = Router();

iconUrlRouter.route("/:url").get(async (req: Request, res: Response) => {
    try {
        const { url } = req.params;
        const options = {
            url:url
        }
        const data:SuccessResult | ErrorResult = await ogs(options);
        const result = {
            favicon:data.result.favicon,
            image:data.result.ogImage
        }
        res.send(createResponseObject(false, result, 200, "OK"));
    } catch (error:any) {
        res.send(createResponseObject(true, null, 400, error.message));
    }
})

export default iconUrlRouter;