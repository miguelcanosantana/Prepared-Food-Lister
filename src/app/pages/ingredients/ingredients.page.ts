import { Component, inject, OnInit, signal } from '@angular/core';
import { IonContent, IonHeader, IonTitle, IonLabel, IonFab, IonFabButton, IonIcon, IonInput, IonToolbar, IonButtons, IonButton, IonModal, IonItem, IonRow, IonCol, IonGrid, IonList, IonItemOption, IonItemOptions, IonItemSliding, IonAlert } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';
import { Ingredient } from '../../models/ingredient';
import { FormsModule } from '@angular/forms';

import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-ingredients',
  templateUrl: './ingredients.page.html',
  imports: [IonAlert, FormsModule, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonModal, IonTitle, IonLabel, IonButton, IonButtons, IonToolbar, IonInput, IonContent, IonHeader, IonFab, IonFabButton, IonIcon, IonRow, IonCol, IonGrid, IonList]
})
export class IngredientsPage implements OnInit {

  private dataService = inject(DataService);

  public alertButtons = [
    {
      text: 'Cancel',
      role: 'cancel',
      handler: () => {

      },
    },
    {
      text: 'Delete',
      role: 'confirm',
      handler: () => {
        if (this.selectedIngredientGuid) {
          void this.deleteIngredient(this.selectedIngredientGuid);
        }
      },
    },
  ];

  loadedIngredients = signal<Ingredient[]>([]);
  loadError = signal<string>('');
  isDeleteAlertOpen = signal(false);
  selectedIngredientGuid: string | null = null;
  newIngredient = new Ingredient();
  editingIngredient = new Ingredient();

  constructor() {
    addIcons({ add });
  }

  async ngOnInit() {
    this.loadIngredients();
  }

  async loadIngredients() {

    var loadResult = await this.dataService.loadIngredients();

    if (typeof loadResult === "string") {
      this.loadError.set(loadResult);
      return;
    }

    this.loadedIngredients.set(loadResult);
    this.loadError.set('');
  }

  async saveNewIngredient(modal: IonModal) {

    await this.dataService.setIngredient(this.newIngredient);
    await this.loadIngredients();

    this.newIngredient = new Ingredient();
    modal.dismiss();
  }

  openEditModal(ingredient: Ingredient, modal: IonModal) {
    this.editingIngredient = Object.assign(new Ingredient(), ingredient);
    void modal.present();
  }

  async saveEditedIngredient(modal: IonModal) {
    const updateResult = await this.dataService.updateIngredient(this.editingIngredient);
    if (typeof updateResult === 'string') {
      this.loadError.set(updateResult);
      return;
    }

    await this.loadIngredients();
    modal.dismiss();
  }

  async deleteIngredient(guid: string) {
    
    await this.dataService.deleteIngredient(guid)
    await this.loadIngredients();
  }
  
  presentDeleteAlert(guid: string) {
    this.selectedIngredientGuid = guid;
    this.isDeleteAlertOpen.set(true);
  }

}