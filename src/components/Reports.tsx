
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts/AppContext';
import { 
  AlertTriangle, 
  Calendar, 
  TrendingDown,
  Package,
  DollarSign,
  ShoppingCart,
  Users,
  FileBarChart
} from 'lucide-react';

export function Reports() {
  const { state } = useApp();
  const { medicines, sales, suppliers } = state;

  // Low stock medicines (quantity < 10)
  const lowStockMedicines = medicines.filter(m => m.quantity < 10);
  
  // Expired medicines
  const expiredMedicines = medicines.filter(m => new Date(m.expiryDate) < new Date());
  
  // Near expiry medicines (expiring within 30 days)
  const nearExpiryMedicines = medicines.filter(m => {
    const expiryDate = new Date(m.expiryDate);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return expiryDate <= thirtyDaysFromNow && expiryDate >= new Date();
  });

  // Sales analytics
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const monthAgo = new Date(today);
  monthAgo.setMonth(monthAgo.getMonth() - 1);

  const todaysSales = sales.filter(s => new Date(s.date).toDateString() === today.toDateString());
  const yesterdaysSales = sales.filter(s => new Date(s.date).toDateString() === yesterday.toDateString());
  const weeklySales = sales.filter(s => new Date(s.date) >= weekAgo);
  const monthlySales = sales.filter(s => new Date(s.date) >= monthAgo);

  const todaysRevenue = todaysSales.reduce((sum, sale) => sum + sale.totalPrice, 0);
  const yesterdaysRevenue = yesterdaysSales.reduce((sum, sale) => sum + sale.totalPrice, 0);
  const weeklyRevenue = weeklySales.reduce((sum, sale) => sum + sale.totalPrice, 0);
  const monthlyRevenue = monthlySales.reduce((sum, sale) => sum + sale.totalPrice, 0);

  // Most sold medicines
  const medicinesSoldCount = sales.reduce((acc, sale) => {
    acc[sale.medicineId] = (acc[sale.medicineId] || 0) + sale.quantity;
    return acc;
  }, {} as Record<string, number>);

  const topSellingMedicines = Object.entries(medicinesSoldCount)
    .map(([medicineId, quantity]) => {
      const medicine = medicines.find(m => m.id === medicineId);
      return { medicine, quantity };
    })
    .filter(item => item.medicine)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  // Total inventory value
  const totalInventoryValue = medicines.reduce((sum, med) => sum + (med.price * med.quantity), 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
        <p className="text-muted-foreground">Comprehensive overview of your pharmacy performance</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Medicines</p>
                <p className="text-2xl font-bold">{medicines.length}</p>
              </div>
              <Package className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Suppliers</p>
                <p className="text-2xl font-bold">{suppliers.length}</p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Inventory Value</p>
                <p className="text-2xl font-bold">GH₵{totalInventoryValue.toFixed(2)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Sales</p>
                <p className="text-2xl font-bold">{sales.length}</p>
              </div>
              <ShoppingCart className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sales Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingDown className="w-5 h-5 text-green-500" />
              <span>Sales Performance</span>
            </CardTitle>
            <CardDescription>Revenue breakdown by time period</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <div>
                <p className="font-medium">Today</p>
                <p className="text-sm text-muted-foreground">{todaysSales.length} sales</p>
              </div>
              <p className="text-lg font-bold text-green-600">GH₵{todaysRevenue.toFixed(2)}</p>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <div>
                <p className="font-medium">This Week</p>
                <p className="text-sm text-muted-foreground">{weeklySales.length} sales</p>
              </div>
              <p className="text-lg font-bold text-blue-600">GH₵{weeklyRevenue.toFixed(2)}</p>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <div>
                <p className="font-medium">This Month</p>
                <p className="text-sm text-muted-foreground">{monthlySales.length} sales</p>
              </div>
              <p className="text-lg font-bold text-purple-600">GH₵{monthlyRevenue.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileBarChart className="w-5 h-5 text-blue-500" />
              <span>Top Selling Medicines</span>
            </CardTitle>
            <CardDescription>Most popular medicines by quantity sold</CardDescription>
          </CardHeader>
          <CardContent>
            {topSellingMedicines.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No sales data available</p>
            ) : (
              <div className="space-y-3">
                {topSellingMedicines.map((item, index) => (
                  <div key={item.medicine!.id} className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{item.medicine!.name}</p>
                        <p className="text-sm text-muted-foreground">{item.medicine!.category}</p>
                      </div>
                    </div>
                    <Badge variant="secondary">{item.quantity} sold</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Alert Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              <span>Low Stock Report</span>
            </CardTitle>
            <CardDescription>
              Medicines with less than 10 units in stock
            </CardDescription>
          </CardHeader>
          <CardContent>
            {lowStockMedicines.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No low stock items</p>
            ) : (
              <div className="space-y-3">
                {lowStockMedicines.map((medicine) => (
                  <div key={medicine.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div>
                      <p className="font-medium">{medicine.name}</p>
                      <p className="text-sm text-muted-foreground">{medicine.category}</p>
                    </div>
                    <Badge variant="outline" className="text-orange-600 border-orange-200">
                      {medicine.quantity} left
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-red-500" />
              <span>Expiry Report</span>
            </CardTitle>
            <CardDescription>
              Expired medicines and items expiring within 30 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            {[...expiredMedicines, ...nearExpiryMedicines].length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No expiring items</p>
            ) : (
              <div className="space-y-3">
                {expiredMedicines.map((medicine) => (
                  <div key={medicine.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div>
                      <p className="font-medium">{medicine.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Expired: {new Date(medicine.expiryDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-red-600 border-red-200">
                      Expired
                    </Badge>
                  </div>
                ))}
                {nearExpiryMedicines.map((medicine) => (
                  <div key={medicine.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div>
                      <p className="font-medium">{medicine.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Expires: {new Date(medicine.expiryDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-yellow-600 border-yellow-200">
                      Expiring Soon
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
