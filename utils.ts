import Jimp from "jimp"
import fs from "fs/promises"
import { readdir, stat } from "node:fs/promises"
import { join } from "node:path"

export async function upscale_image_process_one(
  allFilesPath: string[],
  savePath: string,
  archiveFolder: string,
  width: number,
  height: number
) {
  //create archive folder
  if (!(await fs.exists(archiveFolder))) {
    await fs.mkdir(archiveFolder)
  }

  // convert to 1452x2048 with cover and move the process to archive folder, move the converted to 1-process
  for (const filePath of allFilesPath) {
    let jimpFile = await Jimp.read(filePath)

    let newFile = jimpFile.cover(width, height)

    let fileName = filePath.split("/").pop()?.split(".")[0]
    let originalFileName = filePath.split("/").pop()

    newFile.write(`${savePath}${fileName}.png`)
    const file = Bun.file(filePath)
    await Bun.write(`${archiveFolder}/${originalFileName}`, file)
    await fs.unlink(filePath)
  }
}

export async function transformSquareIntoA3(
  allFilesPath: string[],
  savePath: string,
  width: number = 1452,
  height: number = 2048
) {
  // convert to 1452x2048 with cover and move the process to archive folder, move the converted to 1-process
  for (const filePath of allFilesPath) {
    try {
      let jimpFile = await Jimp.read(filePath)

      // Calculate the center of the image
      const centerX = jimpFile.getWidth() / 2
      const centerY = jimpFile.getHeight() / 2

      // Calculate the crop dimensions based on the desired aspect ratio
      const cropWidth = Math.min(
        jimpFile.getWidth(),
        jimpFile.getHeight() * (width / height)
      )
      const cropHeight = Math.min(
        jimpFile.getHeight(),
        jimpFile.getWidth() * (height / width)
      )

      // Perform the crop
      jimpFile.crop(
        centerX - cropWidth / 2,
        centerY - cropHeight / 2,
        cropWidth,
        cropHeight
      )

      let fileName = filePath.split("/").pop()?.split(".")[0]

      await jimpFile.writeAsync(`${savePath}${fileName}.png`)
    } catch (error) {
      console.error(`Error processing file: ${filePath}`, error)
      // Handle the error as needed (e.g., skip the file or log an error message)
    }
  }
}

export function getStartNumber(filesInSell: string[]) {
  const numbers = filesInSell.map((file) => {
    const parts = file.split("-")
    const numberPart = parts[parts.length - 1]?.split(".")[0]
    return numberPart ? parseInt(numberPart, 10) : NaN
  })

  const validNumbers = numbers.filter((number) => !isNaN(number))

  return validNumbers.length === 0 ? 1 : Math.max(...validNumbers)
}

async function base64_encode(path: string) {
  const file = Bun.file(path)
  const arrbuf = await file.arrayBuffer()
  return Buffer.from(arrbuf).toString("base64")
}

async function base64_decode(base64str: string, file: string) {
  var bitmap = Buffer.from(base64str, "base64")
  Bun.write(file, bitmap)
  console.log("******** File created from base64 encoded string ********")
}

