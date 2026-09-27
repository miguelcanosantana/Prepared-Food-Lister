import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import {
  CapacitorSQLite,
  SQLiteConnection,
  SQLiteDBConnection
} from '@capacitor-community/sqlite';
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
  public ready: Promise<void>;
  private sqlite = new SQLiteConnection(CapacitorSQLite);

  constructor() {
    this.ready = this.initializeDB();
  }

  private async initializeDB(): Promise<void> {
    if (Capacitor.getPlatform() === 'web') {
      await this.sqlite.initWebStore();
    }

    const database = await this.sqlite.createConnection('prepared-food-lister', false, 'no-encryption', 1, false);
    await database.open();
    await database.execute(
      'CREATE TABLE IF NOT EXISTS ingredients (guid TEXT PRIMARY KEY NOT NULL, data TEXT NOT NULL);'
    );
    await database.execute(
      'CREATE TABLE IF NOT EXISTS dishes (guid TEXT PRIMARY KEY NOT NULL, data TEXT NOT NULL);'
    );

    this.database = database;
    await this.refreshDB();
  }

  private database!: SQLiteDBConnection;

  public async loadDB(): Promise<void> {
    await this.ready;
    await this.refreshDB();
  }

  private async refreshDB(): Promise<void> {
    const ingredients = await this.database.query('SELECT data FROM ingredients;');
    const dishes = await this.database.query('SELECT data FROM dishes;');

    this.loadedIngredients = (ingredients.values ?? []).map(row => JSON.parse(row.data) as Ingredient);
    this.loadedDishes = (dishes.values ?? []).map(row => JSON.parse(row.data) as Dish);
  }

  private async persistWebDB(): Promise<void> {
    if (Capacitor.getPlatform() === 'web') {
      await this.sqlite.saveToStore('prepared-food-lister');
    }
  }

  public async setIngredient(ingredient: Ingredient): Promise<void> {
    await this.ready;
    ingredient.guid = crypto.randomUUID();
    await this.database.run(
      'INSERT OR REPLACE INTO ingredients (guid, data) VALUES (?, ?);',
      [ingredient.guid, JSON.stringify(ingredient)]
    );
    await this.persistWebDB();
  }

  public async getIngredient(guid: string): Promise<Ingredient | null> {
    await this.ready;
    const result = await this.database.query('SELECT data FROM ingredients WHERE guid = ?;', [guid]);
    const storedValue = result.values?.[0]?.data;

    if (storedValue === undefined) {
      return null;
    }

    return JSON.parse(storedValue) as Ingredient;
  }

  public async setDish(dish: Dish): Promise<void> {
    await this.ready;
    dish.guid = crypto.randomUUID();
    await this.database.run(
      'INSERT OR REPLACE INTO dishes (guid, data) VALUES (?, ?);',
      [dish.guid, JSON.stringify(dish)]
    );
    await this.persistWebDB();
  }

  public async getDish(guid: string): Promise<Dish | null> {
    await this.ready;
    const result = await this.database.query('SELECT data FROM dishes WHERE guid = ?;', [guid]);
    const storedValue = result.values?.[0]?.data;

    if (storedValue === undefined) {
      return null;
    }

    return JSON.parse(storedValue) as Dish;
  }
}
