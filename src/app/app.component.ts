import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterOutlet } from '@angular/router';
import { CartService } from './services/cart.service';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatToolbarModule, MatBadgeModule, MatButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'e-commerce-app';

  constructor(private cartService: CartService, private router: Router) {}

  /**
   * Get the total items in the cart.
   * @returns The total items in the cart.
   */
  get totalItems() {
    return this.cartService.totalItems();
  }

  /**
   * Navigate to the cart.
   * @returns void
   */
  public navigateToCart() {
    this.router.navigate(['/cart']);
  }

  /**
   * Navigate to the products.
   * @returns void
   */
  public navigateToProducts() {
    this.router.navigate(['/products']);
  }
}
