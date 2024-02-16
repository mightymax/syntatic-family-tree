import n3 from 'n3';
import { random, prefixes, a, literal, prefixStrings } from './utils.js';
import { CliArguments } from './Types.js'
export class Person {
  static $givenNames: string[]
  static $familyNames: string[]
  private $familyName?: string
  private static $writer: n3.Writer
  private $spouse?: Person
  private $children?: Person[]
  private id: n3.NamedNode
  private gender: n3.NamedNode
  constructor(private opts: { familyName?: string, id: string } & CliArguments) {
    this.id = prefixes.id(opts.id);
    this.$familyName = opts?.familyName
    this.gender = prefixes.sdo(['Male', 'Female'][random(0, 1)]);
  }

  public get givenName() {
    return Person.$givenNames[random(0, Person.$givenNames.length - 1)];
  }
  public get familyName() {
    if (this.$familyName === undefined) {
      this.$familyName = Person.$familyNames[random(0, Person.$familyNames.length - 1)];
    }
    return this.$familyName 
  }

  public get spouse() {
    if (!this.$spouse) {
      this.$spouse = new Person({ ...this.opts, familyName: undefined, id: `S${this.opts.id}`});
      if (!this.opts.allowSameSexMarriage) {
        this.$spouse.gender = this.gender.equals(prefixes.sdo('Male')) ? prefixes.sdo('Female') : prefixes.sdo('Male');
      }
    }
    return this.$spouse;
  }

  public get children() {
    if (!this.$children) {
      this.$children = [];
      for (let c = 0; c < random(this.opts.minChildren, this.opts.maxChildren); c++) {
        this.$children.push(new Person({ ...this.opts, familyName: this.familyName, id: `${this.opts.id}.${c+1}`}));
      }
    }
    return this.$children;
  }

  public static get writer() {
    if (Person.$writer === undefined) {
      Person.$writer = new n3.Writer(
        process.stdout, {
        end: false,
        prefixes: prefixStrings()
      });
    }
    return Person.$writer
  }

  quad(generation: number, isSpouse: boolean = false) {
    Person.writer.addQuad(this.id, a, prefixes.sdo('Person'));
    Person.writer.addQuad(this.id, prefixes.sdo('familyName'), literal(this.familyName));
    Person.writer.addQuad(this.id, prefixes.sdo('givenName'), literal(this.givenName));
    Person.writer.addQuad(this.id, prefixes.rdfs('label'), literal(this.givenName + ' ' + this.familyName));
    Person.writer.addQuad(this.id, prefixes.sdo('gender'), this.gender);
    if (!isSpouse) {
      Person.writer.addQuad(this.id, prefixes.sdo('spouse'), this.spouse.id);
      Person.writer.addQuad(this.id, prefixes.def('generation'), literal(generation, prefixes.xsd('integer')));
      this.spouse.quad(generation, true);
      if (generation < this.opts.maxGenerations) {
        for (const child of (this.children)) {
          Person.writer.addQuad(this.id, prefixes.sdo('children'), child.id);

          // these are actually not needed because wa can use OWL reasoning:
          Person.writer.addQuad(child.id, prefixes.sdo('parent'), this.id);
          Person.writer.addQuad(child.id, prefixes.sdo('parent'), this.spouse.id);
          Person.writer.addQuad(this.spouse.id, prefixes.sdo('children'), child.id);

          child.quad(generation + 1);
        }
      }
    }
  }

  public static seed(givenNames: string[], familyNames: string[]) {
    Person.$familyNames = familyNames
    Person.$givenNames = givenNames
  }

}
