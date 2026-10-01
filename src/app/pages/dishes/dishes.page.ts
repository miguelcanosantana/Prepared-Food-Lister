import { Component, inject, OnInit, signal } from '@angular/core';
import { IonAlert, IonButton, IonButtons, IonCol, IonContent, IonFab, IonFabButton, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonList, IonModal, IonRow, IonSelect, IonSelectOption, IonTextarea, IonTitle, IonToolbar } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';
import { FormsModule } from '@angular/forms';
import { Dish } from '../../models/dish';
import { Ingredient } from '../../models/ingredient';

import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-dishes',
  templateUrl: 'dishes.page.html',
  imports: [FormsModule, IonAlert, IonButton, IonButtons, IonCol, IonContent, IonFab, IonFabButton, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonList, IonModal, IonRow, IonSelect, IonSelectOption, IonTextarea, IonTitle, IonToolbar],
})
export class DishesPage implements OnInit {

  private dataService = inject(DataService);

  public alertButtons = [
    {
      text: 'Cancel',
      role: 'cancel',
    },
    {
      text: 'Delete',
      role: 'confirm',
      handler: () => {
        if (this.selectedDishGuid) {
          void this.deleteDish(this.selectedDishGuid);
        }
      },
    },
  ];

  loadedDishes = signal<Dish[]>([]);
  availableIngredients = signal<Ingredient[]>([]);
  loadError = signal('');
  isDeleteAlertOpen = signal(false);
  selectedDishGuid: string | null = null;
  selectedIngredientGuids: string[] = [];
  selectedIngredientAmounts: Record<string, number> = {};
  newDish = new Dish();
  editingDish = new Dish();

  constructor() {
    addIcons({ add });
  }

  async ngOnInit() {
    await this.loadDishes();
    await this.loadAvailableIngredients();
  }

  async loadDishes() {
    const loadResult = await this.dataService.loadDishes();

    if (typeof loadResult === 'string') {
      this.loadError.set(loadResult);
      return;
    }

    this.loadedDishes.set(loadResult);
    this.loadError.set('');
  }

  async loadAvailableIngredients() {
    const loadResult = await this.dataService.loadIngredients();

    if (typeof loadResult === 'string') {
      this.loadError.set(loadResult);
      return;
    }

    this.availableIngredients.set(loadResult);
  }

  selectedIngredients() {
    return this.availableIngredients().filter(ingredient =>
      this.selectedIngredientGuids.includes(ingredient.guid ?? '')
    );
  }

  onSelectedIngredientsChange(guids: string[]) {
    this.selectedIngredientGuids = guids;
    for (const guid of guids) {
      this.selectedIngredientAmounts[guid] ??= 1;
    }
  }

  private getSelectedIngredientsWithAmounts(): [string, number][] {
    return this.selectedIngredientGuids.map((guid): [string, number] => [
      guid,
      this.selectedIngredientAmounts[guid] ?? 1,
    ]);
  }

  async saveNewDish(modal: IonModal) {
    this.newDish.ingredientsGuidAndAmount = this.getSelectedIngredientsWithAmounts();
    const saveResult = await this.dataService.setDish(this.newDish);
    if (typeof saveResult === 'string') {
      this.loadError.set(saveResult);
      return;
    }

    await this.loadDishes();
    this.newDish = new Dish();
    this.selectedIngredientGuids = [];
    this.selectedIngredientAmounts = {};
    await modal.dismiss();
  }

  openEditModal(dish: Dish, modal: IonModal) {
    this.editingDish = Object.assign(new Dish(), dish);
    const ingredients = dish.ingredientsGuidAndAmount ?? [];
    this.selectedIngredientGuids = ingredients.map(([guid]) => guid);
    this.selectedIngredientAmounts = Object.fromEntries(
      ingredients.map(([guid, amount]) => [guid, amount])
    );
    void modal.present();
  }

  async saveEditedDish(modal: IonModal) {
    this.editingDish.ingredientsGuidAndAmount = this.getSelectedIngredientsWithAmounts();
    const updateResult = await this.dataService.updateDish(this.editingDish);
    if (typeof updateResult === 'string') {
      this.loadError.set(updateResult);
      return;
    }

    await this.loadDishes();
    await modal.dismiss();
  }

  async deleteDish(guid: string) {
    const deleteResult = await this.dataService.deleteDish(guid);
    if (typeof deleteResult === 'string') {
      this.loadError.set(deleteResult);
      return;
    }

    await this.loadDishes();
  }

  presentDeleteAlert(guid: string) {
    this.selectedDishGuid = guid;
    this.isDeleteAlertOpen.set(true);
  }

}
