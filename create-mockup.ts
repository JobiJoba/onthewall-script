// processImage({
//   imagepath: "./process-mockup/mockup.jpg", // the original image
//   saveimagepath: "./process-mockup/output/mockup.jpg", // where to save the processed image
//   watermarkpath: "./process-mockup/W-OTW-1.jpg",
// }) // watermark image

// console.log("starting...")
const Jimp = require("jimp")

export function createMockup1610(options: any) {
  Jimp.read(options.imagepath)
    .then(async (image: any) => {
      console.log("image opened")

      await addWatermark1610(image, options.watermarkpath)
      image.quality(80)
      image
        .writeAsync(options.saveimagepath)
        .then(() => console.log("image saved"))
        .catch((err: any) => {
          console.error(err)
        })
    })
    .catch((err: any) => {
      console.error(err)
    })
}

export function createMockupSquare(options: any) {
  Jimp.read(options.imagepath)
    .then(async (image: any) => {
      console.log("image opened")

      await addWatermarkSquare(image, options.watermarkpath)
      image.quality(80)
      image
        .writeAsync(options.saveimagepath)
        .then(() => console.log("image saved"))
        .catch((err: any) => {
          console.error(err)
        })
    })
    .catch((err: any) => {
      console.error(err)
    })
}

function addWatermark1610(image: any, watermarkpath: any) {
  return Jimp.read(watermarkpath)
    .then((watermark: any) => {
      watermark.resize(565, 810)
      //   560x820
      image.composite(watermark, 470, 93)
    })
    .catch((err: any) => {
      console.error(err)
    })
}

function addWatermarkSquare(image: any, watermarkpath: any) {
  return Jimp.read(watermarkpath)
    .then((watermark: any) => {
      watermark.resize(640, 640)
      //   560x820
      image.composite(watermark, 240, 60)
    })
    .catch((err: any) => {
      console.error(err)
    })
}
