export interface IProduct {
  /**
   * The unique identifier of the product.
   */
  uuid: string;
  /**
   * The id of the product.
   */
  id: string;
  /**
   * The name of the product.
   */
  name: string;
  /**
   * The image of the product.
   */
  img: string;
  /**
   * The price of the product.
   */
  price: number;
  /**
   * The available amount of the product.
   */
  availableAmount: number;
  /**
   * The minimum order amount of the product.
   */
  minOrderAmount: number;
  /**
   * The order amount of the product.
   */
  orderAmount: number;
}
