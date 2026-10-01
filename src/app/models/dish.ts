export class Dish {
  constructor(
    public guid?: string,
    public name?: string,
    public dateSaved?: number,
    public ingredientsGuidAndAmount?: [string, number][],
    public description?: string,
    public servings?: number,
  ) {}
}
