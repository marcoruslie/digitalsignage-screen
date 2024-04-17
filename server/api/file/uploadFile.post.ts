import { type MultiPartData } from 'h3';
import { createStorage } from 'unstorage';
import fsLiteDriver from "unstorage/drivers/fs-lite";
import {randomUUID} from 'node:crypto';
import { format } from 'date-fns'; 
import fs from 'fs';

const FILE_KEYS = ['name', 'filename', 'type', 'data']
const isFile = (data:MultiPartData)=>{
    return Object.keys(data).filter(key=>FILE_KEYS.includes(key)).length === FILE_KEYS.length;
}

const storage = createStorage({
    driver: fsLiteDriver({ base: './resources' })
})
const saveFile = async (file: MultiPartData,index: MultiPartData, date: Date) => {
    // const [_mime, ext] = String(file.type).split('/');
    // const fileName = `${"Asset"}${index}.${ext}`;
    // // console.log("ITEM",file.data)
    // await storage.setItemRaw(fileName, file.data);
    const [_mime, ext] = String(file.type).split('/');
    const fileName = `${"Asset"}${index}.${ext}`;
    const formattedDate = format(date, 'ddMMyy'); // Format the provided date as ddMMyy
    const directoryPath = `./resources/${formattedDate}`;

    // Check if the directory exists, if not, create it
    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true });
    }

    const filePath = `${directoryPath}/${fileName}`;
    
    await storage.setItemRaw(filePath, file.data);
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
        const date = new Date(parsed.date);
        saveFile(parsed.file, parsed.index, date);
        return { message: 'File uploaded successfully'};
    } catch (error) {
        console.log(error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal Server Error',
        });
    }
});
