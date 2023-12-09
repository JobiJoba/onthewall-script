import Jimp from "jimp"
import fs from "fs/promises"
import { readdir } from "node:fs/promises"
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

export function getStartNumber(filesInSell: string[]) {
  const removeOTW = filesInSell.map((file) =>
    parseInt(file.split("-").pop()?.split(".")[0], 10)
  )

  return removeOTW?.length === 0 ? 1 : Math.max(...removeOTW) ?? 1
}

async function base64_encode(path: string) {
  const file = Bun.file(path)

  const arrbuf = await file.arrayBuffer()
  return Buffer.from(arrbuf).toString("base64")
}

async function base64_decode(base64str: string, file: string) {
  // create buffer object from base64 encoded string, it is important to tell the constructor that the string is base64 encoded
  var bitmap = Buffer.from(base64str, "base64")
  // write buffer to file
  // fs.writeFile(file, bitmap)
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

export async function upscale_image_1016_35_single(allFilesPath: string[]) {
  let arrFiles = []
  for (const filePath of allFilesPath) {
    let file = await base64_encode(filePath)

    arrFiles.push({
      data: file,
      name: filePath.split("/").pop(),
      fileName: filePath.split("/").pop()!.split(".")[0],
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
      `./2-Process/10-16/${arrFile.fileName}.png`
    )

    console.log(`Creating ./2-Process/10-16/${arrFile.fileName}.png`)

    fs.unlink(`./1-Process/10-16/${arrFile.name}`)
  }
}

export async function upscale_image_1610_35_single(allFilesPath: string[]) {
  let arrFiles = []
  for (const filePath of allFilesPath) {
    let file = await base64_encode(filePath)

    arrFiles.push({
      data: file,
      name: filePath.split("/").pop(),
      fileName: filePath.split("/").pop()!.split(".")[0],
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
      `./2-Process/16-10/${arrFile.fileName}.png`
    )

    console.log(`Creating ./2-Process/16-10/${arrFile.fileName}.png`)

    fs.unlink(`./1-Process/16-10/${arrFile.name}`)
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
