import { type MultiPartData } from 'h3';
import { createStorage } from 'unstorage';
import fsLiteDriver from "unstorage/drivers/fs-lite";
import {randomUUID} from 'node:crypto';

const FILE_KEYS = ['name', 'filename', 'type', 'data']
const isFile = (data:MultiPartData)=>{
    return Object.keys(data).filter(key=>FILE_KEYS.includes(key)).length === FILE_KEYS.length;
}

const storage = createStorage({
    driver: fsLiteDriver({ base: './resources' })
})
const saveFile = async (file: MultiPartData,index: MultiPartData) => {
    const [_mime, ext] = String(file.type).split('/');
    const fileName = `${"Asset"}${index}.${ext}`;
    // console.log("ITEM",file.data)
    await storage.setItemRaw(fileName, file.data);
}
const parseMultiPart = (data?: MultiPartData[]) => {
    const arr = (Array.isArray(data)? data : []) as MultiPartData[];
    const result = arr.reduce((prev: Record<string, any>, curr) => {
        prev[String(curr.name)] = isFile(curr)? curr : curr.data.toString("utf-8");   
        return prev;
    },{})
    console.log(result)
    return result
}
export default defineEventHandler(async (event) => {
    try {
        const body = await readMultipartFormData(event);
        const parsed = parseMultiPart(body);
        saveFile(parsed.file, parsed.index);
        return { message: 'File uploaded successfully'};
    } catch (error) {
        console.log(error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal Server Error',
        });
    }
});
