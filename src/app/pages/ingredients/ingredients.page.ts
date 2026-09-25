import { Component } from '@angular/core';
import { IonContent, IonHeader, IonTitle, IonFab, IonFabButton, IonIcon, IonInput, IonToolbar, IonButtons, IonButton, IonModal, IonItem, IonRow, IonCol, IonGrid } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';
import { Ingredient } from '../../models/ingredient';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ingredients',
  templateUrl: './ingredients.page.html',
  imports: [FormsModule, IonItem, IonModal, IonTitle, IonButton, IonButtons, IonToolbar, IonInput, IonContent, IonHeader, IonFab, IonFabButton, IonIcon, IonRow, IonCol, IonGrid]
})
export class IngredientsPage {

  newIngredient = new Ingredient();

  constructor() {
    addIcons({ add });
  }
}