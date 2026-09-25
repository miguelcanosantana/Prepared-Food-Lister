import { Component, inject } from '@angular/core';
import { IonHeader, IonContent, IonList, IonButton } from '@ionic/angular';

import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-dishes',
  templateUrl: 'dishes.page.html',
  imports: [IonButton, IonHeader, IonContent, IonList],
})
export class DishesPage {
  
  private data = inject(DataService);

}
