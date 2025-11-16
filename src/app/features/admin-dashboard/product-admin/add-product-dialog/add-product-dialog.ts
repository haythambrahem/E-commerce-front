import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-add-product-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './add-product-dialog.html',
  styleUrls: ['./add-product-dialog.css']
})
export class AddProductDialog {
  productForm: FormGroup;
  selectedFile: File | null = null;
  previewUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddProductDialog>
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      image: [null, Validators.required]
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];

    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.previewUrl = e.target.result;
      reader.readAsDataURL(this.selectedFile);

      this.productForm.patchValue({ image: this.selectedFile });
      this.productForm.get('image')?.updateValueAndValidity();
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.productForm.valid) {
      const formData = new FormData();

      const productData = {
        name: this.productForm.value.name,
        description: this.productForm.value.description,
        price: this.productForm.value.price,
        stock: this.productForm.value.stock,
        category: this.productForm.value.category
      };

      formData.append('product', new Blob([JSON.stringify(productData)], { type: 'application/json' }));

      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      }

      // On renvoie le FormData au parent
      this.dialogRef.close(formData);
    }
  }
}
