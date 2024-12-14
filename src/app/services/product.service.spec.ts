import { TestBed } from '@angular/core/testing';
import { ProductService } from './product.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { environment } from '../../environments/environment';
import { IProduct } from '../models/IProduct';
import { HttpClient } from '@angular/common/http';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  const mockProducts: IProduct[] = [
    {
      id: '1',
      name: 'Product 1',
      price: 100,
      uuid: '1',
      img: '',
      availableAmount: 1,
      minOrderAmount: 1,
      orderAmount: 1,
    },
    {
      id: '2',
      name: 'Product 2',
      price: 200,
      uuid: '2',
      img: '',
      availableAmount: 1,
      minOrderAmount: 1,
      orderAmount: 1,
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: ProductService,
          useFactory: (http: HttpClient) => new ProductService(http),
          deps: [HttpClient],
        },
      ],
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);

    const req = httpMock.expectOne(`${environment.apiBaseUrl}`);
    req.flush(mockProducts);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('loadProducts', () => {
    it('should load products and add uuid to each product', () => {
      service.loadProducts();

      const req = httpMock.expectOne(`${environment.apiBaseUrl}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockProducts);

      const products = service.getProducts();
      expect(products.length).toBe(2);
      expect(products[0].uuid).toBeDefined();
      expect(products[1].uuid).toBeDefined();
    });

    it('should handle error when loading products fails', () => {
      const errorMessage = 'Server error';
      spyOn(console, 'error');

      service.loadProducts();

      const req = httpMock.expectOne(`${environment.apiBaseUrl}`);
      req.error(
        new ErrorEvent('Network error', {
          message: errorMessage,
        })
      );

      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('fetchProducts', () => {
    it('should return an Observable of products', () => {
      service.fetchProducts().subscribe((products) => {
        expect(products).toEqual(mockProducts);
      });

      const req = httpMock.expectOne(`${environment.apiBaseUrl}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockProducts);
    });
  });

  describe('updateProduct', () => {
    it('should update a product in the products array', () => {
      service.loadProducts();
      const req = httpMock.expectOne(`${environment.apiBaseUrl}`);
      req.flush(mockProducts);

      const products = service.getProducts();
      const updatedProduct = {
        ...products[0],
        name: 'Updated Product',
      };

      service.updateProduct(updatedProduct);

      const updatedProducts = service.getProducts();
      expect(
        updatedProducts.find((p) => p.uuid === updatedProduct.uuid)?.name
      ).toBe('Updated Product');
    });
  });

  describe('refreshProducts', () => {
    it('should call loadProducts', () => {
      spyOn(service, 'loadProducts');

      service.refreshProducts();

      expect(service.loadProducts).toHaveBeenCalled();
    });
  });
});
