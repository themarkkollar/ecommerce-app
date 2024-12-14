import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProductService } from './services/product.service';
import { CartService } from './services/cart.service';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, HttpClientTestingModule],
      providers: [CartService, ProductService],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'e-commerce-app' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('e-commerce-app');
  });
});
