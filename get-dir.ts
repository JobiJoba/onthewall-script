import { readdir } from "node:fs/promises"
import { join } from "node:path"

/**
 * @param {string | Buffer | URL} directoryPath
 * @returns {Promise<string[]>} - Array of long file paths
 */
export async function getFiles(directoryPath: string) {
  try {
    const fileNames = await readdir(directoryPath) // returns a JS array of just short/local file-names, not paths.
    const filePaths = fileNames.map((fn) => join(directoryPath, fn))
    return filePaths
  } catch (err) {
    console.error(err) // depending on your application, this `catch` block (as-is) may be inappropriate; consider instead, either not-catching and/or re-throwing a new Error with the previous err attached.
  }
}
