import fs from "fs"
import path from "path"
export default defineEventHandler(async (event) => {
	const body = await readBody(event)
	const currentDir = process.cwd()
	const templateDir = path.join(currentDir, "resources/youtube")
	console.log(body.oldName, body.newName)
	const oldTemplateFile = path.join(templateDir, `${body.oldName}.txt`)
	const newTemplateFile = path.join(templateDir, `${body.newName}.txt`)
	try {
		if (!fs.existsSync(templateDir)) {
			fs.mkdirSync(templateDir, { recursive: true })
			console.log("Directory created:", templateDir)
		}
		// Delete old template file if it exists
		if (fs.existsSync(oldTemplateFile)) {
			fs.unlinkSync(oldTemplateFile)
			console.log("Old template file deleted:", oldTemplateFile)
		}
		// Create new template file
		fs.writeFileSync(newTemplateFile, "This is a placeholder file.")
		console.log("Template file name set:", body.newName)
		return body.newName
	} catch (error) {
		console.error("Error setting template file name:", error)
		return null
	}
})
