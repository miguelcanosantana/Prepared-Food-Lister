import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Capacitor } from '@capacitor/core';
import { SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';

import { DataService } from './data.service';
import { Ingredient } from '../models/ingredient';

describe('DataService', () => {
  let records: { table: string; guid: string; data: string }[];

  beforeEach(() => {
    localStorage.clear();
    records = [];

    const database = {
      open: vi.fn().mockResolvedValue(undefined),
      execute: vi.fn().mockResolvedValue({}),
      run: vi.fn(async (statement: string, values?: unknown[]) => {
        const table = statement.includes('INTO ingredients') ? 'ingredients' : 'dishes';
        const guid = values?.[0] as string;
        const data = values?.[1] as string;
        const existingRecord = records.find(record => record.table === table && record.guid === guid);

        if (existingRecord && statement.includes('OR IGNORE')) {
          return {};
        }

        if (existingRecord) {
          existingRecord.data = data;
        } else {
          records.push({ table, guid, data });
        }

        return {};
      }),
      query: vi.fn(async (statement: string, values?: unknown[]) => {
        const table = statement.includes('FROM ingredients') ? 'ingredients' : 'dishes';
        const guid = values?.[0] as string | undefined;
        const matchingRecords = records.filter(record => record.table === table && (!guid || record.guid === guid));

        return { values: matchingRecords.map(record => ({ data: record.data })) };
      })
    };

    vi.spyOn(Capacitor, 'getPlatform').mockReturnValue('web');
    vi.spyOn(SQLiteConnection.prototype, 'initWebStore').mockResolvedValue();
    vi.spyOn(SQLiteConnection.prototype, 'saveToStore').mockResolvedValue();
    vi.spyOn(SQLiteConnection.prototype, 'createConnection').mockResolvedValue(database as unknown as SQLiteDBConnection);
    TestBed.configureTestingModule({});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should be created', () => {
    const service: DataService = TestBed.inject(DataService);
    expect(service).toBeTruthy();
  });

  it('should not duplicate ingredients when loading the database multiple times', async () => {
    records.push(
      { table: 'ingredients', guid: '1', data: JSON.stringify({ guid: '1', name: 'Tomato' }) },
      { table: 'ingredients', guid: '2', data: JSON.stringify({ guid: '2', name: 'Salt' }) }
    );

    const service: DataService = TestBed.inject(DataService);
    await service.ready;

    expect(service.loadedIngredients.length).toBe(2);

    await service.loadDB();
    expect(service.loadedIngredients.length).toBe(2);

    await service.loadDB();
    expect(service.loadedIngredients.length).toBe(2);
  });

  it('should leave existing local storage keys untouched', async () => {
    const storedIngredient = JSON.stringify({ guid: '1', name: 'Tomato' });
    localStorage.setItem('ingredients/1', storedIngredient);
    const service: DataService = TestBed.inject(DataService);
    await service.ready;

    expect(service.loadedIngredients.length).toBe(0);
    expect(localStorage.getItem('ingredients/1')).toBe(storedIngredient);
  });

  it('should save and retrieve ingredients from SQLite', async () => {
    const service: DataService = TestBed.inject(DataService);
    const ingredient = new Ingredient(undefined, 'Tomato');
    await service.setIngredient(ingredient);

    const savedIngredient = await service.getIngredient(ingredient.guid!);

    expect(savedIngredient?.name).toBe('Tomato');
    expect(SQLiteConnection.prototype.saveToStore).toHaveBeenCalledWith('prepared-food-lister');
  });
});
