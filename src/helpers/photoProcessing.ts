import Jimp from 'jimp'

export const photoProcessing = async (path: string, width: number) => {
  const image = await Jimp.read(path)
  await image.resize(width, Jimp.AUTO).writeAsync(path)
}
