import { Routes } from '@angular/router';
import { CartComponent } from './pages/cart/cart.component';
import { ProductsComponent } from './pages/products/products.component';

export const routes: Routes = [
  { path: 'products', component: ProductsComponent },
  { path: 'cart', component: CartComponent },
  { path: '**', redirectTo: 'products' },
];
