import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class ProductService {

  constructor(
    private http: HttpClient,
  ) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  getProductListing(){
    let url = "https://xebiascart.herokuapp.com/products";
    return this.http.get(url, this.httpOptions);
  }

  getProductFilters(){    
    let url = "https://xebiascart.herokuapp.com/filters";
    return this.http.get(url, this.httpOptions);
  }

  getSearchItem(item){
    let url = "https://xebiascart.herokuapp.com/products?title="+item;
    return this.http.get(url, this.httpOptions);
  }

}
