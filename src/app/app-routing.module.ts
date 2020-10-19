import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LiveChartsComponent } from './compnents/live-charts/live-charts.component';
import { HistoricalComponent } from './compnents/historical/historical.component';

const routes: Routes = [
  { path: '',   redirectTo: '/historical', pathMatch: 'full' },
  { path: 'historical', component: HistoricalComponent },
  { path: 'live-chart', component: LiveChartsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
