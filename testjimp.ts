import Jimp from "jimp"

let jimpFile = await Jimp.read(
  "/Users/joba/Projects/OnTheWall/code/archive/10-16/ultra-highly-detailed-movie-composition-1990-tv-show-carne-griffiths-ralph-horsley-alluring-mod-952349986.png"
)

let newFile = jimpFile.cover(1452, 2048) // .resize(1452, 2048, Jimp.RESIZE_NEAREST_NEIGHBOR,)
// let newFile = jimpFile.autocrop({ tolerance: 0, leaveBorder: 10 })

newFile.write("./testAutoCrop.png")
