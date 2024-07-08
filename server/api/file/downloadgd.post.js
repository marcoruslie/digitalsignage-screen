import fs from "fs";
import path from "path";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  try {
    const fileUrl = `https://drive.google.com/uc?id=${body.file_id}&export=download`;

    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error(response);
    }

    // Extract the filename and extension from the Content-Disposition header
    const contentDisposition = response.headers.get("Content-Disposition");
    const matches = contentDisposition.match(/filename="(.+?)"/);
    const filename = matches ? matches[1] : "filename"; // Get the filename without extension

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const currentDir = process.cwd();
    // Construct the full file path
    const filePath = path.join(currentDir,"resource", body.an_id, body.type, filename);
    const directoryPath = path.dirname(filePath);
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true }); // Create directory recursively
    }

    // Write the buffer data to the file
    fs.writeFileSync(filePath, buffer);
    return {
      statusCode: 200,
      body: {
        message: "File downloaded successfully",
        filePath: filePath,
      },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: {
        message: "Failed to download file",
        error: error.message,
      },
    };
  }
});