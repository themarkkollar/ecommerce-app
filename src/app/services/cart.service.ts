import { computed, Injectable } from '@angular/core';
import { IProduct } from '../models/IProduct';
import { signal } from '@angular/core';
import { ICart, ICartItem } from '../models/ICart';
import { ProductService } from './product.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  constructor(private productService: ProductService) {}

  /**
   * The cart items.
   */
  public cartItems = signal<ICart[]>([]);

  /**
   * The total items in the cart.
   */
  totalItems = computed(() => this.cartItems().length);

  /**
   * The total price of the cart.
   */
  totalPrice = computed(() =>
    this.cartItems().reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    )
  );

  /**
   * Add to cart.
   * @param product - The product to add.
   * @param quantity - The quantity to add.
   * @returns void
   */
  addToCart(product: IProduct, quantity: number) {
    const currentCart = this.cartItems();
    const existingItem = currentCart.find(
      (item) => item.product.uuid === product.uuid
    );

    if (existingItem) {
      this.cartItems.update((items) =>
        items.map((item) =>
          item.product.uuid === product.uuid
            ? {
                ...item,
                quantity: item.quantity + quantity,
                price: item.product.price * (item.quantity + quantity),
              }
            : item
        )
      );
    } else {
      this.cartItems.update((items) => [
        ...items,
        { product, quantity, price: product.price * quantity },
      ]);
    }
  }

  /**
   * Remove from cart.
   * @param productId - The id of the product.
   * @returns void
   */
  removeFromCart(productId: string) {
    this.cartItems.update((items) =>
      items.filter((item) => item.product.uuid !== productId)
    );
  }

  /**
   * Update the quantity of the cart item.
   * @param productId - The id of the product.
   * @param quantity - The quantity to update.
   * @returns void
   */
  updateQuantity(productId: string, quantity: number) {
    const item = this.cartItems().find(
      (item) => item.product.uuid === productId
    );
    if (
      item &&
      quantity <= item.product.availableAmount &&
      quantity >= item.product.minOrderAmount
    ) {
      this.cartItems.update((items) =>
        items.map((item) =>
          item.product.uuid === productId
            ? { ...item, quantity, price: item.product.price * quantity }
            : item
        )
      );
    }
  }

  /**
   * Increase the quantity of the cart item.
   * @param productId - The id of the product.
   * @returns void
   */
  increaseQuantity(productId: string) {
    const product = this.productService
      .products()
      .find((p) => p.uuid === productId);
    const productFromCart = this.cartItems().find(
      (p) => p.product.uuid === productId
    );

    if (
      product &&
      productFromCart &&
      productFromCart.quantity < productFromCart.product.availableAmount
    ) {
      this.updateQuantity(productId, productFromCart.quantity + 1);
      this.productService.updateProduct({
        ...product!,
        availableAmount: product.availableAmount - 1,
        orderAmount: product.orderAmount + 1,
      });
    }
  }

  /**
   * Decrease the quantity of the cart item.
   * @param productId - The id of the product.
   * @returns void
   */
  decreaseQuantity(productId: string) {
    const product = this.productService
      .products()
      .find((p) => p.uuid === productId);
    const productFromCart = this.cartItems().find(
      (p) => p.product.uuid === productId
    );
    if (
      productFromCart &&
      product &&
      productFromCart.quantity > product.minOrderAmount
    ) {
      this.updateQuantity(productId, productFromCart.quantity - 1);
      this.productService.updateProduct({
        ...product!,
        availableAmount: product.availableAmount + 1,
        orderAmount: product.orderAmount - 1,
      });
    }
  }

  /**
   * Get the cart items.
   * @returns The cart items.
   */
  getCartItems() {
    return this.cartItems();
  }

  /**
   * Clear the cart.
   * @returns void
   */
  clearCart() {
    this.cartItems.set([]);
  }
}
