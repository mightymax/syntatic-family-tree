# Syntatic family tree

This tool lets you create a syntatic graph of families. It fetches names from https://randommer.io 
and creates a familytree of parents and a random number of children (by default between 2 and 4)
for the number of generations you choose (default 10).

The RDF mapping is done according to the [Schema.org](https://schema.org) vocabulary.

The tool also creates some statements that allows SPARQL engines with OWL/RDFS reasoning to infer triples.

## Example output
```ttl
id:P01 a sdo:Person;
    sdo:familyName "Starnes";
    sdo:givenName "Jaxtyn";
    rdfs:label "Abby Starnes";
    sdo:gender sdo:Female;
    sdo:spouse id:SP01;
    def:generation 1.
id:SP01 a sdo:Person;
    sdo:familyName "Colangelo";
    sdo:givenName "Kylar";
    rdfs:label "Kamea Colangelo";
    sdo:gender sdo:Female.
id:P01 sdo:children 
  <https://data.lindeman.nu/generations/id/P01.1>.

<https://data.lindeman.nu/generations/id/P01.1> sdo:parent id:P01, id:SP01.
```

## Install

```bash
git clone git@github.com:mightymax/syntatic-family-tree.git
cd syntatic-family-tree
npm i
npx tsc
mv .env-example .env
```

Make sure to open `.env` and change the settings.

## Usage

```bash
node ./dist/main.js --help
```

```txt
Usage: main.js -f [num] -g [num|string] -c [num|string]

Otions:
      --help         Show help                                         [boolean]
      --version      Show versienummer                                 [boolean]
  -f, --families     Number of families                            [default: 10]
  -g, --generations  Number of generations per family               [default: 4]
  -c, --children     Children per generation                     [default: "2-4"]
```

The tool will print statements to your terminal, if you want to save them to a file us this:

```bash
node ./dist/main.js | tee data.ttl
```

## Upload data to TripyDB
If tou have an account on [TriplyDB](https://triplydb.com), you can upload the generated data if you 
have a [TriplyDB API Token](https://docs.triply.cc/generics/api-token/):

```bash
node dist/upload.js data.ttl
```
