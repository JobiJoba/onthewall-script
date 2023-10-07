import { getFiles } from "./get-dir"
import fs from "fs/promises"
import { getStartNumber, upscale_image_square } from "./utils"
import { createMockupSquare } from "./create-mockup"

console.log(" === Start Move Img ===")
const proc = Bun.spawn(["./moveImg.sh", "hello"])

await new Response(proc.stdout).text()

const filesInSell = (await getFiles("./To-Sell/square/")) ?? []

const startNumber = getStartNumber(filesInSell)

console.log(` === startNumber ${startNumber} ===`)

let allFilesPath = (await getFiles(`./UNPROCESSED/square/`)) ?? []

try {
  await upscale_image_square(allFilesPath, startNumber)
} catch (e) {
  console.log(e)
}

console.log("====== Batch convert   ========")

const procBatchResize = Bun.spawn(["./batch-square.sh"])
const batchResize = await new Response(procBatchResize.stdout).text()

const procBatchResizeWebsite = Bun.spawn(["./batch-square-website.sh"])
const batchWebsite = await new Response(procBatchResizeWebsite.stdout).text()
console.log(batchResize)
console.log(batchWebsite)

console.log("====== Deleting files   ========")

let allFilesPathProcess = (await getFiles(`./1-Process/square/`)) ?? []

for (const filesToDelete of allFilesPathProcess) {
  await fs.unlink(filesToDelete)
}

const filesInSellAfterProcessing = await getFiles("./To-Sell/square-website/")

const removeWhatWeDontNeed = filesInSellAfterProcessing?.map((file) => {
  return {
    number: parseInt(file.split("-").pop()?.split(".")[0], 10),
    fileName: file,
  }
})

const newMockupToProcess =
  removeWhatWeDontNeed?.filter((file) => file.number > startNumber) ?? []

for (const image of newMockupToProcess) {
  console.log("img to process mockup", image.fileName)
  await createMockupSquare({
    imagepath: "./process-mockup/square-mockup.jpg", // the original image
    saveimagepath: `./To-Sell/square-mockup/WM-OTWS-${image.number.toString()}.jpg`, // where to save the processed image
    watermarkpath: "./" + image.fileName,
  })
}
