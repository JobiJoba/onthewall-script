import { createMockup1610 } from "./create-mockup"
import fs from "fs/promises"
import {
  getFiles,
  getStartNumber,
  upscaleImages,
  upscale_image_process_one,
} from "./utils"




export async function upscale1610() {
  console.log(" === Start Move Img ===")
  const proc = Bun.spawn(["./moveImg.sh", "hello"])

  await new Response(proc.stdout).text()

  const filesInSell = (await getFiles("./To-Sell/16-10/")) ?? []

  const startNumber = getStartNumber(filesInSell)

  console.log(` === startNumber ${startNumber} ===`)

  let allFilesPath = (await getFiles(`./UNPROCESSED/16-10/`)) ?? []

  try {
    console.log(` === 1-Process ${allFilesPath.length} files ===`)

    let savePathProcessOne = `./1-Process/16-10/`

    await upscale_image_process_one(
      allFilesPath,
      savePathProcessOne,
      `./archive/16-10/${startNumber}`,
      2048,
      1452
    )

    let allFilesPathProcess = (await getFiles(savePathProcessOne)) ?? []

    console.log(` === 2-Process  ===`)

    await upscaleImages(allFilesPathProcess, "16-10")
  } catch (e) {
    console.log(e)
  }

  console.log("====== Batch convert   ========")

  const procBatchResize = Bun.spawn(["./batch-16-10.sh"])
  const procBatchResizeWebsite = Bun.spawn(["./batch-16-10-website.sh"])

  const batchResize = await new Response(procBatchResize.stdout).text()
  const batchWebsite = await new Response(procBatchResizeWebsite.stdout).text()
  console.log(batchResize)
  console.log(batchWebsite)

  console.log("====== Deleting files   ========")

  let allFilesPathProcess = (await getFiles(`./2-Process/16-10/`)) ?? []

  for (const filesToDelete of allFilesPathProcess) {
    await fs.unlink(filesToDelete)
  }

  const filesInSellAfterProcessing = await getFiles("./To-Sell/16-10-website/")

  const removeWhatWeDontNeed = filesInSellAfterProcessing?.map((file) => {
    return {
      number: parseInt(file.split("-").pop()?.split(".")[0], 10),
      fileName: file,
    }
  })

  const newMockupToProcess =
    removeWhatWeDontNeed?.filter((file) => file.number > startNumber) ?? []

  for (const image of newMockupToProcess) {
    await createMockup1610({
      imagepath: "./process-mockup/16-10-mockup.jpg", // the original image
      saveimagepath: `./To-Sell/16-10-mockup/WM-OTW-${image.number.toString()}.jpg`, // where to save the processed image
      watermarkpath: "./" + image.fileName,
    })

    // createYaml();
  }
}
