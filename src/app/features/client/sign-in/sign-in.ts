import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../../core/interface/user';
import { UserService } from '../../../core/services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sign-in',
  standalone: true, // ✅ recommandé dans Angular 20
  imports: [
     ReactiveFormsModule, CommonModule
  ],
  templateUrl: './sign-in.html',
  styleUrls: ['./sign-in.css'] // ✅ attention au "s"
})
export class SignIn implements OnInit {

  signupForm!: FormGroup;

  constructor(
      private fb: FormBuilder,
      private router: Router,
      private userService: UserService,
      private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
  

  onSubmit() {
  if (this.signupForm.valid) {
    const newUser: User = {
      userName: this.signupForm.value.name,
      email: this.signupForm.value.email,
      password: this.signupForm.value.password
    };

    this.userService.createUser(newUser).subscribe({
      next: (response) => {
        console.log('User created successfully:', response);
        this.toastr.success('Compte créé avec succès 🎉');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error creating user:', err);
        if (err.status === 409 && err.error === 'Email déjà utilisé !') {
          this.toastr.error('❌ Cet email est déjà utilisé !');
        } else {
          this.toastr.error('Erreur lors de la création du compte.');
        }
      }
    });
  } else {
    this.signupForm.markAllAsTouched();
  }
}

}
