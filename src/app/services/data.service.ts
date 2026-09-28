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
  }

  private database!: SQLiteDBConnection;

  private async persistWebDB(): Promise<void> {
    if (Capacitor.getPlatform() === 'web') {
      await this.sqlite.saveToStore('prepared-food-lister');
    }
  }

  public async loadIngredients(): Promise<Ingredient[] | string> {

    try {
      
      await this.ready;

      const ingredients = await this.database.query('SELECT data FROM ingredients;');
      return (ingredients.values ?? []).map(row => JSON.parse(row.data) as Ingredient);

    } catch (error) {
      return String(error);
    }
  }

  public async loadDishes(): Promise<Dish[] | string> {

    try {
      
      await this.ready;

      const dishes = await this.database.query('SELECT data FROM dishes;');
      return (dishes.values ?? []).map(row => JSON.parse(row.data) as Dish);

    } catch (error) {
      return String(error);
    }
  }

  public async setIngredient(ingredient: Ingredient): Promise<void | string> {

    try {

      await this.ready;

      ingredient.guid = crypto.randomUUID();
      ingredient.dateSaved = Date.now();

      var insertSQL = 'INSERT OR REPLACE INTO ingredients (guid, data) VALUES (?, ?);';

      await this.database.run(insertSQL,[ingredient.guid, JSON.stringify(ingredient)]);
      await this.persistWebDB();

    } catch (error) {
      return String(error);
    }
  }

  public async getIngredient(guid: string): Promise<Ingredient | null | string> {

    try {
      
      await this.ready;

      const result = await this.database.query('SELECT data FROM ingredients WHERE guid = ?;', [guid]);
      const storedValue = result.values?.[0]?.data;

      if (storedValue === undefined) {
        return null;
      }

      return JSON.parse(storedValue) as Ingredient;

    } catch (error) {
      return String(error);
    }
  }

  public async setDish(dish: Dish): Promise<void | string> {

    try {

      await this.ready;

      dish.guid = crypto.randomUUID();
      dish.dateSaved = Date.now();

      var insertSQL = 'INSERT OR REPLACE INTO dishes (guid, data) VALUES (?, ?);';

      await this.database.run(insertSQL,[dish.guid, JSON.stringify(dish)]);
      await this.persistWebDB();

    } catch (error) {
      return String(error);
    }
  }

  public async getDish(guid: string): Promise<Dish | null | string> {

    try {
      
      await this.ready;

      const result = await this.database.query('SELECT data FROM dishes WHERE guid = ?;', [guid]);
      const storedValue = result.values?.[0]?.data;

      if (storedValue === undefined) {
        return null;
      }

      return JSON.parse(storedValue) as Dish;

    } catch (error) {
      return String(error);
    }
  }
}
