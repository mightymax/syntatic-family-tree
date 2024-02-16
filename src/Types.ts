export interface CliArguments {
  maxFamilies: number
  maxGenerations: number
  minChildren: number
  maxChildren: number
  /**
   * Age Gap: 
   * To establish a realistic generational gap, children are generated 
   * to be 20 to 30 years younger than their youngest parent. 
   * This rule too contributes to upholding a controlled generational progression.
   */ 
  ageCap: {lower: number, upper: number},

  /**
   * The minimum age a parent can have a child:
   */
  youngestPossibleParent: number
  /**
   * The maximum age of a parent:
   */
  oldestPossibleAge: number

  /**
   * Allow same sex-marriage:
   */
  allowSameSexMarriage: boolean

  /**
   * Number of random names we should fetch from randommer.io:
   */
  maxFamilyNames: number
  maxGivenNames: number
}
