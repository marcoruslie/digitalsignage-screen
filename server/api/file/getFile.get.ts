import fs from 'fs';
import path from 'path';

export default defineEventHandler(async (event) => {
  const directoryPath = './resources';
  try {
    const files = await readDirectory(directoryPath);
    const fileList = await getFileList(files, directoryPath);
    
    return fileList;
  } catch (error) {
    console.error('Error:', error);
    return []; 
  }
})


function readDirectory(directoryPath: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    fs.readdir(directoryPath, (err, files) => {
      if (err) {
        reject(err);
      } else {
        resolve(files);
      }
    });
  });
}

async function getFileList(files: string[], directoryPath: string): Promise<string[]> {
  let fileList: string[] = [];

  for (const file of files) {
    const filePath: string = path.join(directoryPath, file);
    const fileStats: fs.Stats = fs.statSync(filePath);
    if (fileStats.isFile()) {
      fileList.push(file);
      // console.log('File:', file);
    } else if (fileStats.isDirectory()) {
      // console.log('Directory:', file);
    }
  }

  return fileList;
}
