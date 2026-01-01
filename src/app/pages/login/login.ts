import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, FormGroup, FormsModule, Validators } from '@angular/forms'
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { validate } from '@angular/forms/signals';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    FormsModule,           // for ngModel
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule
  ],
  standalone: true,
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  loginForm!: FormGroup;
  public loginIamgePath: string = '';
  public hide: boolean = true;
  public isRegisterMode: boolean = false;
  public errorMessage: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      firstname: [''], // Optional initially
      lastname: [''],   // Optional initially
      isAdmin: [false]
    });
    this.loginIamgePath = '../../../src/';
  }

  toggleMode() {
    this.isRegisterMode = !this.isRegisterMode;
    // Reset form or adjust validators if strict validation is needed
    if (this.isRegisterMode) {
      this.loginForm.get('firstname')?.addValidators(Validators.required);
      this.loginForm.get('lastname')?.addValidators(Validators.required);
    } else {
      this.loginForm.get('firstname')?.clearValidators();
      this.loginForm.get('lastname')?.clearValidators();
    }
    this.loginForm.get('firstname')?.updateValueAndValidity();
    this.loginForm.get('lastname')?.updateValueAndValidity();
  }

  submit() {
    if (this.loginForm.invalid) return;

    if (this.isRegisterMode) {
      const formValue = this.loginForm.value;
      const registerData = {
        firstName: formValue.firstname,
        lastName: formValue.lastname,
        email: formValue.username,
        password: formValue.password,
        role: formValue.isAdmin ? 'AdminRequest' : 'User'
      };

      this.authService.register(registerData).subscribe({
        next: (res) => {
          console.log('Registration successful', res);
          this.toggleMode();
          alert('Registration successful! Please sign in.');
        },
        error: (err) => {
          console.error('Registration failed', err);
          alert('Registration failed. Please try again.');
        }
      });
    } else {
      this.login();
    }
  }

  login() {
    this.errorMessage = ''; // Clear previous errors
    let email = this.loginForm.get('username')?.value;
    let password = this.loginForm.get('password')?.value;

    console.log(email, password);
    this.authService.login({ email, password }).subscribe({
      next: (res) => {
        console.log(res);
        if (res.success) {
          this.errorMessage = '';
          this.router.navigate(['']);
        } else {
          console.log('Email or password is not matched. Please try again.');
          this.errorMessage = 'The email or password you entered is incorrect. Please check your credentials and try again.';
          this.cdr.detectChanges();
        }
      },
    });
  }
}
