import dotenv from 'dotenv'
dotenv.config()
import fs from 'node:fs/promises';

export const randomNames = async (nameType: 'surname' | 'firstname', quantity: number) => {
  if (process.env.RANDOMMER_API_KEY === undefined) {
    console.error("Make sure to get an API Key from https://randommer.io/ and have it available as ENV var `RANDOMMER_API_KEY`.");
    process.exit(1);
  }
  const cacheFile = `./.cache/${nameType}.${quantity}.json`;
  return await fs.stat(cacheFile)
    .then(_ => fs.readFile(cacheFile, 'utf-8'))
    .then(jsonString => JSON.parse(jsonString))
    .catch(async (_) => fetch(`https://randommer.io/api/Name?nameType=${nameType}&quantity=${quantity}`, {
      headers: {
        'X-Api-Key': process.env.RANDOMMER_API_KEY ?? ''
      }
    })
      .then(async (res) => res.json())
      .then(names => fs.writeFile(cacheFile, JSON.stringify(names, null, 2), 'utf-8').then(_ => names))
    );
};
