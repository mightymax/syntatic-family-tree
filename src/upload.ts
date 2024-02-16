import fs from 'node:fs'
import App from '@triply/triplydb'
import dotenv from 'dotenv'
dotenv.config()
const DEFAULT_GRAPH = process.env.DEFAULT_GRAPH
if (DEFAULT_GRAPH === undefined) {
  console.error('No DEFAULT_GRAPH found, make sure to set it as an environment variable, e.g. in `.env`.')
  process.exit(1)
}
const datasets = process.argv.slice(2, 1).shift() ?? 'data.ttl'
if (!fs.existsSync(datasets)) {
  console.error(`No dataset file '${datasets}' found.`)
  process.exit(1)
}
const app = App.get(process.env.TRIPLYDB_TOKEN)
app.getAccount()
  .then(a => a.getDataset(process.env.DATASET ?? 'families'))
  .then(async ds => {
    try {
     await  ds.deleteGraph(DEFAULT_GRAPH)
    } catch(e) {}
    return ds
  })
  .then(ds => ds.importFromFiles([datasets]))
  .then(ds => ds.getService('Jena'))
  .then(async service => {
    if (!await service.isUpToDate()) {
      await service.update()
    }
  })
