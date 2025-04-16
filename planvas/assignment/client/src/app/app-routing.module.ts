import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';  // Path to LoginComponent
import { SignupComponent } from './signup/signup.component';  // Path to SignupComponent

// Using import() allows lazy-loading of the main-grid module.
// See https://angular.io/guide/lazy-loading-ngmodules.
const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },  // Default route is login
  { path: 'login', component: LoginComponent },  // Login route
  { path: 'signup', component: SignupComponent },  // Signup route
  {
    path: 'main-grid', 
    loadChildren: () => import('./main-grid/main-grid.module').then(m => m.MainGridModule),  // Lazy load MainGridModule
  },
  { path: '**', redirectTo: '/login' }  // Wildcard route to catch invalid URLs and redirect to login
];

//sets up and exports Angular's routing system
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
