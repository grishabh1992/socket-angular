import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { JoinAppComponent } from './join-app/join-app.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  { path: '', component : JoinAppComponent},
  { path: 'dashboard', component : DashboardComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
