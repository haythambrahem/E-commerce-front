import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommandService } from '../../../core/services/CommandService';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-command-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './command-admin.html',
  styleUrls: ['./command-admin.css']
})
export class CommandAdmin implements OnInit {
  commands: any[] = [];

  constructor(private commandService: CommandService) {}

  ngOnInit() {
    this.loadCommands();
  }

  loadCommands() {
    this.commandService.getAllCommands().subscribe({
      next: (data) => {
        console.log('COMMANDES 👉', data);
        this.commands = data;
      },
      error: (err) => console.error(err)
    });
  }
}

