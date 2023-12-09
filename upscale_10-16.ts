import { createMockup1016, createMockup1016Homepage } from "./create-mockup"
import fs from "fs/promises"
import {
  getFiles,
  getStartNumber,
  upscaleImages,
  upscale_image_process_one,
} from "./utils"

export async function upscale1016() {
  console.log(" === Start Move Img ===")
  const proc = Bun.spawn(["./moveImg.sh", "hello"])

  await new Response(proc.stdout).text()

  const filesInSell = (await getFiles("./To-Sell/10-16/")) ?? []

  const startNumber = getStartNumber(filesInSell)

  console.log(` === startNumber ${startNumber} ===`)

  let allFilesPath = (await getFiles(`./UNPROCESSED/10-16/`)) ?? []

  try {
    console.log(` === 1-Process ${allFilesPath.length} files ===`)

    let savePathProcessOne = `./1-Process/10-16/`

    await upscale_image_process_one(
      allFilesPath,
      savePathProcessOne,
      `./archive/10-16/${startNumber}`,
      1452,
      2048
    )

    let allFilesPathProcess = (await getFiles(savePathProcessOne)) ?? []

    console.log(` === 2-Process  ===`)

    await upscale_image_1016_35_single(allFilesPathProcess)

    await upscaleImages(allFilesPathProcess, "10-16")
  } catch (e) {
    console.log(e)
  }

  console.log("====== Batch convert   ========")

  const procBatchResize = Bun.spawn(["./batch-10-16.sh"])
  const procBatchResizeWebsite = Bun.spawn(["./batch-10-16-website.sh"])

  const batchResize = await new Response(procBatchResize.stdout).text()
  const batchWebsite = await new Response(procBatchResizeWebsite.stdout).text()
  console.log(batchResize)
  console.log(batchWebsite)

  console.log("====== Deleting files   ========")

  let allFilesPathProcess = (await getFiles(`./2-Process/10-16/`)) ?? []

  for (const filesToDelete of allFilesPathProcess) {
    await fs.unlink(filesToDelete)
  }

  const filesInSellAfterProcessing = await getFiles("./To-Sell/10-16-website/")

  const removeWhatWeDontNeed = filesInSellAfterProcessing?.map((file) => {
    return {
      number: parseInt(file.split("-").pop()?.split(".")[0], 10),
      fileName: file,
    }
  })

  const newMockupToProcess =
    removeWhatWeDontNeed?.filter((file) => file.number > startNumber) ?? []

  for (const image of newMockupToProcess) {
    await createMockup1016({
      imagepath: "./process-mockup/10-16-mockup.jpg", // the original image
      saveimagepath: `./To-Sell/10-16-mockup/WM-OTW-${image.number.toString()}.jpg`, // where to save the processed image
      watermarkpath: "./" + image.fileName,
    })

    await createMockup1016Homepage({
      imagepath: "./process-mockup/10-16-mockup-homepage.jpg", // the original image
      saveimagepath: `./To-Sell/10-16-homepage/WM-OTW-${image.number.toString()}.jpg`, // where to save the processed image
      watermarkpath: "./" + image.fileName,
    })

    // createYaml();
  }
}
