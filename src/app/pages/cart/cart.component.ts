import { Component } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { CurrencyPipe, TitleCasePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    MatCardModule,
    MatTableModule,
    CurrencyPipe,
    MatIconModule,
    MatButtonModule,
    TitleCasePipe,
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent {
  constructor(private cartService: CartService) {}

  /**
   * The cart items.
   */
  get cartItems() {
    return this.cartService.getCartItems();
  }

  /**
   * The total price of the cart.
   */
  get totalPrice() {
    return this.cartService.totalPrice();
  }

  /**
   * Update the quantity of the cart item.
   * @param productId - The id of the product.
   * @param quantity - The quantity to update.
   * @returns void
   */
  updateQuantity(productId: string, quantity: number) {
    this.cartService.updateQuantity(productId, quantity);
  }

  /**
   * Increase the quantity of the cart item.
   * @param productId - The id of the product.
   * @returns void
   */
  increaseQuantity(productId: string) {
    this.cartService.increaseQuantity(productId);
  }

  /**
   * Decrease the quantity of the cart item.
   * @param productId - The id of the product.
   * @returns void
   */
  decreaseQuantity(productId: string) {
    this.cartService.decreaseQuantity(productId);
  }
}
