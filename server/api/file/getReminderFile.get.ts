import fs from "fs";
import path from "path";
import { format, isAfter, isBefore, isToday, parse } from "date-fns";

// Function to read JSON file content
async function readJsonFile(filePath: string): Promise<any> {
  return new Promise((resolve, reject) => {
    // Check if the file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        // File doesn't exist, create it with default content
        const defaultContent = JSON.stringify([], null, 2); // Default structure
        if (!fs.existsSync(path.dirname(filePath))) {
          fs.mkdirSync(path.dirname(filePath), { recursive: true });
        }
        fs.writeFile(filePath, defaultContent, "utf8", (err) => {
          if (err) {
            reject(`Error creating file: ${err}`);
          } else {
            console.log(`File created: ${filePath}`);
            resolve(JSON.parse(defaultContent)); // Return default content
          }
        });
      } else {
        // File exists, read it
        fs.readFile(filePath, "utf8", (err, data) => {
          if (err) {
            reject(`Error reading file: ${err}`);
          } else {
            resolve(JSON.parse(data));
          }
        });
      }
    });
  });
}

export default defineEventHandler(async (event) => {
  try {
    const reminderPath = "./resources/reminder/reminder.json";
    const fileJson = await readJsonFile(reminderPath);
    const filteredReminder = fileJson.filter(
      (reminder: any) =>
        isBefore(
          parse(reminder.Startdate, "dd MMMM yyyy", new Date()),
          new Date()
        ) || isToday(parse(reminder.Startdate, "dd MMMM yyyy", new Date()))
    );
    // Return the updated reminders
    return filteredReminder;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
});
