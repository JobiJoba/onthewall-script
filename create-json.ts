import verticalDb from "./verticalDb.json"
import horizontalDb from "./horizontalDb.json"
import squareDb from "./SquareDb.json"
import { getFiles } from "./utils"

export async function create1016Json() {
  let allFilesMockup = await getFiles("./To-Sell/10-16-mockup")
  for (const file of allFilesMockup!) {
    const fileNameWithoutExtension = file
      .split("/")
      .pop()
      ?.split(".")
      .shift()
      ?.toLowerCase()
    const index = fileNameWithoutExtension?.split("-").pop()
    const i = parseInt(index, 10)

    const coreFileName = fileNameWithoutExtension
      ?.split("-")
      .filter((u) => u !== "wm")
      .join("-")

    let existingObj = verticalDb.find((u) => u.index === i)
    if (!existingObj) {
      verticalDb.push({
        src: coreFileName,
        title: coreFileName,
        slug: coreFileName,
        tags: ["vertical"],
        index: i,
      })
    } else {
      if (existingObj.tags.includes("toRemove")) {
        //find object and remove it from jsonObject list
        let index = verticalDb.findIndex((u) => u.index === i)
        verticalDb.splice(index, 1)
      }
    }

    verticalDb.sort((a, b) => a.index - b.index)
  }

  let newVerticalDb = verticalDb
    .filter((u) => !u.tags.includes("toRemove"))
    .filter((u) => u.title !== "")

  Bun.write("./verticalDb.json", JSON.stringify(newVerticalDb))
}

export async function create1610Json() {
  let allFilesMockup = await getFiles("./To-Sell/16-10-mockup")
  for (const file of allFilesMockup!) {
    const fileNameWithoutExtension = file
      .split("/")
      .pop()
      ?.split(".")
      .shift()
      ?.toLowerCase()
    const index = fileNameWithoutExtension?.split("-").pop()
    const i = parseInt(index, 10)

    const coreFileName = fileNameWithoutExtension
      ?.split("-")
      .filter((u) => u !== "wm")
      .join("-")

    let existingObj = horizontalDb.find((u) => u.index === i)
    if (!existingObj) {
      horizontalDb.push({
        src: "16-10-homepage/W-" + coreFileName,
        srcMockup: "16-10-mockup/W-" + coreFileName,
        title: "wm-" + coreFileName,
        slug: "shop/W-" + coreFileName,
        tags: ["horizontal"],
        index: i,
      })
    } else {
      if (existingObj.tags.includes("toRemove")) {
        //find object and remove it from jsonObject list
        let index = horizontalDb.findIndex((u) => u.index === i)
        horizontalDb.splice(index, 1)
      }
    }

    horizontalDb.sort((a, b) => a.index - b.index)
  }

  let newDb = horizontalDb
    .filter((u) => !u.tags.includes("toRemove"))
    .filter((u) => u.title !== "")
  Bun.write("./horizontalDb.json", JSON.stringify(newDb))
}

export async function createSquareJson() {
  let allFilesMockup = await getFiles("./To-Sell/square-mockup")
  for (const file of allFilesMockup!) {
    const fileNameWithoutExtension = file
      .split("/")
      .pop()
      ?.split(".")
      .shift()
      ?.toLowerCase()
    const index = fileNameWithoutExtension?.split("-").pop()
    const i = parseInt(index, 10)

    const coreFileName = fileNameWithoutExtension
      ?.split("-")
      .filter((u) => u !== "wm")
      .join("-")
      .replaceAll("s", "")

    let existingObj = squareDb.find((u) => u.index === i)
    if (!existingObj) {
      squareDb.push({
        src: coreFileName,
        title: coreFileName,
        slug: coreFileName,
        tags: ["square"],
        index: i,
      })
    } else {
      if (existingObj.tags.includes("toRemove")) {
        //find object and remove it from jsonObject list
        let index = squareDb.findIndex((u) => u.index === i)
        squareDb.splice(index, 1)
      }
    }

    squareDb.sort((a, b) => a.index - b.index)
  }
  let newDb = squareDb
    .filter((u) => !u.tags.includes("toRemove"))
    .filter((u) => u.title !== "")
  Bun.write("./squareDb.json", JSON.stringify(newDb))
}
