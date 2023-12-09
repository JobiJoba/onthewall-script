import { create1016Json, create1610Json, createSquareJson } from "./create-json"
import { upscaleSquare } from "./square"
import { transformSquare } from "./transform_square_to_a3"
import { upscalehv } from "./upscale_hv"

let lastCommand = Bun.argv.pop()

if (lastCommand === "all") {
  await upscalehv("10-16")
  await upscalehv("16-10")
  await upscaleSquare()

  await create1016Json()
  await create1610Json()
  await createSquareJson()
} else if (lastCommand === "10-16") {
  await upscalehv("10-16")

  await create1016Json()
} else if (lastCommand === "16-10") {
  // await upscale1610()
  await upscalehv("16-10")

  await create1610Json()
} else if (lastCommand === "square") {
  await upscaleSquare()
  await createSquareJson()
} else if (lastCommand === "squareA3") {
  await transformSquare()
} else {
  await create1016Json()
  await create1610Json()
  await createSquareJson()
}
