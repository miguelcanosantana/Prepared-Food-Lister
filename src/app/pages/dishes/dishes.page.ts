import { Component, inject } from '@angular/core';
import { RefresherCustomEvent, IonHeader, IonToolbar, IonTitle, IonContent, IonRefresher, IonRefresherContent, IonList } from '@ionic/angular';

import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-dishes',
  templateUrl: 'dishes.page.html',
  styleUrls: ['dishes.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonRefresher, IonRefresherContent, IonList],
})
export class DishesPage {
  
  private data = inject(DataService);

  refresh(ev: any) {
    setTimeout(() => {
      (ev as RefresherCustomEvent).detail.complete();
    }, 3000);
  }
}
