
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useApp } from '@/contexts/AppContext';
import { Supplier } from '@/types';
import { 
  Plus, 
  Users, 
  Phone, 
  Mail, 
  MapPin,
  Edit,
  Trash2,
  Package
} from 'lucide-react';

export function SupplierManagement() {
  const { state, addSupplier, updateSupplier, deleteSupplier } = useApp();
  const { suppliers, medicines } = state;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    email: '',
    address: '',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      contact: '',
      email: '',
      address: '',
    });
    setEditingSupplier(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingSupplier) {
      updateSupplier({ ...formData, id: editingSupplier.id });
    } else {
      addSupplier(formData);
    }

    resetForm();
    setIsDialogOpen(false);
  };

  const handleEdit = (supplier: Supplier) => {
    setFormData({
      name: supplier.name,
      contact: supplier.contact,
      email: supplier.email,
      address: supplier.address,
    });
    setEditingSupplier(supplier);
    setIsDialogOpen(true);
  };

  const getSupplierMedicineCount = (supplierId: string) => {
    return medicines.filter(m => m.supplierId === supplierId).length;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Supplier Management</h1>
          <p className="text-muted-foreground">Manage your medicine suppliers and contacts</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add Supplier
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}
              </DialogTitle>
              <DialogDescription>
                {editingSupplier ? 'Update the supplier details below.' : 'Enter the details for the new supplier.'}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Supplier Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., MedSupply Co."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact">Contact Number *</Label>
                <Input
                  id="contact"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  placeholder="e.g., +1-555-0123"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g., contact@supplier.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Enter supplier's address"
                  required
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingSupplier ? 'Update Supplier' : 'Add Supplier'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Supplier Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {suppliers.map((supplier) => {
          const medicineCount = getSupplierMedicineCount(supplier.id);
          
          return (
            <Card key={supplier.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{supplier.name}</CardTitle>
                    <CardDescription>
                      {medicineCount} medicine{medicineCount !== 1 ? 's' : ''} supplied
                    </CardDescription>
                  </div>
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{supplier.contact}</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{supplier.email}</span>
                </div>
                
                <div className="flex items-start space-x-3">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <span className="text-sm">{supplier.address}</span>
                </div>

                {medicineCount > 0 && (
                  <div className="flex items-center space-x-3 p-2 bg-blue-50 rounded-lg">
                    <Package className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-blue-700">
                      Supplying {medicineCount} medicine{medicineCount !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}

                <div className="flex space-x-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(supplier)}
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteSupplier(supplier.id)}
                    className="flex-1 text-destructive hover:text-destructive"
                    disabled={medicineCount > 0}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
                
                {medicineCount > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Cannot delete supplier with linked medicines
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {suppliers.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No suppliers found</h3>
            <p className="text-muted-foreground">
              Start by adding your first supplier to manage your medicine sources.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
