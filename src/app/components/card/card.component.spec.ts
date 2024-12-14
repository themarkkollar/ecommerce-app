import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardComponent } from './card.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { IProduct } from '../../models/IProduct';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

describe('CardComponent', () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;

  const mockProduct: IProduct = {
    uuid: '1',
    name: 'Test Product',
    price: 10,
    minOrderAmount: 2,
    availableAmount: 10,
    img: 'img',
    id: '1',
    orderAmount: 0,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CardComponent,
        NoopAnimationsModule,
        FormsModule,
        MatCardModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CardComponent);
    component = fixture.componentInstance;
    component.product = mockProduct;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Input properties', () => {
    it('should receive product input correctly', () => {
      expect(component.product).toEqual(mockProduct);
    });
  });

  describe('isValidOrder', () => {
    it('should return true when quantity is within valid range', () => {
      const result = component.isValidOrder(mockProduct, 5);
      expect(result).toBeTruthy();
    });

    it('should return true when quantity equals minimum order amount', () => {
      const result = component.isValidOrder(
        mockProduct,
        mockProduct.minOrderAmount
      );
      expect(result).toBeTruthy();
    });

    it('should return true when quantity equals available amount', () => {
      const result = component.isValidOrder(
        mockProduct,
        mockProduct.availableAmount
      );
      expect(result).toBeTruthy();
    });

    it('should return false when quantity is below minimum order amount', () => {
      const result = component.isValidOrder(mockProduct, 1);
      expect(result).toBeFalsy();
    });

    it('should return false when quantity exceeds available amount', () => {
      const result = component.isValidOrder(mockProduct, 11);
      expect(result).toBeFalsy();
    });
  });

  describe('onButtonClick', () => {
    it('should emit addToCart event when order is valid', () => {
      const spy = spyOn(component.addToCart, 'emit');
      component.quantity = 5;

      component.onButtonClick();

      expect(spy).toHaveBeenCalledWith({
        quantity: 5,
        productId: mockProduct.uuid,
      });
    });

    it('should not emit addToCart event when quantity is below minimum', () => {
      const spy = spyOn(component.addToCart, 'emit');
      component.quantity = 1;

      component.onButtonClick();

      expect(spy).not.toHaveBeenCalled();
    });

    it('should not emit addToCart event when quantity exceeds available amount', () => {
      const spy = spyOn(component.addToCart, 'emit');
      component.quantity = 11;

      component.onButtonClick();

      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('Template integration', () => {
    it('should update quantity when input value changes', () => {
      const input = fixture.debugElement.nativeElement.querySelector('input');
      input.value = '5';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(component.quantity).toBe(5);
    });

    it('should enable add to cart button when quantity is valid', () => {
      component.quantity = 5; // Valid quantity
      fixture.detectChanges();

      const button = fixture.debugElement.nativeElement.querySelector('button');
      expect(button.disabled).toBeFalsy();
    });
  });
});
