
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Medicine, Supplier, Sale, User } from '@/types';
import { toast } from '@/hooks/use-toast';

interface AppState {
  medicines: Medicine[];
  suppliers: Supplier[];
  sales: Sale[];
  user: User | null;
}

type AppAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'ADD_MEDICINE'; payload: Medicine }
  | { type: 'UPDATE_MEDICINE'; payload: Medicine }
  | { type: 'DELETE_MEDICINE'; payload: string }
  | { type: 'ADD_SUPPLIER'; payload: Supplier }
  | { type: 'UPDATE_SUPPLIER'; payload: Supplier }
  | { type: 'DELETE_SUPPLIER'; payload: string }
  | { type: 'ADD_SALE'; payload: Sale }
  | { type: 'INITIALIZE_DATA'; payload: Partial<AppState> };

const initialState: AppState = {
  medicines: [],
  suppliers: [],
  sales: [],
  user: null,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'ADD_MEDICINE':
      return { ...state, medicines: [...state.medicines, action.payload] };
    case 'UPDATE_MEDICINE':
      return {
        ...state,
        medicines: state.medicines.map(m => 
          m.id === action.payload.id ? action.payload : m
        ),
      };
    case 'DELETE_MEDICINE':
      return {
        ...state,
        medicines: state.medicines.filter(m => m.id !== action.payload),
      };
    case 'ADD_SUPPLIER':
      return { ...state, suppliers: [...state.suppliers, action.payload] };
    case 'UPDATE_SUPPLIER':
      return {
        ...state,
        suppliers: state.suppliers.map(s => 
          s.id === action.payload.id ? action.payload : s
        ),
      };
    case 'DELETE_SUPPLIER':
      return {
        ...state,
        suppliers: state.suppliers.filter(s => s.id !== action.payload),
      };
    case 'ADD_SALE':
      const sale = action.payload;
      const updatedMedicines = state.medicines.map(m => 
        m.id === sale.medicineId 
          ? { ...m, quantity: m.quantity - sale.quantity }
          : m
      );
      return {
        ...state,
        sales: [...state.sales, sale],
        medicines: updatedMedicines,
      };
    case 'INITIALIZE_DATA':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  addMedicine: (medicine: Omit<Medicine, 'id'>) => void;
  updateMedicine: (medicine: Medicine) => void;
  deleteMedicine: (id: string) => void;
  addSupplier: (supplier: Omit<Supplier, 'id'>) => void;
  updateSupplier: (supplier: Supplier) => void;
  deleteSupplier: (id: string) => void;
  makeSale: (medicineId: string, quantity: number) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const savedData = localStorage.getItem('pharmacyData');
    if (savedData) {
      dispatch({ type: 'INITIALIZE_DATA', payload: JSON.parse(savedData) });
    } else {
      // Initialize with sample data
      const sampleSuppliers: Supplier[] = [
        {
          id: '1',
          name: 'MedSupply Co.',
          contact: '+1-555-0101',
          email: 'contact@medsupply.com',
          address: '123 Medical St, Healthcare City',
        },
        {
          id: '2',
          name: 'Pharma Distributors',
          contact: '+1-555-0102',
          email: 'sales@pharmadist.com',
          address: '456 Supply Ave, Medicine Town',
        },
      ];

      const sampleMedicines: Medicine[] = [
        {
          id: '1',
          name: 'Paracetamol 500mg',
          category: 'Analgesics',
          price: 12.99,
          quantity: 3500,
          expiryDate: '2030-12-31',
          supplierId: '1',
          description: 'Pain relief and fever reducer',
        },
        {
          id: '2',
          name: 'Amoxicillin 250mg',
          category: 'Antibiotics',
          price: 24.50,
          quantity: 8000,
          expiryDate: '2030-06-15',
          supplierId: '1',
          description: 'Antibiotic for bacterial infections',
        },
        {
          id: '3',
          name: 'Vitamin C 1000mg',
          category: 'Vitamins',
          price: 18.75,
          quantity: 7500,
          expiryDate: '2030-12-20',
          supplierId: '2',
          description: 'Immune system support',
        },
      ];

      dispatch({
        type: 'INITIALIZE_DATA',
        payload: {
          suppliers: sampleSuppliers,
          medicines: sampleMedicines,
          sales: [],
        },
      });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('pharmacyData', JSON.stringify({
      medicines: state.medicines,
      suppliers: state.suppliers,
      sales: state.sales,
    }));
  }, [state.medicines, state.suppliers, state.sales]);

  const login = (username: string, password: string) => {
    // Simple authentication for MVP
    if (username === 'admin' && password === 'admin') {
      const user: User = { id: '1', username: 'admin', role: 'admin' };
      dispatch({ type: 'SET_USER', payload: user });
      toast({ title: 'Login successful', description: 'Welcome to SmartPharm!' });
      return true;
    }
    toast({ title: 'Login failed', description: 'Invalid credentials', variant: 'destructive' });
    return false;
  };

  const logout = () => {
    dispatch({ type: 'SET_USER', payload: null });
    toast({ title: 'Logged out', description: 'See you next time!' });
  };

  const addMedicine = (medicine: Omit<Medicine, 'id'>) => {
    const newMedicine: Medicine = {
      ...medicine,
      id: Date.now().toString(),
    };
    dispatch({ type: 'ADD_MEDICINE', payload: newMedicine });
    toast({ title: 'Medicine added', description: `${medicine.name} has been added to inventory` });
  };

  const updateMedicine = (medicine: Medicine) => {
    dispatch({ type: 'UPDATE_MEDICINE', payload: medicine });
    toast({ title: 'Medicine updated', description: `${medicine.name} has been updated` });
  };

  const deleteMedicine = (id: string) => {
    const medicine = state.medicines.find(m => m.id === id);
    dispatch({ type: 'DELETE_MEDICINE', payload: id });
    toast({ title: 'Medicine deleted', description: `${medicine?.name} has been removed` });
  };

  const addSupplier = (supplier: Omit<Supplier, 'id'>) => {
    const newSupplier: Supplier = {
      ...supplier,
      id: Date.now().toString(),
    };
    dispatch({ type: 'ADD_SUPPLIER', payload: newSupplier });
    toast({ title: 'Supplier added', description: `${supplier.name} has been added` });
  };

  const updateSupplier = (supplier: Supplier) => {
    dispatch({ type: 'UPDATE_SUPPLIER', payload: supplier });
    toast({ title: 'Supplier updated', description: `${supplier.name} has been updated` });
  };

  const deleteSupplier = (id: string) => {
    const supplier = state.suppliers.find(s => s.id === id);
    dispatch({ type: 'DELETE_SUPPLIER', payload: id });
    toast({ title: 'Supplier deleted', description: `${supplier?.name} has been removed` });
  };

  const makeSale = (medicineId: string, quantity: number) => {
    const medicine = state.medicines.find(m => m.id === medicineId);
    if (!medicine) {
      toast({ title: 'Error', description: 'Medicine not found', variant: 'destructive' });
      return false;
    }
    
    if (medicine.quantity < quantity) {
      toast({ title: 'Insufficient stock', description: `Only ${medicine.quantity} units available`, variant: 'destructive' });
      return false;
    }

    const sale: Sale = {
      id: Date.now().toString(),
      medicineId,
      medicineName: medicine.name,
      quantity,
      unitPrice: medicine.price,
      totalPrice: medicine.price * quantity,
      date: new Date().toISOString(),
    };

    dispatch({ type: 'ADD_SALE', payload: sale });
    toast({ title: 'Sale completed', description: `Sold ${quantity} units of ${medicine.name}` });
    return true;
  };

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        login,
        logout,
        addMedicine,
        updateMedicine,
        deleteMedicine,
        addSupplier,
        updateSupplier,
        deleteSupplier,
        makeSale,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
