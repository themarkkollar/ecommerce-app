import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';
import { ProductService } from './product.service';
import { IProduct } from '../models/IProduct';

describe('CartService', () => {
  let service: CartService;
  let productService: ProductService;

  const mockProduct: IProduct = {
    uuid: '1',
    id: '1',
    name: 'Test Product',
    price: 100,
    img: 'test.jpg',
    availableAmount: 10,
    orderAmount: 0,
    minOrderAmount: 1,
  };

  const mockProduct2: IProduct = {
    ...mockProduct,
    uuid: '2',
    name: 'Test Product 2',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CartService,
        {
          provide: ProductService,
          useValue: {
            products: () => [mockProduct, mockProduct2],
            updateProduct: jasmine.createSpy('updateProduct'),
          },
        },
      ],
    });
    service = TestBed.inject(CartService);
    productService = TestBed.inject(ProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('addToCart', () => {
    it('should add new item to cart', () => {
      service.addToCart(mockProduct, 1);
      expect(service.cartItems().length).toBe(1);
      expect(service.cartItems()[0].product).toEqual(mockProduct);
      expect(service.cartItems()[0].quantity).toBe(1);
      expect(service.cartItems()[0].price).toBe(100);
    });

    it('should update quantity if item already exists', () => {
      service.addToCart(mockProduct, 1);
      service.addToCart(mockProduct, 2);
      expect(service.cartItems().length).toBe(1);
      expect(service.cartItems()[0].quantity).toBe(3);
      expect(service.cartItems()[0].price).toBe(300);
    });
  });

  describe('removeFromCart', () => {
    it('should remove item from cart', () => {
      service.addToCart(mockProduct, 1);
      service.removeFromCart(mockProduct.uuid);
      expect(service.cartItems().length).toBe(0);
    });
  });

  describe('updateQuantity', () => {
    it('should update quantity within allowed limits', () => {
      service.addToCart(mockProduct, 1);
      service.updateQuantity(mockProduct.uuid, 5);
      expect(service.cartItems()[0].quantity).toBe(5);
      expect(service.cartItems()[0].price).toBe(500);
    });

    it('should not update quantity if exceeds available amount', () => {
      service.addToCart(mockProduct, 1);
      service.updateQuantity(mockProduct.uuid, 11);
      expect(service.cartItems()[0].quantity).toBe(1);
    });

    it('should not update quantity if below min order amount', () => {
      service.addToCart(mockProduct, 2);
      service.updateQuantity(mockProduct.uuid, 0);
      expect(service.cartItems()[0].quantity).toBe(2);
    });
  });

  describe('increaseQuantity', () => {
    it('should increase quantity and update product', () => {
      service.addToCart(mockProduct, 1);
      service.increaseQuantity(mockProduct.uuid);
      expect(service.cartItems()[0].quantity).toBe(2);
      expect(productService.updateProduct).toHaveBeenCalledWith({
        ...mockProduct,
        availableAmount: 9,
        orderAmount: 1,
      });
    });

    it('should not increase beyond available amount', () => {
      service.addToCart(mockProduct, 10);
      service.increaseQuantity(mockProduct.uuid);
      expect(service.cartItems()[0].quantity).toBe(10);
    });
  });

  describe('decreaseQuantity', () => {
    it('should decrease quantity and update product', () => {
      service.addToCart(mockProduct, 2);
      service.decreaseQuantity(mockProduct.uuid);
      expect(service.cartItems()[0].quantity).toBe(1);
      expect(productService.updateProduct).toHaveBeenCalledWith({
        ...mockProduct,
        availableAmount: 11,
        orderAmount: -1,
      });
    });

    it('should not decrease below min order amount', () => {
      service.addToCart(mockProduct, 1);
      service.decreaseQuantity(mockProduct.uuid);
      expect(service.cartItems()[0].quantity).toBe(1);
    });
  });

  describe('computed values', () => {
    it('should calculate total items correctly', () => {
      service.addToCart(mockProduct, 2);
      service.addToCart(mockProduct2, 3);
      expect(service.totalItems()).toBe(2);
    });

    it('should calculate total price correctly', () => {
      service.addToCart(mockProduct, 2); // 200
      service.addToCart(mockProduct2, 3); // 300
      expect(service.totalPrice()).toBe(500);
    });
  });

  describe('clearCart', () => {
    it('should clear all items from cart', () => {
      service.addToCart(mockProduct, 1);
      service.addToCart(mockProduct2, 1);
      service.clearCart();
      expect(service.cartItems().length).toBe(0);
      expect(service.totalItems()).toBe(0);
      expect(service.totalPrice()).toBe(0);
    });
  });
});
