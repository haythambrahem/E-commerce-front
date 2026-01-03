import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddProductDialog } from './add-product-dialog/add-product-dialog';
import { ProductService } from '../../../core/services/product.service';

@Component({
  selector: 'app-product-admin',
  standalone: true,
  imports: [CommonModule, MatDialogModule, AddProductDialog],
  templateUrl: './product-admin.html',
  styleUrls: ['./product-admin.css'],
})
export class ProductAdmin implements OnInit {
  products: any[] = [];
  backendUrl = 'http://localhost:8082';


  constructor(
    private dialog: MatDialog,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: data => {
        this.products = data.map(p => ({
          ...p,
          imageUrl: this.backendUrl + p.imageUrl
        }));
      },
      error: err => console.error(err)
    });
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(AddProductDialog, {
      width: '600px',
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe((formData: FormData) => {
      if (formData) {
        this.productService.createProductWithImage(formData).subscribe({
          next: (newProduct: any) => {
            console.log('Produit enregistré en DB : ', newProduct);

            // Ajouter directement au tableau pour mise à jour instantanée
            this.products.push(newProduct);
          },
          error: (err) => console.error('Erreur lors de la création :', err)
        });
      }
    });
  }
}
