import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommandService } from '../../../core/services/CommandService';

@Component({
  selector: 'app-command-admin',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="command-admin">
      <h2>📦 Gestion des Commandes</h2>
      <p>Liste des commandes à venir...</p>
    </div>
  `,
  styles: [`
    .command-admin {
      padding: 2rem;
    }
  `]
})
export class CommandAdmin implements OnInit {
  commands: any[] = [];

  constructor(
    private commandService: CommandService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadCommands();
  }

  loadCommands() {
    this.commandService.getAllCommands().subscribe({
      next: (data) => this.commands = data,
      error: (err) => console.error('Erreur chargement commandes', err)
    });
  }

  markAsShipped(commandId: number) {
    this.commandService.updateCommandStatus(commandId, 'EXPÉDIÉE').subscribe({
      next: () => {
        const cmd = this.commands.find(c => c.id === commandId);
        if (cmd) cmd.status = 'EXPÉDIÉE';
      },
      error: (err) => console.error('Erreur mise à jour statut', err)
    });
  }
}
