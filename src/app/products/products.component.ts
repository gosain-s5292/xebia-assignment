import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../services/products.service';
import { map } from 'rxjs/operators';
import { debug } from 'util';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {


  constructor(
    private router:Router,
    private productService : ProductService
  ) { }

  public userData : any = {
    username:""
  };
  public allProductList : any = sessionStorage.getItem('allProducts')?JSON.parse(sessionStorage.getItem('allProducts')) : null;
  public isSearchResultExists : boolean  = false;
  public showProductNotFound : boolean = false;
  public searchResult:any;
  public products:any;
  public productFilters : any;
  public colorFilters: any;
  public brandFilters: any;
  public priceFilters: any;

  public showSideBar:boolean = false;
  public hideSideBar:boolean = true;
  public count : number = 0;

  ngOnInit() {

    if(sessionStorage.getItem('userData')){
      this.userData = JSON.parse(sessionStorage.getItem('userData'));

      // Get Product Listing
      this.getProductList();  
      
      // Get Product Filter List
      this.getProductFilters();  
      
      if(window.innerWidth <=576){
        this.hideSideBar = true;
      }else{
        this.hideSideBar = false;
      }

      window.addEventListener('resize', this.reportWindowSize);
    }else{
      this.router.navigate(["/login"]);
    }

  }

  reportWindowSize(){
    
    if(window.innerWidth <=576){
      this.hideSideBar = true;
    }else{
      this.hideSideBar = false;
    }

  }

  addItemToCart(id){
    let _self = this;
    _self.count = 0;
    _self.allProductList.map((item)=>{
      if(item.id == id){
        item.isadded = true;
      }

      if(item.isadded){
        _self.count = _self.count + 1;
      }
      return item;
    });

  }

  removeItemFromCart(id){
    let _self = this;
    _self.count = 0;
    _self.allProductList.map((item)=>{      

      if(item.isadded){
        _self.count = _self.count + 1;
      }

      if(item.id == id){
        item.isadded = false;
        _self.count = _self.count - 1;
      }

      return item;
    });
  }

  showSideBarHandler(){
    let _self = this;
    document.getElementById("leftSideBar").style.left = '0px';    
    document.getElementById("leftSideBar").style.backgroundColor = '#fff';
    document.getElementById("leftSideBar").style.boxShadow = '0px 0px -4px 5px';
    document.getElementById("leftSideBar").style.zIndex = '99';
    document.getElementById("leftSideBar").style.width = '100%';
    _self.showSideBar = true;
    _self.hideSideBar = false;
  }

  hideSideBarHandler(){
    let _self = this;
    document.getElementById("leftSideBar").style.left = '-240px';
    document.getElementById("leftSideBar").style.width = 'calc(100% - 240px)';
    _self.showSideBar = false;
    _self.hideSideBar = true;
  }

  onSearch($event){
    let _self = this;
    if($event.which == 13){
      let value = $event.target.value;
      if($event.target.value){       
         
          _self.isSearchResultExists = true;
        _self.productService.getSearchItem(value).subscribe((data)=>{
          _self.searchResult = data;
          if(_self.searchResult.length){
            _self.products = _self.searchResult;
          }else{
            _self.showProductNotFound = true;
          }
        },error=>{
          if(error.error){
            alert(error.error.message);
          }else{
            alert(error.message);
          }
        });
      }else{
        _self.isSearchResultExists = false;
        alert("please enter value");
      }      
    }else{
      return;
    }

  }

  showFilteredResult($event, type){
    let _self = this;
    let productList:any = [];
    const value = $event.target.value;
     
    switch(type){
      case 'brand':  //// filter on basis of product brand
        _self.filterDataByBrandName(value);

      case 'color': //// filter data on basis of product colour
        _self.filterDataByColor($event);      
      
      case 'price': //// filter data on basis of product price                
        _self.filterDataByPrice();
      
      case 'discount': 
        // _self.filterDataByDiscount(value);
    }

    //get selected product on basis of brand data
    if(_self.productFilters[0].isChecked){
      
      _self.productFilters[0].values.map((item1:any)=>{
        if(item1.isChecked){
          let list =  _self.allProductList.filter((item2)=>{
            if(item1.value == item2.brand){
              return item2;
            }
          });
          if(list.length){
            Array.prototype.push.apply(productList, list);
          }          
        }

      });
    }

    // get product on basis od colour
    if(_self.productFilters[1].isChecked){
      _self.productFilters[1].values.map((item1:any)=>{
        if(item1.isChecked){
          let list =  _self.allProductList.filter((item2)=>{
            if(item1.color == item2.colour.color){
              return item2;
            }            
          });
          Array.prototype.push.apply( productList, list); 
        }
      });      
    }
debugger;
  // get product on basis of price 
    if(_self.productFilters[2].isChecked){
      _self.productFilters[2].values.map((item:any)=>{
        if(item.isPriceChecked){

          let minPriceEle:any = document.getElementById('min-price-filter');
          let maxPriceEle:any = document.getElementById('max-price-filter');
          let minPrice = Number(minPriceEle.value);
          let maxPrice =  maxPriceEle.value.indexOf('+')>0 ? 4001:  Number(maxPriceEle.value);
          debugger;
          if(minPrice > 0  && maxPrice == 0){
            let list =  _self.allProductList.filter((item)=>{
              if(item.price.final_price >= minPrice){
                return item;
              }            
            });
            Array.prototype.push.apply( productList, list);
          }else if(minPrice == 0 && maxPrice > 0){
            let list =  _self.allProductList.filter((item)=>{
              if(item.price.final_price <= maxPrice){
                return item;
              }
            });
            Array.prototype.push.apply( productList, list);
          }else if(minPrice != 0 && minPrice != 0 ){
            let list =  _self.allProductList.filter((item)=>{
              if(item.price.final_price >= minPrice && item.price.final_price <= maxPrice){
                return item;
              }            
            });
            Array.prototype.push.apply( productList, list);
          }
        }
      });      
    }
    
    if(productList.length){
      _self.applyFilter(productList);  
    }else{
      _self.applyFilter(_self.allProductList);  
    }
    

  }


  filterDataByBrandName(value){
    let _self = this;
    if(value !== "0"){
      _self.productFilters[0].isChecked = true;
      _self.productFilters[0].values.map((item:any)=>{
          item.isChecked = false;
          if (item.value == value){
            item.isChecked = true;
          }
      });

    }else{
      _self.productFilters[0].isChecked = false;
    }
    
  }

  filterDataByColor($event){
    let _self = this;
    let productList = [];
    if($event.target.checked){        
      _self.productFilters[1].isChecked = true;

      _self.productFilters[1].values.map((item:any)=>{          
        if (item.color == $event.target.value){
          item.isChecked = true;
        }          
      });

    }else{
      
      _self.productFilters[1].isChecked = false;
      
      _self.productFilters[1].values.map((item:any)=>{
        if (item.color == $event.target.value){            
          item.isChecked = false;
        }

        if(item.isChecked){
          _self.productFilters[1].isChecked = true;
        }

      });
    }
  }

  filterDataByPrice(){
    let _self = this;

    let minPriceEle:any = document.getElementById('min-price-filter');
    let maxPriceEle:any = document.getElementById('max-price-filter');
    let minPrice = Number(minPriceEle.value);
    let maxPrice =  maxPriceEle.value.indexOf('+')>0 ? 4001:  Number(maxPriceEle.value);
    debugger;
    if((minPrice > maxPrice) && (minPrice && maxPrice)){
      alert('minimum price must be less than max price');
      return;
    }

    if(minPrice > 0  && maxPrice == 0){
      _self.productFilters[2].isChecked = true;
      _self.productFilters[2].values.map((item:any)=>{
        item.isPriceChecked = false;
        if (item.key == minPrice){
          item.isPriceChecked = true;
        }
      });
    }else if(minPrice == 0 && maxPrice > 0){
      _self.productFilters[2].isChecked = true;
      _self.productFilters[2].values.map((item:any)=>{
        item.isPriceChecked = false;
        if (item.key == maxPrice){
          item.isPriceChecked = true;
        }
      });
    }else if(minPrice != 0 && minPrice != 0 ){
      _self.productFilters[2].isChecked = true;
      _self.productFilters[2].values.map((item:any)=>{
        item.isPriceChecked = false;
        if ((item.key == minPrice) || item.key == maxPrice){
          item.isPriceChecked = true;
        }
      });
    }else{
      _self.productFilters[2].isChecked = false;
      _self.productFilters[2].values.map((item:any)=>{
        item.isPriceChecked = false;
      });      
      alert("please select price to filter data");
    }    
  }
  

  applyFilter(filteredList){
    this.products  = filteredList;
  }

  showAllProducts(){
    let _self = this;
    _self.isSearchResultExists = false;
    _self.showProductNotFound = false;
    if(_self.allProductList){      
      _self.products = JSON.parse(sessionStorage.getItem('allProducts'));
    }else{
      _self.getProductList();
    }    
  }

  getProductList(){
    let _self = this;
    this.productService.getProductListing().subscribe(
      (data:any)=>{
        _self.allProductList = data;
        _self.allProductList = data.map((item:any)=>{
            item.isadded = false;
            return item;
        });

        _self.products = data;

        if(_self.products.length){
          _self.allProductList = data;
          sessionStorage.setItem('allProducts', JSON.stringify(_self.allProductList));
        }else{
          _self.allProductList = null;
          _self.showProductNotFound = true;
        }        
      },
      (error)=>{
        _self.showProductNotFound = true;

      }
    )
  }

  getProductFilters(){
    let _self = this;
    this.productService.getProductFilters().subscribe(
      (data)=>{
        _self.productFilters = data;
        _self.colorFilters = _self.productFilters[1].values;
        _self.brandFilters = _self.productFilters[0].values
        _self.priceFilters = _self.productFilters[2].values;

        _self.productFilters = _self.productFilters.map((item:any) => {
            item.values.map((subItem:any) => {  
              subItem.isChecked = false;
            });          
          return item;
        });

        sessionStorage.setItem('allFiltersList', _self.productFilters)
      },
      (error)=>{

      }
    )
  }

}
