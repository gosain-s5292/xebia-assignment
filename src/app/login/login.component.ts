import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  public submitted :boolean = false;
  public loginForm : FormGroup;
  public responseData : any = [];
  public showAlertMessage : string = "";

  constructor(
    private loginService : LoginService,
    private router : Router,
    private _fb : FormBuilder
  ) { 
      this.loginForm = _fb.group({
        username: ['', Validators.required],
        password: ['']
      });
  }

  ngOnInit() {

  }

  submitLoginForm(loginForm){
    let _self = this;
    _self.submitted = true;
    if(loginForm.invalid){
      return false;
    }
    let username = loginForm.value.username;
    _self.loginService.loginUser(username).subscribe(
      (data)=>{
        _self.responseData = data;  
          if(_self.responseData.length){
            sessionStorage.setItem('userData', JSON.stringify(_self.responseData));
            _self.router.navigate(['products']);
          }else{
            _self.showAlertMessage = "User Does not Exists!";
          }                    
      }, (error) => {
    
    });
    

  }

}
