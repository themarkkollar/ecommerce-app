import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IProduct } from '../../models/IProduct';
import { MatCardModule } from '@angular/material/card';
import { CurrencyPipe, TitleCasePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [
    MatCardModule,
    CurrencyPipe,
    MatButtonModule,
    TitleCasePipe,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
  ],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent {
  @Input() product!: IProduct;
  public quantity!: number;
  @Output() addToCart = new EventEmitter<{
    quantity: number;
    productId: string;
  }>();

  /**
   * Add to cart.
   * Check if the order is valid and emit the event.
   * @returns void
   */
  onButtonClick() {
    if (this.isValidOrder(this.product, this.quantity)) {
      this.addToCart.emit({
        quantity: this.quantity,
        productId: this.product.uuid,
      });
    }
  }

  /**
   * Check if the order is valid.
   * @param product - The product to check.
   * @param quantity - The quantity to check.
   * @returns True if the order is valid, false otherwise.
   */
  public isValidOrder(product: IProduct, quantity: number): boolean {
    return (
      quantity >= product.minOrderAmount && quantity <= product.availableAmount
    );
  }
}
