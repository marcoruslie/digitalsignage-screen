import fs from "fs";
import path from "path";
export default defineEventHandler((event) => {
    const currentDir = process.cwd()
    const templateDir = path.join(currentDir, "resources/template");
    try {
        if (!fs.existsSync(templateDir)) {
            fs.mkdirSync(templateDir, { recursive: true });
            console.log("Directory created:", templateDir);
        }
        const files = fs.readdirSync(templateDir);
        const templateFileName = files.find((file) => {
            const filePath = path.join(templateDir, file);
            return fs.statSync(filePath).isFile();
        });
        return templateFileName ? templateFileName.split(".")[0] : "loading";
    } catch (error) {
        console.error("Error getting template file name:", error);
        return null;
    }
});
