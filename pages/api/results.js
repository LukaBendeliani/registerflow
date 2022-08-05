import { existsSync, readFile } from 'fs';

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const fsp = require('fs').promises;
const URL = process.env.URL ?? "http://localhost:3000"
const jsonPath = "./public/results.json"
const imagePath = "./public/car.png"

export default async function handler(req, res) {
  const body = JSON.parse(req.body);
  const base64Data = body.img.split(',')[1]
  const jsonExists = existsSync(jsonPath);
  const imagePathExists = existsSync(imagePath);

  if (jsonExists) {
    await fsp.unlink(jsonPath)
  }
  if (imagePathExists) {
    await fsp.unlink(imagePath)
  }

  await fsp.writeFile(imagePath, base64Data, 'base64');
  body.img = `${URL}/car.png`;
  await fsp.appendFile(jsonPath, JSON.stringify(body));
  const file = await fsp.readFile(jsonPath)
  res.send(file)
}
