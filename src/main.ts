import { Person } from './Person.js';
import { optDescriptions } from './getOpts.js';
import { randomNames } from './randomNames.js';
import { opts, prefixes, a, literal } from './utils.js';

Person.seed(
  await randomNames('firstname', opts.maxGivenNames),
  await randomNames('surname', opts.maxFamilyNames)
)

for (let f=0; f < opts.maxFamilies ; f++) {
  (new Person({...opts, id: `P${(f+1).toString().padStart(2, '0')}`})).quad(1)
}
Person.writer.addQuad(prefixes.id('dataset'), a, prefixes.sdo('Dataset'))
Person.writer.addQuad(prefixes.id('dataset'), prefixes.sdo('abstract'), literal('A syntatic dataset that creates a number of familytrees.', 'en'))
for (const key of Object.keys(opts)) {
  const value = opts[key as keyof typeof opts]
  Person.writer.addQuad(prefixes.def(key), a, prefixes.rdf('Property'))
  Person.writer.addQuad(prefixes.def(key), prefixes.rdfs('label'), literal(key))
  Person.writer.addQuad(prefixes.def(key), prefixes.rdfs('comment'), literal(optDescriptions[key as keyof typeof opts], 'en'))
  switch(typeof value) {
    case 'boolean':
      Person.writer.addQuad(prefixes.id('dataset'), prefixes.def(key), literal(value?'true':'false', prefixes.xsd('boolean')))
      break
    case 'number':
      Person.writer.addQuad(prefixes.id('dataset'), prefixes.def(key), literal(value.toString(), prefixes.xsd('integer')))
      break
    case 'string':
      Person.writer.addQuad(prefixes.id('dataset'), prefixes.def(key), literal(value))
      break
    default:
      Person.writer.addQuad(prefixes.id('dataset'), prefixes.def(key), literal(JSON.stringify(value)))
      break
  }
}
Person.writer.addQuad(prefixes.id('dataset'), prefixes.sdo('abstract'), literal('A syntatic dataset that creates a number of familytrees.', 'en'))
Person.writer.addQuad(prefixes.rdfs('label'), prefixes.owl('sameAs'), prefixes.rdfs('label'))
// Person.writer.addQuad(prefixes.sdo('spouse'), a, prefixes.owl('SymmetricProperty'))
Person.writer.addQuad(prefixes.sdo('children'), a, prefixes.owl('TransitiveProperty'))
Person.writer.addQuad(prefixes.sdo('children'), prefixes.rdfs('domain'), prefixes.sdo('Person'))
Person.writer.addQuad(prefixes.sdo('children'), prefixes.rdfs('range'), prefixes.sdo('Person'))
Person.writer.addQuad(prefixes.sdo('parent'), a, prefixes.owl('TransitiveProperty'))
Person.writer.addQuad(prefixes.sdo('parent'), prefixes.rdfs('domain'), prefixes.sdo('Person'))
Person.writer.addQuad(prefixes.sdo('parent'), prefixes.rdfs('range'), prefixes.sdo('Person'))
// Person.writer.addQuad(prefixes.sdo('children'), prefixes.owl('inverseOf'), (prefixes.sdo('parent')))
Person.writer.end()