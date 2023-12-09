import { createMockupAll } from "./create-mockup"
import fs from "fs/promises"
import {
  getFiles,
  getStartNumber,
  upscaleImages,
  upscale_image_process_one,
} from "./utils"

export async function upscalehv(inputFolder: string = "16-10") {
  console.log(" === Start Move Img ===")
  const proc = Bun.spawn(["./moveImg.sh", "hello"])

  await new Response(proc.stdout).text()

  const filesInSell = (await getFiles(`./To-Sell/${inputFolder}/`)) ?? []

  const startNumber = getStartNumber(filesInSell)

  console.log(` === startNumber ${startNumber} ===`)

  let allFilesPath = (await getFiles(`./UNPROCESSED/${inputFolder}/`)) ?? []

  try {
    console.log(` === 1-Process ${allFilesPath.length} files ===`)

    let savePathProcessOne = `./1-Process/${inputFolder}/`

    await upscale_image_process_one(
      allFilesPath,
      savePathProcessOne,
      `./archive/${inputFolder}/${startNumber}`,
      inputFolder === "16-10" ? 2048 : 1452,
      inputFolder === "16-10" ? 1452 : 2048
    )

    let allFilesPathProcess = (await getFiles(savePathProcessOne)) ?? []

    console.log(` === 2-Process  ===`)

    await upscaleImages(allFilesPathProcess, inputFolder)
  } catch (e) {
    console.log(e)
  }

  console.log("====== Batch convert   ========")

  const procBatchResize = Bun.spawn([`./batch-${inputFolder}.sh`])
  const procBatchResizeWebsite = Bun.spawn([
    `./batch-${inputFolder}-website.sh`,
  ])

  const batchResize = await new Response(procBatchResize.stdout).text()
  const batchWebsite = await new Response(procBatchResizeWebsite.stdout).text()
  console.log(batchResize)
  console.log(batchWebsite)

  console.log("====== Deleting files   ========")

  let allFilesPathProcess =
    (await getFiles(`./2-Process/${inputFolder}/`)) ?? []

  for (const filesToDelete of allFilesPathProcess) {
    await fs.unlink(filesToDelete)
  }

  const filesInSellAfterProcessing = await getFiles(
    `./To-Sell/${inputFolder}-website/`
  )

  // const removeWhatWeDontNeed = filesInSellAfterProcessing?.map((file) => {
  //   return {
  //     number: parseInt(file.split("-").pop()?.split(".")[0], 10),
  //     fileName: file,
  //   }
  // })

  const removeWhatWeDontNeed = (filesInSellAfterProcessing || [])
    .map((file) => {
      const fileNameParts = file.split("-")
      const extensionPart = fileNameParts.pop()?.split(".")[0]

      if (!extensionPart) {
        // Handle the case where extensionPart is null or undefined
        console.error(`Invalid file format: ${file}`)
        return null // You can decide how to handle this case, e.g., skip the file
      }

      const number = parseInt(extensionPart, 10)

      if (isNaN(number)) {
        // Handle the case where parsing to integer fails
        console.error(`Invalid number format in file: ${file}`)
        return null // You can decide how to handle this case, e.g., skip the file
      }

      return {
        number,
        fileName: file,
      }
    })
    .filter((entry) => entry !== null)

  const newMockupToProcess =
    removeWhatWeDontNeed?.filter((file) => file!.number > startNumber) ?? []

  for (const image of newMockupToProcess) {
    //todo createMockuptogether
    await createMockupAll({
      imagepath: `./process-mockup/${inputFolder}-mockup.jpg`, // the original image
      saveimagepath: `./To-Sell/${inputFolder}-mockup/WM-OTW-${image!.number.toString()}.jpg`, // where to save the processed image
      watermarkpath: "./" + image!.fileName,
      resizeWidth: inputFolder === "16-10" ? 600 : 565,
      resizeHeight: inputFolder === "16-10" ? 426 : 810,
      compositeWidth: inputFolder === "16-10" ? 660 : 470,
      compositeHeight: inputFolder === "16-10" ? 145 : 93,
    })
  }
}
