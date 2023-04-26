import {Injectable } from "@angular/core";
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http'
import { catchError, delay, Observable, retry, tap, throwError } from "rxjs";
import { IProduct } from "../models/product";
import { ErrorService } from "./error.service";

@Injectable({
    providedIn: 'root'
})
export class ProductsService{
    constructor(
      private http: HttpClient,
      private errorService :ErrorService

      ) {
    }
   // https://fakestoreapi.com/products

    products: IProduct[] = []

     getAll(): Observable<IProduct[]> {
      return this.http.get<IProduct[]>('https://localhost:7197/api/Products' , { //params: new HttpParams().append('limit', 5)})
      params: new HttpParams({
        // fromString: 'limit=5'
        fromObject:{limit:7}
      })
    }).pipe(
        delay(200),
        retry(2),
        tap(products => this.products = products),
        catchError(this.errorHander.bind(this))
    )
}




create(product: IProduct): Observable<IProduct> {
 return this.http.post<IProduct>("https://localhost:7197/api/Products", product)
 //return this.http.post<IProduct>('https://fakestoreapi.com/products', product)
// return this.http.post<IProduct>("https://localhost:7249/api/SuperHero", product)
    .pipe(
      tap(prod => this.products.push(prod))
)}

private errorHander(error: HttpErrorResponse){

  this.errorService.handle(error.message)
  return throwError(() => error.message)

}


}
