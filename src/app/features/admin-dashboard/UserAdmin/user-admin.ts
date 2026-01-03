import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../core/services/user.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-user-admin',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './user-admin.html',
  styleUrls: ['./user-admin.css']
})
export class UserAdmin implements OnInit {
  users: any[] = [];

  constructor(private userService: UserService, private dialog: MatDialog) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe({
      next: (data) => this.users = data,
      error: (err) => console.error('Erreur chargement utilisateurs', err)
    });
  }

  toggleActive(userId: number, currentStatus: boolean) {
    this.userService.updateUserStatus(userId, !currentStatus).subscribe({
      next: (updatedUser) => {
        const index = this.users.findIndex(user => user.id === userId);
        if (index !== -1) {
          this.users[index] = updatedUser;
        }
      },
      error: (err) => console.error('Erreur mise à jour statut utilisateur', err)
    });
  }
}
