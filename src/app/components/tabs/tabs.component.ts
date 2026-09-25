import { Component } from '@angular/core';
import {
  IonIcon,
  IonLabel,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { nutritionOutline, restaurantOutline } from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  imports: [IonIcon, IonLabel, IonTabBar, IonTabButton, IonTabs],
})
export class TabsComponent {
  constructor() {
    addIcons({ nutritionOutline, restaurantOutline });
  }
}
