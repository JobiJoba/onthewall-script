import { createMockup1016, createMockupSquare } from "./create-mockup"
import { getFiles } from "./utils"

const filesInSellAfterProcessing =
  (await getFiles("./To-Sell/10-16-website/")) ?? []

const originalFileName = "To-Sell/10-16-website/W-OTW-1.jpg"
  .split("/")
  .pop()
  ?.split(".")[0]
const number = originalFileName?.split("-")[2]
console.log(originalFileName, number)
await createMockup1016({
  imagepath: "./process-mockup/10-16-mockup.jpg", // the original image
  saveimagepath: `./To-Sell/10-16-mockup/WM-OTW-${number.toString()}.jpg`, // where to save the processed image
  watermarkpath: "./To-Sell/10-16-website/" + originalFileName + ".jpg",
})
