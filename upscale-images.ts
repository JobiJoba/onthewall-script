import fs from "fs/promises"
import Jimp from "jimp"

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

async function base64_decode_bun(base64str: string, file: string) {
  // create buffer object from base64 encoded string, it is important to tell the constructor that the string is base64 encoded
  // var bitmap = new Buffer(base64str, "base64")
  // write buffer to file
  // fs.writeFile(file, bitmap)
  Bun.write(file, base64str)
  console.log("******** File created from base64 encoded string ********")
}

export async function upscale_image_1016(allFilesPath: string[], startNumber) {
  await fs.mkdir(`./archive/10-16/${startNumber}`)

  for (const filePath of allFilesPath) {
    let jimpFile = await Jimp.read(filePath)

    let newFile = jimpFile.cover(1452, 2048)

    let fileName = filePath.split("/").pop()?.split(".")[0]
    let originalFileName = filePath.split("/").pop()

    newFile.write(`./1-Process/10-16/${fileName}.png`)
    const file = Bun.file(filePath)
    await Bun.write(`./archive/10-16/${startNumber}/${originalFileName}`, file)
    fs.unlink(filePath)
  }

  // for (const filePath of allFilesPath) {

  //   let file = await base64_encode(filePath)

  //   arrFiles.push({
  //     data: file,
  //     name: filePath.split("/").pop(),
  //     fileName: filePath.split("/").pop()!.split(".")[0],
  //   })
  // }

  // for (const arrFile of arrFiles) {
  //   const data = {
  //     resize_mode: 1, //first resize 1452x2048
  //     show_extras_results: true,
  //     gfpgan_visibility: 0,
  //     codeformer_visibility: 0,
  //     codeformer_weight: 0,
  //     upscaling_resize_w: 1452,
  //     upscaling_resize_h: 2048,
  //     upscaling_crop: true,
  //     upscaler_1: "4x-UltraSharp",
  //     upscaler_2: "None",
  //     extras_upscaler_2_visibility: 0,
  //     upscale_first: false,
  //     image: arrFile.data,
  //   }
  //   console.log(`Before Extra Batch Images ${arrFile.name}`)

  //   let result = await fetch(
  //     "http://127.0.0.1:7860/sdapi/v1/extra-single-image",
  //     {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(data),
  //     }
  //   )

  //   let resJSON = await result.json()
  //   console.log(resJSON.html_info)
  //   let index = 0

  //   await base64_decode(
  //     resJSON.image,
  //     `./1-Process/10-16/${arrFile.fileName}.png`
  //   )
}

export async function upscale_image_square(allFilesPath: string[],startNumber) {
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
      upscaling_resize: 4,
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
        body: JSON.stringify(data),
      }
    )

    let resJSON = await result.json()
    console.log(resJSON.html_info)
    let index = 0

    await base64_decode(
      resJSON.image,
      `./1-Process/SQUARE/${arrFile.fileName}.png`
    )

    const file = Bun.file("./UNPROCESSED/SQUARE/" + arrFile.name)
    await Bun.write(`./archive/SQUARE/${arrFile.name}`, file)
    fs.unlink(`./UNPROCESSED/SQUARE/${arrFile.name}`)
    index++
  }
}

export async function upscale_image_1016_35(allFilesPath: string[]) {
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
      upscaling_resize_w: 1452,
      upscaling_resize_h: 2048,
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
