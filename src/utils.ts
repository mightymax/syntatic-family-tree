import n3 from 'n3';
import dotenv from 'dotenv'
import getOpts from './getOpts.js';
export const opts = await getOpts();
export const namedNode = n3.DataFactory.namedNode;
export const literal = n3.DataFactory.literal;
dotenv.config()
const PREFIX = process.env.PREFIX ?? 'http://ex.com/generations'
export const prefixes = {
  rdfs: (suffix: string) => namedNode(`http://www.w3.org/2000/01/rdf-schema#${suffix}`),
  sdo: (suffix: string) => namedNode(`https://schema.org/${suffix}`),
  owl: (suffix: string) => namedNode(`http://www.w3.org/2002/07/owl#${suffix}`),
  rdf: (suffix: string) => namedNode(`http://www.w3.org/1999/02/22-rdf-syntax-ns#${suffix}`),
  xsd: (suffix: string) => namedNode(`http://www.w3.org/2001/XMLSchema#${suffix}`),
  id: (suffix: string) => namedNode(`${PREFIX}/id/${suffix}`),
  def: (suffix: string) => namedNode(`${PREFIX}/def/${suffix}`),
};
export const a = prefixes.rdf('type');
export const random = (min: number, max: number) => Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min);
export const prefixStrings = () => {
  const p: Record<string, string> = {}
  Object.keys(prefixes).map(ns => {
    p[ns] = prefixes[ns as keyof typeof prefixes]('').value
  })
  return p
}
