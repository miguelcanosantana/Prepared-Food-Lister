export class Ingredient {
  constructor(
    public guid?: string,
    public name?: string,
    public quantity?: number,
    public unit?: string,
    public kcal?: number
  ) {}
}
