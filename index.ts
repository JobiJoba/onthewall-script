import { createMockup1610 } from "./create-mockup"
import { getFiles } from "./get-dir"
import { upscale_image_1016, upscale_image_1016_35 } from "./upscale-images"
import fs from "fs/promises"

const proc = Bun.spawn(["./moveImg.sh", "hello"])

const output = await new Response(proc.stdout).text()
console.log(output)

const filesInSell = await getFiles("./To-Sell/10-16/")

const removeOTW = filesInSell?.map((file) =>
  parseInt(file.split("-").pop()?.split(".")[0], 10)
)

const startNumber = removeOTW?.length === 0 ? 1 : Math.max(...removeOTW) ?? 1

async function processImage() {
  let allFilesPath = (await getFiles(`./UNPROCESSED/10-16/`)) ?? []

  try {
    console.log("====== process to 1458x2048 ========")
    await upscale_image_1016(allFilesPath, startNumber)
    let allFilesPathProcess = (await getFiles(`./1-Process/10-16/`)) ?? []
    console.log("====== upscale by 3.5  ========")

    await upscale_image_1016_35(allFilesPathProcess)
  } catch (e) {
    console.log("====== Timeout do it again ...  ========")
    console.log(e)

    await processImage()
  }
}

await processImage()

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

// // //create mockup

// // create mockup from startNumber

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
  await createMockup1610({
    imagepath: "./process-mockup/10-16-mockup.jpg", // the original image
    saveimagepath: `./To-Sell/10-16-mockup/WM-OTW-${image.number.toString()}.jpg`, // where to save the processed image
    watermarkpath: "./" + image.fileName,
  })

  // createYaml();
}
