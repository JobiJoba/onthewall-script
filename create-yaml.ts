export async function createYaml(allFilesPath: string[]) {
  for (const imagePath of allFilesPath) {
    let imgName = imagePath.split("/").pop()?.split(".")[0].toLowerCase()
    const file = Bun.file(`./yaml/${imgName}.yaml`)
    const writer = file.writer()

    writer.write(`name: ${imgName}\n`)
    writer.write(`title: ${imgName}\n`)
    writer.write(`description: ${imgName}\n`)
    writer.write(`image: ./${imagePath}\n`)
    writer.write("tags: \n")
    writer.write("  - vertical")

    writer.flush()
  }
}
