import { Ingredient } from './ingredient';

export class Dish {
  constructor(
    public guid?: string,
    public name?: string,
    public ingredients?: Ingredient[],
    public description?: string,
    public servings?: number,
  ) {}
}
