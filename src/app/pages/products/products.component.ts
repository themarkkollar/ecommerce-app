import { Component, OnInit, signal } from '@angular/core';
import { IProduct } from '../../models/IProduct';
import { ProductService } from '../../services/product.service';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CardComponent } from '../../components/card/card.component';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [MatGridListModule, MatButtonModule, MatCardModule, CardComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent implements OnInit {
  products = signal<IProduct[]>([]);

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.products = this.productService.products;
  }

  /**
   * Add to cart.
   * @param quantity - The quantity to add.
   * @param productId - The id of the product.
   * @returns void
   */
  addToCart(quantity: number, productId: string) {
    const product = this.products().find((p) => p.uuid === productId);
    if (product && this.isValidOrder(product, quantity)) {
      this.cartService.addToCart(product, quantity);
      this.updateProductAmount(productId, quantity);
    }
  }

  /**
   * Check if the order is valid.
   * @param product - The product to check.
   * @param quantity - The quantity to check.
   * @returns True if the order is valid, false otherwise.
   */
  private isValidOrder(product: IProduct, quantity: number): boolean {
    return (
      quantity >= product.minOrderAmount && quantity <= product.availableAmount
    );
  }

  /**
   * Update the product amount.
   * @param productId - The id of the product.
   * @param quantity - The quantity to update.
   * @returns void
   */
  private updateProductAmount(productId: string, quantity: number) {
    const product = this.products().find((p) => p.uuid === productId);

    if (product) {
      this.productService.updateProduct({
        ...product,
        availableAmount: product.availableAmount - quantity,
      });
    }
  }
}
