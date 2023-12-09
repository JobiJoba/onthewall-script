import { getFiles, getFilesDir, transformSquareIntoA3 } from "./utils"

export async function transformSquare(inputFolder: string = "square") {
  const allFilesToProcess = (await getFilesDir(`./archive/${inputFolder}/`)) ?? []



  try {
    let savePathProcessOne = `./To-Sell/squareA3/`

    await transformSquareIntoA3(allFilesToProcess, savePathProcessOne, 1452, 2048)
  } catch (e) {
    console.log(e)
  }
}
