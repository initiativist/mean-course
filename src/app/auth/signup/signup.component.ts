import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-signup', // wil get loaded through routing, selector unnecessary?
  templateUrl: 'signup.component.html',
  styleUrls: ['signup.component.css',]
})

export class SignupComponent implements OnInit {
  isLoading = false;
  constructor() { }

  onSignup(form: NgForm) {
    console.log(form.value)
  }

  ngOnInit() { }
}
