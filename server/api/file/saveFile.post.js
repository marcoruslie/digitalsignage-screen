// Assuming this is in an Express.js environment
import fs from "fs"
import path from "path"

export default defineEventHandler(async (event) => {
	try {
		const body = await readBody(event)
		const { files } = JSON.parse(body)

		files.forEach((file) => {
			const { an_fileName, fileData, kategori } = file
			const fileDir = path.join(process.cwd(), "resources/", kategori)
			const filePath = path.join(process.cwd(), "resources/", kategori, an_fileName)
			console.log("Saving file:", filePath)
			if (!fs.existsSync(fileDir)) {
				fs.mkdirSync(fileDir, { recursive: true }) // Create the directory recursively
			}
			// Convert base64 string back to binary and save the file
			fs.writeFileSync(filePath, Buffer.from(fileData, "base64"))
		})

		return {
			status: "success",
		}
	} catch (error) {
		console.error("Error saving files:", error)
		return "error"
	}
})
