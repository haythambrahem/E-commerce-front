import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/interface/user';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
  CommonModule],
  
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login  implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder,
        private router: Router,

          private userService: UserService
    
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get email() {
    return this.loginForm.get('email')!;
  }

  get password() {
    return this.loginForm.get('password')!;
  }


  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.userService.login(email, password).subscribe({
        next: (user: User) => {
          console.log('✅ Connexion réussie :', user);
          // Tu peux enregistrer l’utilisateur dans le localStorage si besoin
          localStorage.setItem('user', JSON.stringify(user));

          // Redirection vers la page d’accueil
          this.router.navigate(['/home']);
        },
        error: (err) => {
          console.error('❌ Erreur de connexion :', err);
          this.errorMessage = "Email ou mot de passe incorrect !";
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }


}