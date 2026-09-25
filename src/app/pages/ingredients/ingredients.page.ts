import { Component } from '@angular/core';
import { IonContent, IonHeader, IonTitle, IonFab, IonFabButton, IonIcon, IonInput, IonToolbar, IonButtons, IonButton, IonModal, IonItem } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';

@Component({
  selector: 'app-ingredients',
  templateUrl: './ingredients.page.html',
  styleUrls: ['./ingredients.page.scss'],
  imports: [IonItem, IonModal, IonTitle, IonButton, IonButtons, IonToolbar, IonInput, IonContent, IonHeader, IonFab, IonFabButton, IonIcon],
})
export class IngredientsPage {
  testButtonClicked = false;

    constructor() {
      addIcons({ add });
    }
}