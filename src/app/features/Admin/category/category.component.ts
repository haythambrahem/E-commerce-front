import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from '../../../core/services/category.service';
import { Category } from '../../../core/interface/category';

@Component({
  selector: 'app-category',
  standalone: true,                  // essentiel pour Angular standalone
  imports: [CommonModule, FormsModule],
  templateUrl: './category.component.html',   // nom correct
  styleUrls: ['./category.component.css']     // nom correct
})
export class CategoryComponent implements OnInit {

  categories: Category[] = [];
  newCategoryName = '';
  newCategoryDescription = '';

  constructor(
    private categoryService: CategoryService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: (data) => this.categories = data,
      error: () => this.toastr.error('Erreur lors du chargement des catégories')
    });
  }

  addCategory() {
    if (!this.newCategoryName.trim()) {
      this.toastr.warning('Le nom de catégorie est requis');
      return;
    }

    const category: Category = {
      name: this.newCategoryName,
      description: this.newCategoryDescription
    };

    this.categoryService.createCategory(category).subscribe({
      next: () => {
        this.toastr.success('Catégorie ajoutée avec succès');
        this.newCategoryName = '';
        this.newCategoryDescription = '';
        this.loadCategories();
      },
      error: () => this.toastr.error('Erreur lors de l\'ajout de la catégorie')
    });
  }

  deleteCategory(id: number) {
    this.categoryService.deleteCategory(id).subscribe({
      next: () => {
        this.toastr.success('Catégorie supprimée avec succès');
        this.loadCategories();
      },
      error: () => this.toastr.error('Erreur lors de la suppression de la catégorie')
    });
  }
}