export async function upscale_image_square(
  allFilesPath: string[],
  startNumber: number
) {
  console.log(`=== Archive ${startNumber} ===`)
  if (!(await fs.exists(`./archive/square/${startNumber}`))) {
    console.log("Doesn't exist, will create it")
    await fs.mkdir(`./archive/square/${startNumber}`)
  }
  let arrFiles = []

  for (const filePath of allFilesPath) {
    let file = await base64_encode(filePath)

    console.log(`=== filePath ${filePath} ===`)

    arrFiles.push({
      data: file,
      name: filePath.split("/").pop(),
      fileName: filePath.split("/").pop()!.split(".")[0],
      originalFilePath: filePath,
    })
  }

  for (const arrFile of arrFiles) {
    const data = {
      resize_mode: 0, //first resize 1452x2048
      show_extras_results: true,
      gfpgan_visibility: 0,
      codeformer_visibility: 0,
      codeformer_weight: 0,
      upscaling_resize: 4,
      upscaling_crop: true,
      upscaler_1: "4x-UltraSharp",
      upscaler_2: "None",
      extras_upscaler_2_visibility: 0,
      upscale_first: false,
      image: arrFile.data,
    }

    let result = await fetch(
      "http://127.0.0.1:7860/sdapi/v1/extra-single-image",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    )

    let resJSON = await result.json()
    console.log(`=== filePath ${resJSON.html_info} ===`)

    await base64_decode(
      resJSON.image,
      `./1-Process/square/${arrFile.fileName}.png`
    )

    console.log(`Creating ./1-Process/square/${arrFile.name}`)

    const file = Bun.file(arrFile.originalFilePath)
    await Bun.write(`./archive/square/${startNumber}/${arrFile.name}`, file)
    await fs.unlink(arrFile.originalFilePath)
  }
}

const fileNameWithoutExtension = (filePath: string) => {
  const fileNameWithExtension = filePath.split("/").pop()
  return fileNameWithExtension?.split(".")[0] || ""
}

export async function upscaleImages(
  allFilesPath: string[],
  outputDirectory: string
) {
  let arrFiles = []
  for (const filePath of allFilesPath) {
    let file = await base64_encode(filePath)

    arrFiles.push({
      data: file,
      name: filePath.split("/").pop(),
      fileName: fileNameWithoutExtension(filePath),
    })
  }

  for (const arrFile of arrFiles) {
    const data = {
      resize_mode: 0, //first resize 1452x2048
      show_extras_results: true,
      gfpgan_visibility: 0,
      codeformer_visibility: 0,
      codeformer_weight: 0,
      upscaling_resize: 3.5,
      upscaling_crop: true,
      upscaler_1: "4x-UltraSharp",
      upscaler_2: "None",
      extras_upscaler_2_visibility: 0,
      upscale_first: false,
      image: arrFile.data,
    }
    console.log(`Before Extra Batch Images ${arrFile.name}`)

    let result = await fetch(
      "http://127.0.0.1:7860/sdapi/v1/extra-single-image",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        timeout: false,
        body: JSON.stringify(data),
      }
    )

    let resJSON = await result.json()
    await base64_decode(
      resJSON.image,
      `./2-Process/${outputDirectory}/${arrFile.fileName}.png`
    )

    console.log(`Creating ./${outputDirectory}/${arrFile.fileName}.png`)

    fs.unlink(`./1-Process/${outputDirectory}/${arrFile.name}`)
  }
}

/**
 * @param {string | Buffer | URL} directoryPath
 * @returns {Promise<string[]>} - Array of long file paths
 */
export async function getFiles(directoryPath: string) {
  try {
    const fileNames = await readdir(directoryPath) // returns a JS array of just short/local file-names, not paths.
    const filePaths = fileNames.map((fn) => join(directoryPath, fn))
    return filePaths.filter((f) => f !== "")
  } catch (err) {
    console.error(err) // depending on your application, this `catch` block (as-is) may be inappropriate; consider instead, either not-catching and/or re-throwing a new Error with the previous err attached.
  }
}

export async function getFilesDir(directoryPath: string) {
  try {
    const entries = await readdir(directoryPath)

    const filePaths = await Promise.all(
      entries.map(async (entry) => {
        const fullPath = join(directoryPath, entry)
        const stats = await stat(fullPath)

        if (stats.isDirectory()) {
          // If it's a directory, recursively get files inside
          return await getFiles(fullPath)
        } else {
          // If it's a file, return the full path
          return fullPath
        }
      })
    )

    // Flatten the array of arrays into a single array of file paths
    return filePaths.flat().filter((f) => f !== "")
  } catch (err) {
    console.error(err)
    return [] // Return an empty array if there's an error
  }
}
