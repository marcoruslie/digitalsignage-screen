import { useRuntimeConfig } from "#app"
import fs from "fs"
import path from "path"

export default () => {
	const config = useRuntimeConfig()
	const getFilePath = (directory: string, fileName: string) => {
		try {
			return path.resolve(config.public.resourcesDir, directory, fileName)
		} catch (error) {
			console.error("Error:", error)
			return ""
		}
	}
	// Read JSON file
	const readJsonFile = (directory: string, filename: string) => {
		try {
			const filePath = getFilePath(directory, filename)
			const data = fs.readFileSync(filePath, "utf-8")
			return JSON.parse(data)
		} catch (error) {
			console.error("Error reading JSON file:", error)
			return null
		}
	}

	// Write to JSON file
	const writeJsonFile = (directory: string, filename: string, content: any) => {
		try {
			const filePath = getFilePath(directory, filename)
			fs.writeFileSync(filePath, JSON.stringify(content, null, 2), "utf-8")
			console.log("JSON file saved:", filePath)
		} catch (error) {
			console.error("Error writing JSON file:", error)
		}
	}
	return { readJsonFile, writeJsonFile}
}
