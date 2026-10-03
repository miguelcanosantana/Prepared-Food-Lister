import { Component } from '@angular/core';
import {
  IonIcon,
  IonLabel,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/angular';
import { TranslatePipe } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { nutritionOutline, restaurantOutline } from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  imports: [IonIcon, IonLabel, IonTabBar, IonTabButton, IonTabs, TranslatePipe],
})
export class TabsComponent {
  constructor() {
    addIcons({ nutritionOutline, restaurantOutline });
  }
}
