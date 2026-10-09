
export interface Medicine {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  expiryDate: string;
  supplierId?: string;
  description?: string;
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  email: string;
  address: string;
}

export interface Sale {
  id: string;
  medicineId: string;
  medicineName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  date: string;
}

export interface User {
  id: string;
  username: string;
  role: 'admin' | 'pharmacist';
}
