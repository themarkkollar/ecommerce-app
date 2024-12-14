import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductsComponent } from './products.component';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { signal } from '@angular/core';
import { IProduct } from '../../models/IProduct';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ProductsComponent', () => {
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;
  let productService: jasmine.SpyObj<ProductService>;
  let cartService: jasmine.SpyObj<CartService>;

  const mockProducts: IProduct[] = [
    {
      uuid: '1',
      name: 'Test Product 1',
      price: 10,
      minOrderAmount: 1,
      availableAmount: 10,
      img: 'img',
      id: '1',
      orderAmount: 0,
    },
    {
      uuid: '2',
      name: 'Test Product 2',
      price: 20,
      minOrderAmount: 2,
      availableAmount: 5,
      img: 'img',
      id: '2',
      orderAmount: 0,
    },
  ];

  beforeEach(async () => {
    const productServiceSpy = jasmine.createSpyObj(
      'ProductService',
      ['updateProduct'],
      {
        products: signal(mockProducts),
      }
    );
    const cartServiceSpy = jasmine.createSpyObj('CartService', ['addToCart']);

    await TestBed.configureTestingModule({
      imports: [ProductsComponent, NoopAnimationsModule],
      providers: [
        { provide: ProductService, useValue: productServiceSpy },
        { provide: CartService, useValue: cartServiceSpy },
      ],
    }).compileComponents();

    productService = TestBed.inject(
      ProductService
    ) as jasmine.SpyObj<ProductService>;
    cartService = TestBed.inject(CartService) as jasmine.SpyObj<CartService>;

    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with products from ProductService', () => {
    expect(component.products()).toEqual(mockProducts);
  });

  describe('addToCart', () => {
    it('should add valid product to cart and update product amount', () => {
      const productId = '1';
      const quantity = 3;

      component.addToCart(quantity, productId);

      expect(cartService.addToCart).toHaveBeenCalledWith(
        mockProducts[0],
        quantity
      );
      expect(productService.updateProduct).toHaveBeenCalledWith({
        ...mockProducts[0],
        availableAmount: mockProducts[0].availableAmount - quantity,
      });
    });

    it('should not add product to cart if quantity is below minimum order amount', () => {
      const productId = '2';
      const quantity = 1; // Below minOrderAmount of 2

      component.addToCart(quantity, productId);

      expect(cartService.addToCart).not.toHaveBeenCalled();
      expect(productService.updateProduct).not.toHaveBeenCalled();
    });

    it('should not add product to cart if quantity exceeds available amount', () => {
      const productId = '2';
      const quantity = 6; // Above availableAmount of 5

      component.addToCart(quantity, productId);

      expect(cartService.addToCart).not.toHaveBeenCalled();
      expect(productService.updateProduct).not.toHaveBeenCalled();
    });

    it('should not add product to cart if product is not found', () => {
      const productId = 'non-existent';
      const quantity = 1;

      component.addToCart(quantity, productId);

      expect(cartService.addToCart).not.toHaveBeenCalled();
      expect(productService.updateProduct).not.toHaveBeenCalled();
    });
  });

  describe('isValidOrder', () => {
    it('should return true for valid order quantity', () => {
      const result = component['isValidOrder'](mockProducts[0], 5);
      expect(result).toBeTruthy();
    });

    it('should return false when quantity is below minimum', () => {
      const result = component['isValidOrder'](mockProducts[1], 1);
      expect(result).toBeFalsy();
    });

    it('should return false when quantity exceeds available amount', () => {
      const result = component['isValidOrder'](mockProducts[1], 6);
      expect(result).toBeFalsy();
    });
  });

  describe('updateProductAmount', () => {
    it('should update product amount correctly', () => {
      const productId = '1';
      const quantity = 3;

      component['updateProductAmount'](productId, quantity);

      expect(productService.updateProduct).toHaveBeenCalledWith({
        ...mockProducts[0],
        availableAmount: mockProducts[0].availableAmount - quantity,
      });
    });

    it('should not update if product is not found', () => {
      component['updateProductAmount']('non-existent', 1);
      expect(productService.updateProduct).not.toHaveBeenCalled();
    });
  });
});
