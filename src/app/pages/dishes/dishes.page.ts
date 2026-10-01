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

  async saveNewDish(modal: IonModal) {
    this.newDish.ingredients = this.availableIngredients().filter(ingredient => this.selectedIngredientGuids.includes(ingredient.guid ?? ''));
    const saveResult = await this.dataService.setDish(this.newDish);
    if (typeof saveResult === 'string') {
      this.loadError.set(saveResult);
      return;
    }

    await this.loadDishes();
    this.newDish = new Dish();
    this.selectedIngredientGuids = [];
    await modal.dismiss();
  }

  openEditModal(dish: Dish, modal: IonModal) {
    this.editingDish = Object.assign(new Dish(), dish);
    this.selectedIngredientGuids = (dish.ingredients ?? []).map(ingredient => ingredient.guid).filter((guid): guid is string => Boolean(guid));
    void modal.present();
  }

  async saveEditedDish(modal: IonModal) {
    this.editingDish.ingredients = this.availableIngredients().filter(ingredient => this.selectedIngredientGuids.includes(ingredient.guid ?? ''));
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
