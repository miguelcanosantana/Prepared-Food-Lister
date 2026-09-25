import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'tabs',
    loadComponent: () => import('./components/tabs/tabs.component').then((m) => m.TabsComponent),
    children: [
      {
        path: 'home',
        loadComponent: () => import('./pages/dishes/dishes.page').then((m) => m.DishesPage),
      },
      {
        path: 'ingredients',
        loadComponent: () => import('./pages/ingredients/ingredients.page').then((m) => m.IngredientsPage),
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: 'tabs/home',
    pathMatch: 'full',
  },
];

