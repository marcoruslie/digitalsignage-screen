import fs from "fs"
import path from "path"
export default defineEventHandler(async (event) => {
	return getFileList("./resources")
})
async function getFileList(directoryPath: string): Promise<{ date: string; pl_id: string }[]> {
	let fileList: { date: string; pl_id: string }[] = []

	// Read the /resources directory
	const directories = await fs.promises.readdir(directoryPath)

	// Iterate over each directory in /resources
	for (const directory of directories) {
		// Check if the directory name matches the "ddmmyy" format
		if (/^\d{6}$/.test(directory)) {
			const directoryPathFull = path.join(directoryPath, directory)
			const isDirectory = (await fs.promises.stat(directoryPathFull)).isDirectory()

			// If it's a directory
			if (isDirectory) {
				// Read files in the directory
				const files = await fs.promises.readdir(directoryPathFull)

				// Look for .txt files
				const txtFiles = files.filter((file) => path.extname(file) === ".txt")

				// If a .txt file is found, push it to the fileList array
				if (txtFiles.length === 1) {
					fileList.push({
						date: directory,
						pl_id: path.basename(txtFiles[0], ".txt"),
					})
				}
			}
		}
	}

	return fileList
}
