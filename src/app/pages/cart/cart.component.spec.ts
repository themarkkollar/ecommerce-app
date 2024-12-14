import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartComponent } from './cart.component';
import { CartService } from '../../services/cart.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { IProduct } from '../../models/IProduct';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ICart } from '../../models/ICart';

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;
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
      minOrderAmount: 1,
      availableAmount: 5,
      img: 'img',
      id: '2',
      orderAmount: 0,
    },
  ];

  const mockCartItems: ICart[] = [
    { product: mockProducts[0], quantity: 2, price: 10 },
    { product: mockProducts[1], quantity: 1, price: 20 },
  ];

  beforeEach(async () => {
    const cartServiceSpy = jasmine.createSpyObj('CartService', [
      'getCartItems',
      'totalPrice',
      'updateQuantity',
      'increaseQuantity',
      'decreaseQuantity',
    ]);

    cartServiceSpy.getCartItems.and.returnValue(mockCartItems);
    cartServiceSpy.totalPrice.and.returnValue(40); // (10 * 2) + (20 * 1)

    await TestBed.configureTestingModule({
      imports: [
        CartComponent,
        NoopAnimationsModule,
        MatCardModule,
        MatTableModule,
        MatIconModule,
        MatButtonModule,
      ],
      providers: [{ provide: CartService, useValue: cartServiceSpy }],
    }).compileComponents();

    cartService = TestBed.inject(CartService) as jasmine.SpyObj<CartService>;
    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Getters', () => {
    it('should get cart items from CartService', () => {
      const items = component.cartItems;
      expect(items).toEqual(mockCartItems);
      expect(cartService.getCartItems).toHaveBeenCalled();
    });

    it('should get total price from CartService', () => {
      const total = component.totalPrice;
      expect(total).toBe(40);
      expect(cartService.totalPrice).toHaveBeenCalled();
    });
  });

  describe('Quantity Updates', () => {
    it('should update quantity through CartService', () => {
      const productId = '1';
      const newQuantity = 3;

      component.updateQuantity(productId, newQuantity);

      expect(cartService.updateQuantity).toHaveBeenCalledWith(
        productId,
        newQuantity
      );
    });

    it('should increase quantity through CartService', () => {
      const productId = '1';

      component.increaseQuantity(productId);

      expect(cartService.increaseQuantity).toHaveBeenCalledWith(productId);
    });

    it('should decrease quantity through CartService', () => {
      const productId = '1';

      component.decreaseQuantity(productId);

      expect(cartService.decreaseQuantity).toHaveBeenCalledWith(productId);
    });
  });

  describe('Template Integration', () => {
    it('should display cart items in table', () => {
      const tableRows =
        fixture.debugElement.nativeElement.querySelectorAll('mat-row');
      expect(tableRows.length).toBe(mockCartItems.length);
    });

    it('should display total price', () => {
      const totalElement =
        fixture.debugElement.nativeElement.querySelector('.total-price');
      expect(totalElement.textContent).toContain('40');
    });

    it('should call increaseQuantity when plus button is clicked', () => {
      const plusButton = fixture.debugElement.nativeElement.querySelector(
        '.increase-quantity-button'
      );
      plusButton.click();
      expect(cartService.increaseQuantity).toHaveBeenCalled();
    });

    it('should call decreaseQuantity when minus button is clicked', () => {
      const minusButton = fixture.debugElement.nativeElement.querySelector(
        '.decrease-quantity-button'
      );
      minusButton.click();
      expect(cartService.decreaseQuantity).toHaveBeenCalled();
    });
  });
});
