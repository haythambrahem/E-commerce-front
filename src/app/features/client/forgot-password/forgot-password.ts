import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css'
})
export class ForgotPassword implements OnInit {
  forgotForm!: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get email() {
    return this.forgotForm.get('email')!;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.forgotForm.valid) {
      console.log('Email envoyé pour réinitialisation :', this.forgotForm.value.email);
      alert('Un lien de réinitialisation a été envoyé à votre email.');
      this.forgotForm.reset();
      this.submitted = false;
    }
  }
}

