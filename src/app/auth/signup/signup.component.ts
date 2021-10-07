import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup', // wil get loaded through routing, selector unnecessary?
  templateUrl: 'signup.component.html',
  styleUrls: ['signup.component.css'],
})
export class SignupComponent implements OnInit {
  isLoading = false;
  constructor(public authService: AuthService, private router: Router) {}

  onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;

    this.authService.createUser(form.value.email, form.value.password).subscribe(
      (response) => {
        this.router.navigate(['/']);
      },
      (error) => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit() {}
}
