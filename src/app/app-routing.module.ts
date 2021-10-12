import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: 'customer',
    loadChildren: () =>
      import('./pages/customer/customer.module').then(
        (m) => m.CustomerPageModule
      ),
  },
  {
    path: 'billing',
    loadChildren: () => import('./pages/billing/billing.module').then( m => m.BillingPageModule)
  },
  {
    path: 'metrics',
    loadChildren: () => import('./pages/metrics/metrics.module').then( m => m.MetricsPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
