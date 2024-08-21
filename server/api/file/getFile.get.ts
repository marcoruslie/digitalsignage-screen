import fs from "fs";
import path from "path";
import { format } from "date-fns";
import { fi } from "date-fns/locale";

export default defineEventHandler(async (event) => {
  try {
    const currentDate = new Date();
    const resourcePath = './resources/playlist';
    
    // Get list of directories inside /resources
    const directories = await readDirectories(resourcePath);
    
    // Filter directories to only include those with valid date names
    const dateDirectories = directories.filter(dir => isValidDateDirectory(dir));
    
    // Find the closest date directory to today but not higher
    const closestDateDir = findClosestDateDirectory(dateDirectories, currentDate);
    
    if (closestDateDir) {
      // Read files from the closest date directory
      const files = await readDirectory(path.join(resourcePath, closestDateDir));
      
      const fileList = await getFileList(files, path.join(resourcePath, closestDateDir),closestDateDir);
    
      return fileList;
    } else {
      console.error("No valid date directory found");
      return [
        "No valid date directory found"
      ];
    }
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
});

function readDirectories(directoryPath: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    fs.readdir(directoryPath, { withFileTypes: true }, (err, files) => {
      if (err) {
        reject(err);
      } else {
        const directories = files
          .filter(file => file.isDirectory())
          .map(directory => directory.name);
        resolve(directories);
      }
    });
  });
}

function isValidDateDirectory(directoryName: string): boolean {
  // Check if the directory name matches the format ddmmyy
  const dateRegex = /^\d{6}$/;
  return dateRegex.test(directoryName);
}

function findClosestDateDirectory(dateDirectories: string[], targetDate: Date): string | null {
  const targetTimestamp = targetDate.getTime();
  let closestDateDir: string | null = null;
  let minDiff = Infinity;

  dateDirectories.forEach(directory => {
    const directoryDate = parseDateFromDirectoryName(directory);
    if (directoryDate) {
      const directoryTimestamp = directoryDate.getTime();
      const diff = targetTimestamp - directoryTimestamp;
      if (diff >= 0 && diff < minDiff) {
        minDiff = diff;
        closestDateDir = directory;
      }
    }
  });

  return closestDateDir;
}

function parseDateFromDirectoryName(directoryName: string): Date | null {
  // Extract day, month, and year from directory name
  const day = parseInt(directoryName.substr(0, 2), 10);
  const month = parseInt(directoryName.substr(2, 2), 10) - 1; // Month is 0-indexed in Date
  const year = parseInt(directoryName.substr(4, 2), 10) + 2000; // Assuming years are in 21st century

  // Create a Date object from extracted components
  const date = new Date(year, month, day);
  
  // Check if the Date object is valid
  return isNaN(date.getTime()) ? null : date;
}

async function readDirectory(directoryPath: string): Promise<string[]> {
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

async function getFileList(files: string[], directoryPath: string, formattedDate:string): Promise<any[]> {
  let fileList = [];

  for (const file of files) {
    const filePath: string = path.resolve(directoryPath, file);
    const fileStats: fs.Stats = await fs.promises.stat(filePath);
    let dataContent = []
    if (fileStats.isDirectory()) {
      const listFiles = await readDirectory(filePath);
      for (const listFile of listFiles) {
        const listFilePath: string = path.resolve(filePath, listFile);
        const listFileStats: fs.Stats = await fs.promises.stat(listFilePath);
        if (listFileStats.isFile()) {
          const fileType = getFileType(listFile);
          const relativeFilePath = path.join("/resources/playlist", formattedDate, file, listFile);
          dataContent.push({
            url: relativeFilePath,
            type: fileType,
          });
        }
      }
    }
    
    fileList.push({
      duration: file.split('-')[1],
      dataContent
    });
  }

  return fileList;
}



function getFileType(fileName: string): string {
  const extension = path.extname(fileName).toLowerCase();
  if ([".jpg", ".jpeg", ".png", ".gif", ".bmp"].includes(extension)) {
    return "image";
  } else if ([".mp4", ".avi", ".mov", ".mkv", ".wmv"].includes(extension)) {
    return "video";
  } else {
    return "unknown"; // You can handle other file types as needed
  }
}
