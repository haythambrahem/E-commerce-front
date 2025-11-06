
import { Category } from "./category";

export interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: Category;
  imageUrl?: string; // ✅ facultatif, pour l'affichage d'image
}
