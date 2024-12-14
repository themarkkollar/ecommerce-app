import { IProduct } from './IProduct';

export interface ICartItem {
  /**
   * The product of the cart item.
   */
  product: IProduct;
  /**
   * The quantity of the cart item.
   */
  quantity: number;
}

export interface ICart {
  /**
   * The price of the cart.
   */
  price: number;
  /**
   * The quantity of the cart.
   */
  quantity: number;
  /**
   * The product of the cart.
   */
  product: IProduct;
}
