import { create1016Json, create1610Json, createSquareJson } from "./create-json"
import { upscaleSquare } from "./square"
import { upscale1016 } from "./upscale_10-16"
import { upscale1610 } from "./upscale_16-10"

let lastCommand = Bun.argv.pop()

if (lastCommand === "all") {
  await upscale1016()
  await upscale1610()
  await upscaleSquare()

  await create1016Json()
  await create1610Json()
  await createSquareJson()
} else if (lastCommand === "10-16") {
  await upscale1016()
  await create1016Json()
}
if (lastCommand === "16-10") {
  await upscale1610()
  await create1610Json()
} else if (lastCommand === "square") {
  await upscaleSquare()
  await createSquareJson()
} else {
  await create1016Json()
  await create1610Json()
  await createSquareJson()
}
