import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService, UserPageParams } from '../services/user.service';
import { User, ApiPage } from '../../../core/models';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="user-list-container">
      <header class="page-header">
        <h1>Users</h1>
        <a routerLink="/users/new" class="btn btn-primary">Add User</a>
      </header>

      @if (loading) {
        <div class="loading">Loading users...</div>
      }

      @if (errorMessage) {
        <div class="error-message">{{ errorMessage }}</div>
      }

      @if (!loading && !errorMessage) {
        <div class="users-table-container">
          <table class="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Name</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (user of users; track user.id) {
                <tr>
                  <td>#{{ user.id }}</td>
                  <td>{{ user.username }}</td>
                  <td>{{ user.email }}</td>
                  <td>{{ user.firstName }} {{ user.lastName }}</td>
                  <td>
                    <span class="role-badge">{{ user.role || 'USER' }}</span>
                  </td>
                  <td>
                    <div class="actions">
                      <a [routerLink]="['/users', user.id, 'edit']" class="btn btn-small btn-secondary">Edit</a>
                      <button (click)="deleteUser(user)" class="btn btn-small btn-danger">Delete</button>
                    </div>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="6" class="no-data">No users found.</td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        @if (pageData) {
          <div class="pagination">
            <button 
              (click)="loadPage(currentPage - 1)" 
              [disabled]="currentPage === 0"
              class="btn">
              Previous
            </button>
            <span class="page-info">
              Page {{ currentPage + 1 }} of {{ pageData.totalPages }}
              ({{ pageData.totalElements }} total)
            </span>
            <button 
              (click)="loadPage(currentPage + 1)" 
              [disabled]="currentPage >= pageData.totalPages - 1"
              class="btn">
              Next
            </button>
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .user-list-container {
      padding: 20px;
    }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .users-table-container {
      overflow-x: auto;
    }
    .users-table {
      width: 100%;
      border-collapse: collapse;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .users-table th,
    .users-table td {
      padding: 12px 16px;
      text-align: left;
      border-bottom: 1px solid #e0e0e0;
    }
    .users-table th {
      background: #f5f5f5;
      font-weight: 600;
    }
    .users-table tbody tr:hover {
      background: #fafafa;
    }
    .role-badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
      background: #e3f2fd;
      color: #1565c0;
    }
    .actions {
      display: flex;
      gap: 8px;
    }
    .btn {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      text-decoration: none;
      font-size: 14px;
    }
    .btn-small {
      padding: 4px 8px;
      font-size: 12px;
    }
    .btn-primary {
      background: #1976d2;
      color: white;
    }
    .btn-secondary {
      background: #e0e0e0;
      color: #333;
    }
    .btn-danger {
      background: #d32f2f;
      color: white;
    }
    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 16px;
      margin-top: 20px;
    }
    .page-info {
      color: #666;
    }
    .loading, .error-message, .no-data {
      text-align: center;
      padding: 40px;
    }
    .error-message {
      color: #d32f2f;
    }
  `]
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  pageData: ApiPage<User> | null = null;
  loading = false;
  errorMessage = '';
  currentPage = 0;
  pageSize = 10;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadPage(0);
  }

  loadPage(page: number): void {
    if (page < 0) return;
    
    this.loading = true;
    this.errorMessage = '';

    const params: UserPageParams = {
      page,
      size: this.pageSize
    };

    this.userService.getPage(params).subscribe({
      next: (data) => {
        this.pageData = data;
        this.users = data.content;
        this.currentPage = data.number;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.loading = false;
      }
    });
  }

  deleteUser(user: User): void {
    if (!user.id || !confirm(`Are you sure you want to delete user "${user.username}"?`)) {
      return;
    }

    this.userService.delete(user.id).subscribe({
      next: () => {
        this.loadPage(this.currentPage);
      },
      error: (err) => {
        this.errorMessage = err.message;
      }
    });
  }
}
