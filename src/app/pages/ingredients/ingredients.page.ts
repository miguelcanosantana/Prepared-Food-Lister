import { Component, inject, OnInit, signal } from '@angular/core';
import { IonContent, IonHeader, IonTitle, IonFab, IonFabButton, IonIcon, IonInput, IonToolbar, IonButtons, IonButton, IonModal, IonItem, IonRow, IonCol, IonGrid, IonList } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';
import { Ingredient } from '../../models/ingredient';
import { FormsModule } from '@angular/forms';

import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-ingredients',
  templateUrl: './ingredients.page.html',
  imports: [FormsModule, IonItem, IonModal, IonTitle, IonButton, IonButtons, IonToolbar, IonInput, IonContent, IonHeader, IonFab, IonFabButton, IonIcon, IonRow, IonCol, IonGrid, IonList]
})
export class IngredientsPage implements OnInit {

  private dataService = inject(DataService);

  loadedIngredients = signal<Ingredient[]>([]);
  newIngredient = new Ingredient();

  constructor() {
    addIcons({ add });
  }

  async ngOnInit() {
    await this.dataService.loadDB();
    this.loadedIngredients.set(this.dataService.loadedIngredients);
  }

  async saveNewIngredient(modal: IonModal) {
    await this.dataService.setIngredient(this.newIngredient);
    await this.dataService.loadDB();
    
    this.loadedIngredients.set(this.dataService.loadedIngredients);
    this.newIngredient = new Ingredient();
    modal.dismiss();
  }

}