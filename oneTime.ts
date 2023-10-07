import { createMockupSquare } from "./create-mockup"
import { getFiles } from "./get-dir"

const filesInSellAfterProcessing =
  (await getFiles("./To-Sell/square-website/")) ?? []

for (const image of filesInSellAfterProcessing) {
  const originalFileName = image.split("/").pop()?.split(".")[0]
  const number = originalFileName?.split("-")[2]
  console.log(originalFileName, number)
  await createMockupSquare({
    imagepath: "./process-mockup/square-mockup.jpg", // the original image
    saveimagepath: `./To-Sell/square-mockup/WM-OTWS-${number.toString()}.jpg`, // where to save the processed image
    watermarkpath: "./To-Sell/square-website/" + originalFileName + ".jpg",
  })
}
