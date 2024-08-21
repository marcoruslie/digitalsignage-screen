import fs from "fs"
import path from "path"
import { format } from "date-fns"
import { fi } from "date-fns/locale"

export default defineEventHandler(async (event) => {
	try {
		const reminderPath = "./resources/reminder/reminder.json"
		const fileJson = await readJsonFile(reminderPath)

		return fileJson
	} catch (error) {
		console.error("Error:", error)
		return []
	}
})
function readDirectories(directoryPath: string): Promise<string[]> {
	return new Promise((resolve, reject) => {
		fs.readdir(directoryPath, { withFileTypes: true }, (err, files) => {
			if (err) {
				reject(err)
			} else {
				const directories = files.filter((file) => file.isDirectory()).map((directory) => directory.name)
				resolve(directories)
			}
		})
	})
}
async function getFileList(files: string[], directoryPath: string, formattedDate: string): Promise<any[]> {
	for (const file of files) {
		const filePath: string = path.resolve(directoryPath, file)
		const fileStats: fs.Stats = await fs.promises.stat(filePath)

		// Check if the file is a JSON file
		if (fileStats.isFile() && path.extname(file) === ".json") {
			// Read and parse the JSON file
			const jsonData = await readJsonFile(filePath)
			return jsonData // Push the JSON content directly to the fileList
		}
	}

	return []
}

// Function to read JSON file content
async function readJsonFile(filePath: string): Promise<any> {
	return new Promise((resolve, reject) => {
		fs.readFile(filePath, "utf8", (err, data) => {
			if (err) {
				reject(err)
			} else {
				resolve(JSON.parse(data))
			}
		})
	})
}
