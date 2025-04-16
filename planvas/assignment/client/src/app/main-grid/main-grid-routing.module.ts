import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainGridComponent } from './main-grid.component';

// MainGridComponent is part of the main-grid module, so it does not
// need to be lazy-loaded.
const routes: Routes = [
  { path: '', component: MainGridComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainGridRoutingModule { }
