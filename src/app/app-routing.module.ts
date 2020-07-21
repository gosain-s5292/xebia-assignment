import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ProductsComponent } from './products/products.component';


const routes: Routes = [
	
	{ path:'', component : LoginComponent },
	{ path:'login', component : LoginComponent },
	  
  	{ path:'products', component : ProductsComponent},
  	{ path:'products/:id', component : ProductsComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {enableTracing: false})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
