
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApp } from '@/contexts/AppContext';
import { 
  ShoppingCart, 
  Plus, 
  DollarSign,
  Package,
  Calendar,
  TrendingUp
} from 'lucide-react';

export function SalesManagement() {
  const { state, makeSale } = useApp();
  const { medicines, sales } = state;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMedicineId, setSelectedMedicineId] = useState('');
  const [quantity, setQuantity] = useState('');

  const availableMedicines = medicines.filter(m => m.quantity > 0);

  const handleSale = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedMedicineId && quantity) {
      const success = makeSale(selectedMedicineId, parseInt(quantity));
      if (success) {
        setSelectedMedicineId('');
        setQuantity('');
        setIsDialogOpen(false);
      }
    }
  };

  const selectedMedicine = medicines.find(m => m.id === selectedMedicineId);
  const totalPrice = selectedMedicine ? selectedMedicine.price * parseInt(quantity || '0') : 0;

  // Sales statistics
  const todaysSales = sales.filter(s => {
    const saleDate = new Date(s.date);
    const today = new Date();
    return saleDate.toDateString() === today.toDateString();
  });

  const thisWeekSales = sales.filter(s => {
    const saleDate = new Date(s.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return saleDate >= weekAgo;
  });

  const todaysRevenue = todaysSales.reduce((sum, sale) => sum + sale.totalPrice, 0);
  const weeklyRevenue = thisWeekSales.reduce((sum, sale) => sum + sale.totalPrice, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Sales Management</h1>
          <p className="text-muted-foreground">Record sales and track transactions</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Sale
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Record New Sale</DialogTitle>
              <DialogDescription>
                Select a medicine and enter the quantity sold.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSale} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="medicine">Medicine *</Label>
                <Select value={selectedMedicineId} onValueChange={setSelectedMedicineId} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select medicine" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableMedicines.map((medicine) => (
                      <SelectItem key={medicine.id} value={medicine.id}>
                        {medicine.name} - GH₵{medicine.price.toFixed(2)} ({medicine.quantity} available)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity *</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  max={selectedMedicine?.quantity || 999}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Enter quantity"
                  required
                />
                {selectedMedicine && (
                  <p className="text-sm text-muted-foreground">
                    Available: {selectedMedicine.quantity} units
                  </p>
                )}
              </div>

              {selectedMedicine && quantity && (
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Amount:</span>
                    <span className="text-xl font-bold text-green-600">
                      GH₵{totalPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {quantity} × GH₵{selectedMedicine.price.toFixed(2)}
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={!selectedMedicineId || !quantity}>
                  Complete Sale
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Sales Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Today's Sales</p>
                <p className="text-2xl font-bold text-foreground">{todaysSales.length}</p>
              </div>
              <ShoppingCart className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Today's Revenue</p>
                <p className="text-2xl font-bold text-foreground">GH₵{todaysRevenue.toFixed(2)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Weekly Sales</p>
                <p className="text-2xl font-bold text-foreground">{thisWeekSales.length}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Weekly Revenue</p>
                <p className="text-2xl font-bold text-foreground">GH₵{weeklyRevenue.toFixed(2)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-emerald-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Sales */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Sales</CardTitle>
          <CardDescription>Latest transactions and sales history</CardDescription>
        </CardHeader>
        <CardContent>
          {sales.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No sales recorded</h3>
              <p className="text-muted-foreground">Start by recording your first sale!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sales
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 10)
                .map((sale) => (
                  <div key={sale.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Package className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">{sale.medicineName}</p>
                        <p className="text-sm text-muted-foreground">
                          Qty: {sale.quantity} × GH₵{sale.unitPrice.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">
                        GH₵{sale.totalPrice.toFixed(2)}
                      </p>
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(sale.date).toLocaleDateString()}</span>
                        <span>{new Date(sale.date).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      {availableMedicines.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No medicines available for sale</h3>
            <p className="text-muted-foreground">
              Add medicines to your inventory to start making sales.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
