import path from "path"
import fs from "fs"

export default defineEventHandler(async (event) => {
	try {
		const body = await readBody(event)
		const { resourceDir, fileName, json } = body

		// Construct the file path
		const directoryPath = path.resolve(process.cwd(), "resources", resourceDir)
		const filePath = path.join(directoryPath, fileName)

		// Check if the directory exists, if not, create it
		if (!fs.existsSync(directoryPath)) {
			fs.mkdirSync(directoryPath, { recursive: true })
		}

		// Write the JSON data to the file
		fs.writeFileSync(filePath, JSON.stringify(json, null, 2), "utf-8")

		return new Response("File changed successfully!", { status: 200 })
	} catch (error) {
		console.error("Error writing file:", error)
		return new Response(`Error: ${error}`, { status: 500 })
	}
})
