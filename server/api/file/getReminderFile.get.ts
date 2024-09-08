import fs from "fs";
import path from "path";
import { format, isBefore } from "date-fns";

// Function to read JSON file content
async function readJsonFile(filePath: string): Promise<any> {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(data));
      }
    });
  });
}

// Function to write updated JSON data to file
async function writeJsonFile(filePath: string, data: any): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8", (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

export default defineEventHandler(async (event) => {
  try {
    const reminderPath = "./resources/reminder/reminder.json";
    const fileJson = await readJsonFile(reminderPath);

    // Get the current date
    const today = new Date();

    // Filter out reminders that have a deadline before today
    const updatedReminders = fileJson.filter((reminder: any) => {
      const reminderDeadline = new Date(reminder.Deadline);
      return !isBefore(reminderDeadline, today);
    });

    // Write the updated reminders back to the file
    await writeJsonFile(reminderPath, updatedReminders);

    // Return the updated reminders
    return updatedReminders;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
});
