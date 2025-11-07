export interface Role {
  id?: number;
  name: string;
}

export interface User {
  id?: number;
  email: string;
  password?: string;
  userName?: string;
  role?: string; 
  roles?: Role[]; // ✅ un utilisateur peut avoir plusieurs rôles
}
