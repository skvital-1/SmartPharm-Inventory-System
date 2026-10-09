
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useApp } from '@/contexts/AppContext';
import { Medicine } from '@/types';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Package, 
  AlertTriangle,
  Calendar
} from 'lucide-react';

export function MedicineManagement() {
  const { state, addMedicine, updateMedicine, deleteMedicine } = useApp();
  const { medicines, suppliers } = state;
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    quantity: '',
    expiryDate: '',
    supplierId: '',
    description: '',
  });

  const categories = [...new Set(medicines.map(m => m.category))];
  const filteredMedicines = medicines.filter(medicine => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         medicine.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || medicine.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      price: '',
      quantity: '',
      expiryDate: '',
      supplierId: '',
      description: '',
    });
    setEditingMedicine(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const medicineData = {
      name: formData.name,
      category: formData.category,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity),
      expiryDate: formData.expiryDate,
      supplierId: formData.supplierId || undefined,
      description: formData.description || undefined,
    };

    if (editingMedicine) {
      updateMedicine({ ...medicineData, id: editingMedicine.id });
    } else {
      addMedicine(medicineData);
    }

    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleEdit = (medicine: Medicine) => {
    setFormData({
      name: medicine.name,
      category: medicine.category,
      price: medicine.price.toString(),
      quantity: medicine.quantity.toString(),
      expiryDate: medicine.expiryDate,
      supplierId: medicine.supplierId || '',
      description: medicine.description || '',
    });
    setEditingMedicine(medicine);
    setIsAddDialogOpen(true);
  };

  const getStockStatus = (medicine: Medicine) => {
    if (medicine.quantity === 0) return { text: 'Out of Stock', color: 'bg-red-100 text-red-800' };
    if (medicine.quantity < 10) return { text: 'Low Stock', color: 'bg-orange-100 text-orange-800' };
    return { text: 'In Stock', color: 'bg-green-100 text-green-800' };
  };

  const isExpired = (expiryDate: string) => new Date(expiryDate) < new Date();
  const isExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const thirtyDays = new Date();
    thirtyDays.setDate(thirtyDays.getDate() + 30);
    return expiry <= thirtyDays && expiry >= new Date();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Medicine Inventory</h1>
          <p className="text-muted-foreground">Manage your medicine stock and details</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add Medicine
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingMedicine ? 'Edit Medicine' : 'Add New Medicine'}
              </DialogTitle>
              <DialogDescription>
                {editingMedicine ? 'Update the medicine details below.' : 'Enter the details for the new medicine.'}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Medicine Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Paracetamol 500mg"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g., Analgesics"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (GH₵) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    placeholder="0"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date *</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supplier">Supplier</Label>
                  <Select 
                    value={formData.supplierId} 
                    onValueChange={(value) => setFormData({ ...formData, supplierId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select supplier (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers.map((supplier) => (
                        <SelectItem key={supplier.id} value={supplier.id}>
                          {supplier.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Optional description..."
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingMedicine ? 'Update Medicine' : 'Add Medicine'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search medicines..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Medicine Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMedicines.map((medicine) => {
          const stockStatus = getStockStatus(medicine);
          const supplier = suppliers.find(s => s.id === medicine.supplierId);
          
          return (
            <Card key={medicine.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{medicine.name}</CardTitle>
                    <CardDescription>{medicine.category}</CardDescription>
                  </div>
                  <Badge className={stockStatus.color}>
                    {stockStatus.text}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Price:</span>
                  <span className="font-semibold">GH₵{medicine.price.toFixed(2)}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Quantity:</span>
                  <div className="flex items-center space-x-2">
                    <Package className="w-4 h-4 text-muted-foreground" />
                    <span className="font-semibold">{medicine.quantity}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Expires:</span>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className={`text-sm ${
                      isExpired(medicine.expiryDate) ? 'text-red-600 font-semibold' :
                      isExpiringSoon(medicine.expiryDate) ? 'text-orange-600 font-semibold' :
                      'text-muted-foreground'
                    }`}>
                      {new Date(medicine.expiryDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {supplier && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Supplier:</span>
                    <span className="text-sm">{supplier.name}</span>
                  </div>
                )}

                {medicine.description && (
                  <p className="text-sm text-muted-foreground">{medicine.description}</p>
                )}

                {(medicine.quantity < 10 || isExpired(medicine.expiryDate) || isExpiringSoon(medicine.expiryDate)) && (
                  <div className="flex items-center space-x-2 p-2 bg-orange-50 rounded-lg">
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                    <span className="text-sm text-orange-700">
                      {medicine.quantity < 10 && 'Low stock'}
                      {medicine.quantity < 10 && (isExpired(medicine.expiryDate) || isExpiringSoon(medicine.expiryDate)) && ' • '}
                      {isExpired(medicine.expiryDate) && 'Expired'}
                      {isExpiringSoon(medicine.expiryDate) && !isExpired(medicine.expiryDate) && 'Expiring soon'}
                    </span>
                  </div>
                )}

                <div className="flex space-x-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(medicine)}
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteMedicine(medicine.id)}
                    className="flex-1 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredMedicines.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No medicines found</h3>
            <p className="text-muted-foreground">
              {searchTerm || categoryFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Start by adding your first medicine to the inventory.'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
