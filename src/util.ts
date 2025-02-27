import { apiResponseT } from "./types";

export function createResponseObject(error:boolean,data:any,statusCode:number,message:string):apiResponseT<any>{
    return {
        error,
        data,
        statusCode,
        message
    }
}