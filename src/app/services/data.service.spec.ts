import { TestBed } from '@angular/core/testing';

import { DataService } from './data.service';
import { Ingredient } from '../models/ingredient';

describe('DataService', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    const service: DataService = TestBed.inject(DataService);
    expect(service).toBeTruthy();
  });

  it('should not duplicate ingredients when loading storage multiple times', () => {
    localStorage.setItem('ingredients/1', JSON.stringify({ guid: '1', name: 'Tomato' } as Ingredient));
    localStorage.setItem('ingredients/2', JSON.stringify({ guid: '2', name: 'Salt' } as Ingredient));

    const service: DataService = TestBed.inject(DataService);
    service.loadedIngredients = [];

    service.loadDB();
    expect(service.loadedIngredients.length).toBe(2);

    service.loadDB();
    expect(service.loadedIngredients.length).toBe(2);
  });
});
