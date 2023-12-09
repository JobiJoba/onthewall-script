import { create1610Json } from "./create-json"
import {
  createMockup1016Homepage,
  createMockup1610Homepage,
  createMockupSquare,
  createMockupSquareHomepage,
} from "./create-mockup"
import { getFiles } from "./utils"

const filesInSellAfterProcessing =
  (await getFiles("./To-Sell/10-16-website/")) ?? []

for (const image of filesInSellAfterProcessing) {
  if (image.includes("DS_Store")) continue

  const originalFileName = image.split("/").pop()?.split(".")[0]
  const number = originalFileName?.split("-")[2]
  console.log(image, originalFileName, number)

  await createMockup1016Homepage({
    imagepath: "./process-mockup/10-16-mockup-homepage.jpg", // the original image
    saveimagepath: `./To-Sell/10-16-homepage/WM-OTW-${number.toString()}.jpg`, // where to save the processed image
    watermarkpath: "./To-Sell/10-16-website/" + originalFileName + ".jpg",
  })
}
