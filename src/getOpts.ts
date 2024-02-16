import yargs from 'yargs/yargs'
import { CliArguments } from './Types.js'

export default async () => {
  const argv = await yargs(process.argv.slice(2))
  .usage('Usage: $0 -f [num] -g [num|string] -c [num|string]')
  .alias('f', 'families')
  .default('f', 10)
  .alias('g', 'generations')
  .default('g', 4)
  .alias('c', 'children')
  .default('c', '2-4')
  .describe('f', 'Number of families')
  .describe('g', 'Number of generations per family')
  .describe('c', 'Children per generation')
  .parse()

  if(argv.f > 100) {
    console.error('Max. families = 100')
    process.exit(2)
  }
  const opts: CliArguments = {
    maxFamilies: argv.f,
    maxGenerations: 4,
    minChildren: 2,
    maxChildren: 4,
    ageCap: {lower: 20, upper: 30},
    youngestPossibleParent: 21,
    oldestPossibleAge: 100,
    allowSameSexMarriage: true,
    maxFamilyNames: 100,
    maxGivenNames: 100
  }

  if (typeof argv.children === 'string') {
    if (argv.children.match(/^(\d+)\-(\d+)$/)) {
      [opts.minChildren, opts.maxChildren] = argv.children.split('-').map(v => parseInt(v))
    } else {
      console.error('Wrong pattern, use `min-max` e.g. `2-3`')
      process.exit(3)
    }
  } else {
    opts.minChildren = opts.maxChildren = parseInt(argv.c)
  }
  opts.maxFamilies = argv.f
  opts.maxGenerations = argv.g
  if (opts.maxChildren > 10 || opts.minChildren < 0) {
    console.error('Families of must have between 0 and 10 children.')
    process.exit(4)
  }

  if (opts.maxGenerations > 20 || opts.maxGenerations < 1) {
    console.error('Families of must have between 1 and 20 generations.')
    process.exit(4)
  }

  return opts
}

export const optDescriptions: Record<keyof CliArguments, string> = {
  ageCap: 'The maximum age difference between the youngest parent and the children of that parent.',
  allowSameSexMarriage: 'Flag to indicate if same-sex marriages are allowed.',
  maxChildren: 'The maximum number of children created per generation.',
  minChildren: 'The mimimum number of children created per generation.',
  maxFamilies: 'The number of families created.',
  maxGenerations: 'The number of generations per family created.',
  maxFamilyNames: 'The quantity of random surnames used to seed the generator with names from https://randommer.io/.',
  maxGivenNames: 'The quantity of random firstname used to seed the generator with names from https://randommer.io/.',
  oldestPossibleAge: 'Maximum age of a person.',
  youngestPossibleParent: 'Youngest age at which a person can become a parent.'
}
