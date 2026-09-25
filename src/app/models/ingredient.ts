export class Ingredient {
  constructor(
    public guid?: string,
    public name?: string,
    public quantity?: number,
    public unit?: string,
    public calories?: number,
    public protein?: number,
    public carbs?: number,
    public fats?: number,
    public fiber?: number,
    public sugar?: number,
  ) {}
}
