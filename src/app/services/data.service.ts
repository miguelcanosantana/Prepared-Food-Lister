import { Injectable } from '@angular/core';
import { Ingredient } from '../models/ingredient';
import { Dish } from '../models/dish';

// export interface Message {
//   fromName: string;
//   subject: string;
//   date: string;
//   id: number;
//   read: boolean;
// }

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public loadedIngredients: Ingredient[] = [];
  public loadedDishes: Dish[] = [];

  constructor() {
    this.loadDB();
  }

  public loadDB() {
    this.loadedIngredients = [];
    this.loadedDishes = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);

      if (key?.startsWith('ingredients/')) {
        const ingredient = localStorage.getItem(key);

        if (ingredient !== null) {
          this.loadedIngredients.push(JSON.parse(ingredient) as Ingredient);
        }
      }

      if (key?.startsWith('dishes/')) {
        const dish = localStorage.getItem(key);

        if (dish !== null) {
          this.loadedDishes.push(JSON.parse(dish) as Dish);
        }
      }
    }
  }

  public setIngredient(ingredient: Ingredient) {

    ingredient.guid = crypto.randomUUID();
    localStorage.setItem(`ingredients/${ingredient.guid}`, JSON.stringify(ingredient));
  }

  public getIngredient(guid: string): Ingredient | null {

    var ingredient = localStorage.getItem(`ingredients/${guid}`)
    var parsedIngredient = ingredient !== null ? JSON.parse(ingredient) : null
    
    return parsedIngredient;
  }

  public setDish(dish: Dish) {

    dish.guid = crypto.randomUUID();
    localStorage.setItem(`dishes/${dish.guid}`, JSON.stringify(dish));
  }

  public getDish(guid: string): Dish | null {

    var dish = localStorage.getItem(`dishes/${guid}`)
    var parsedDish = dish !== null ? JSON.parse(dish) : null

    return parsedDish;
  }

  // public getMessageById(id: number): Message {
  //   return this.messages[id];
  // }
}
