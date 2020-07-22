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
    
    // filter on basis of product brand
    if(type == 'brand'){
      _self.filterDataByBrandName(value);
    }

    // filter data on basis of product colour
    if(type == 'color'){
      _self.filterDataByColor($event);      
    }

    // filter data on basis of product price
    if(type == 'price'){
      _self.filterDataByPrice(value);
    }
        
    // filter data on basis of discount
    if(type == 'discount'){
      
    }

    //get checked brand filter objects
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
    // get colour filter data
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

  // get price filter data 
    if(_self.productFilters[2].isChecked){
      _self.productFilters[2].values.map((item:any)=>{
        if(item.isChecked){
          let list =  _self.allProductList.filter((item)=>{
            if(item.price.final_price == $event.target.value){
              return item;
            }            
          });
          Array.prototype.push.apply( productList, list);                 
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

  filterDataByPrice(value){
    let _self = this;
    _self.productFilters[2].isChecked = false;
    _self.productFilters[2].values.map((item:any)=>{
      if (item.key == value){
        item.isChecked = true;
      }
    })      
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
