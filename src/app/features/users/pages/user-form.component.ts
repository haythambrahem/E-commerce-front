import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserService } from '../services/user.service';
import { User } from '../../../core/models';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="user-form-container">
      <header class="page-header">
        <h1>{{ isEditMode ? 'Edit User' : 'New User' }}</h1>
        <a routerLink="/users" class="btn btn-secondary">Back to List</a>
      </header>

      @if (loading) {
        <div class="loading">Loading...</div>
      }

      @if (errorMessage) {
        <div class="error-message">{{ errorMessage }}</div>
      }

      @if (!loading) {
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="user-form">
          <div class="form-group">
            <label for="username">Username *</label>
            <input 
              id="username" 
              type="text" 
              formControlName="username"
              [class.invalid]="form.get('username')?.invalid && form.get('username')?.touched">
            @if (form.get('username')?.invalid && form.get('username')?.touched) {
              <span class="error">Username is required</span>
            }
          </div>

          <div class="form-group">
            <label for="email">Email *</label>
            <input 
              id="email" 
              type="email" 
              formControlName="email"
              [class.invalid]="form.get('email')?.invalid && form.get('email')?.touched">
            @if (form.get('email')?.invalid && form.get('email')?.touched) {
              <span class="error">Valid email is required</span>
            }
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="firstName">First Name</label>
              <input id="firstName" type="text" formControlName="firstName">
            </div>

            <div class="form-group">
              <label for="lastName">Last Name</label>
              <input id="lastName" type="text" formControlName="lastName">
            </div>
          </div>

          <div class="form-group">
            <label for="role">Role</label>
            <select id="role" formControlName="role">
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <div class="form-actions">
            <button type="submit" [disabled]="form.invalid || submitting" class="btn btn-primary">
              {{ submitting ? 'Saving...' : (isEditMode ? 'Update' : 'Create') }}
            </button>
            <a routerLink="/users" class="btn btn-secondary">Cancel</a>
          </div>
        </form>
      }
    </div>
  `,
  styles: [`
    .user-form-container {
      padding: 20px;
      max-width: 600px;
      margin: 0 auto;
    }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    .user-form {
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 24px;
    }
    .form-group {
      margin-bottom: 20px;
    }
    .form-group label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
    }
    .form-group input,
    .form-group select {
      width: 100%;
      padding: 10px;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      font-size: 14px;
    }
    .form-group input.invalid {
      border-color: #d32f2f;
    }
    .form-group .error {
      color: #d32f2f;
      font-size: 12px;
      margin-top: 4px;
      display: block;
    }
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    .form-actions {
      display: flex;
      gap: 12px;
      margin-top: 24px;
    }
    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      text-decoration: none;
      font-size: 14px;
    }
    .btn-primary {
      background: #1976d2;
      color: white;
    }
    .btn-secondary {
      background: #e0e0e0;
      color: #333;
    }
    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .loading, .error-message {
      text-align: center;
      padding: 20px;
    }
    .error-message {
      color: #d32f2f;
      background: #ffebee;
      border-radius: 4px;
      margin-bottom: 16px;
    }
  `]
})
export class UserFormComponent implements OnInit {
  form!: FormGroup;
  isEditMode = false;
  userId: number | null = null;
  loading = false;
  submitting = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.initForm();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.userId = Number(id);
      this.loadUser(this.userId);
    }
  }

  private initForm(): void {
    this.form = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      firstName: [''],
      lastName: [''],
      role: ['USER']
    });
  }

  private loadUser(id: number): void {
    this.loading = true;
    this.userService.getById(id).subscribe({
      next: (user) => {
        this.form.patchValue({
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role || 'USER'
        });
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.submitting = true;
    this.errorMessage = '';

    const user: User = this.form.value;

    const operation = this.isEditMode && this.userId
      ? this.userService.update(this.userId, user)
      : this.userService.create(user);

    operation.subscribe({
      next: () => {
        this.router.navigate(['/users']);
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.submitting = false;
      }
    });
  }
}
