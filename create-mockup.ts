const Jimp = require("jimp")

export function createMockup1016Homepage(options: any) {
  Jimp.read(options.imagepath)
    .then(async (image: any) => {
      console.log("image opened")

      await addWatermark1016Homepage(image, options.watermarkpath)
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

function addWatermark1016Homepage(image: any, watermarkpath: any) {
  return Jimp.read(watermarkpath)
    .then((watermark: any) => {
      watermark.resize(565, 810)
      //   560x820
      image.composite(watermark, 111, 93)
    })
    .catch((err: any) => {
      console.error(err)
    })
}

export function createMockupAll(options: any) {
  Jimp.read(options.imagepath)
    .then(async (image: any) => {
      console.log("image opened")
      await addWatermarkAll(
        image,
        options.watermarkpath,
        options.resizeWidth,
        options.resizeHeight,
        options.compositeWidth,
        options.compositeHeight
      )
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

function addWatermarkAll(
  image: any,
  watermarkpath: any,
  resizeWidth: number,
  resizeHeight: number,
  compositeWidth: number,
  compositeHeight: number
) {
  return Jimp.read(watermarkpath)
    .then((watermark: any) => {
      watermark.resize(resizeWidth, resizeHeight)
      image.composite(watermark, compositeWidth, compositeHeight)
    })
    .catch((err: any) => {
      console.error(err)
    })
}

export function createMockup1016(options: any) {
  Jimp.read(options.imagepath)
    .then(async (image: any) => {
      console.log("image opened")

      await addWatermark1016(image, options.watermarkpath)
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

function addWatermark1016(image: any, watermarkpath: any) {
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
      watermark.resize(600, 426)
      //   560x820
      image.composite(watermark, 660, 145)
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

export function createMockupSquareHomepage(options: any) {
  Jimp.read(options.imagepath)
    .then(async (image: any) => {
      console.log("image opened")

      await addWatermarkSquareHomepage(image, options.watermarkpath)
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

function addWatermarkSquareHomepage(image: any, watermarkpath: any) {
  return Jimp.read(watermarkpath)
    .then((watermark: any) => {
      watermark.resize(640, 640)
      //   560x820
      image.composite(watermark, 53, 30)
    })
    .catch((err: any) => {
      console.error(err)
    })
}

export function createMockup1610Homepage(options: any) {
  Jimp.read(options.imagepath)
    .then(async (image: any) => {
      console.log("image opened")

      await addWatermark1610Homepage(image, options.watermarkpath)
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

function addWatermark1610Homepage(image: any, watermarkpath: any) {
  return Jimp.read(watermarkpath)
    .then((watermark: any) => {
      watermark.resize(600, 428)
      //   560x820
      image.composite(watermark, 67, 45)
    })
    .catch((err: any) => {
      console.error(err)
    })
}
