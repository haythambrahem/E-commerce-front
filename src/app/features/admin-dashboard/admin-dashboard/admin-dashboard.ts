import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Chart, ChartDataset } from 'chart.js/auto';
import { DashboardService, DashboardStats } from '../../../core/services/dashboard.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css'],
})
export class AdminDashboard implements OnInit, AfterViewInit {

  // Statistiques dynamiques
  stats: DashboardStats = { products: 0, orders: 0, users: 0 };

  // Données du graphique
  salesData: number[] = [];

  // Chart.js instance pour pouvoir mettre à jour les données
  private salesChart: Chart | null = null;

  constructor(private router: Router, private dashboardService: DashboardService) {}

  ngOnInit(): void {
    // Charger les stats depuis le backend
    this.dashboardService.getStats().subscribe({
      next: (data) => {
        console.log('Stats récupérées:', data); // Vérifier dans console
        this.stats = data;

        // Générer des données dynamiques pour le graphique
        this.salesData = [
          data.orders * 2,
          data.orders * 3,
          data.orders * 5,
          data.orders * 4,
          data.orders * 6,
          data.orders * 7
        ];

        // Mettre à jour le graphique si déjà initialisé
        if (this.salesChart) {
          this.salesChart.data.datasets[0].data = this.salesData;
          this.salesChart.update();
        }
      },
      error: (err) => console.error('Erreur récupération stats', err)
    });
  }

  // Navigation au clic
  goToProducts() { this.router.navigate(['/admin/dashboard/products']); }
  goToOrders() { this.router.navigate(['/admin/dashboard/commands']); }
  goToUsers() { this.router.navigate(['/admin/dashboard/users']); }

  ngAfterViewInit(): void {
    this.initChart();
  }

  private initChart(): void {
    const ctx = document.getElementById('salesChart') as HTMLCanvasElement;
    if (!ctx) return;

    // Si le graphique existe déjà, on le détruit pour éviter duplication
    if (this.salesChart) {
      this.salesChart.destroy();
    }

    this.salesChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
        datasets: [{
          label: 'Ventes (DT)',
          data: this.salesData.length ? this.salesData : [0, 0, 0, 0, 0, 0],
          borderColor: '#e84393',
          backgroundColor: 'rgba(232,67,147,0.2)',
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true }
        },
        scales: {
          y: {
            beginAtZero: true // Toujours commencer à zéro
          }
        }
      }
    });
  }
}
