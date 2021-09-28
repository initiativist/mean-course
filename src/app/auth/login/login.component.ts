import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login', // wil get loaded through routing, selector unnecessary?
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css',]
})

export class LoginComponent implements OnInit {
  isLoading = false;
  constructor() { }

  onLogin(form: NgForm) {
    console.log(form.value)
  }

  ngOnInit() { }
}
