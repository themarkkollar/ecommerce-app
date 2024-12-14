import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IProduct } from '../models/IProduct';
import { environment } from '../../environments/environment';
import { Injectable, signal } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  public products = signal<IProduct[]>([]);
  private loadOnInit = true;

  constructor(private http: HttpClient) {
    if (this.loadOnInit) {
      this.loadProducts();
    }
  }

  /**
   * Load the products.
   * @returns void
   */
  public loadProducts(): void {
    this.fetchProducts().subscribe({
      next: (products) => {
        const uniqueProducts = products.map((product) => ({
          ...product,
          uuid: uuidv4(),
        }));
        this.products.set(uniqueProducts);
      },
      error: (error) => {
        console.error('Failed to fetch products:', error);
        // You might want to add error handling logic here
      },
    });
  }

  /**
   * Fetch the products from the API.
   * @returns The products.
   */
  public fetchProducts(): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(`${environment.apiBaseUrl}`);
  }

  /**
   * Update the product.
   * @param product - The product to update.
   * @returns void
   */
  public updateProduct(product: IProduct): void {
    this.products.update((products) =>
      products.map((p) => (p.uuid === product.uuid ? product : p))
    );
  }

  /**
   * Get the products.
   * @returns The products.
   */
  public getProducts() {
    return this.products();
  }

  /**
   * Refresh the products.
   * @returns void
   */
  public refreshProducts(): void {
    this.loadProducts();
  }
}
