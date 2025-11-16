import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from '../../../core/services/product.service';
import { CategoryService } from '../../../core/services/category.service';
import { Product } from '../../../core/interface/product';
import { Category } from '../../../core/interface/category';
import { AddProductDialog } from '../../admin-dashboard/product-admin/add-product-dialog/add-product-dialog';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, AddProductDialog ],
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.css']
})
export class ProductComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];

  constructor(
    private dialog: MatDialog,
    private productService: ProductService,
    private categoryService: CategoryService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts() {
    this.productService.getAllProducts().subscribe({
      next: data => this.products = data,
      error: () => this.toastr.error('Erreur lors du chargement des produits')
    });
  }

  loadCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: data => this.categories = data,
      error: () => this.toastr.error('Erreur lors du chargement des catégories')
    });
  }

  // 👉 Ajout via dialog
  openAddDialog() {
  const dialogRef = this.dialog.open(AddProductDialog, {
    width: '600px'
  });

  dialogRef.afterClosed().subscribe((formData: FormData) => {
    if (!formData) return;

    this.productService.createProductWithImage(formData).subscribe({
      next: () => {
        this.toastr.success("Produit ajouté");
        this.loadProducts();
      },
      error: () => {
        this.toastr.error("Erreur lors de la création du produit");
      }
    });
  });
}


  deleteProduct(id: number) {
    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.toastr.success('Produit supprimé');
        this.loadProducts();
      },
      error: () => this.toastr.error('Erreur lors de la suppression')
    });
  }
  
}
