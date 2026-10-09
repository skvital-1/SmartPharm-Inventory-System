
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts/AppContext';
import { 
  Package, 
  ShoppingCart, 
  AlertTriangle, 
  TrendingUp,
  Calendar,
  DollarSign
} from 'lucide-react';

export function Dashboard() {
  const { state } = useApp();
  const { medicines, sales } = state;

  // Calculate statistics
  const lowStockItems = medicines.filter(m => m.quantity < 10);
  const expiredItems = medicines.filter(m => new Date(m.expiryDate) < new Date());
  const nearExpiryItems = medicines.filter(m => {
    const expiryDate = new Date(m.expiryDate);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return expiryDate <= thirtyDaysFromNow && expiryDate >= new Date();
  });

  const todaysSales = sales.filter(s => {
    const saleDate = new Date(s.date);
    const today = new Date();
    return saleDate.toDateString() === today.toDateString();
  });

  const todaysRevenue = todaysSales.reduce((total, sale) => total + sale.totalPrice, 0);
  const totalInventoryValue = medicines.reduce((total, med) => total + (med.price * med.quantity), 0);

  const stats = [
    {
      title: 'Total Medicines',
      value: medicines.length,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: "Today's Sales",
      value: todaysSales.length,
      icon: ShoppingCart,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Low Stock Items',
      value: lowStockItems.length,
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: "Today's Revenue",
      value: `GH₵${todaysRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your pharmacy overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Alerts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              <span>Low Stock Alert</span>
            </CardTitle>
            <CardDescription>
              Items with less than 10 units in stock
            </CardDescription>
          </CardHeader>
          <CardContent>
            {lowStockItems.length === 0 ? (
              <p className="text-muted-foreground">No low stock items</p>
            ) : (
              <div className="space-y-2">
                {lowStockItems.slice(0, 5).map((medicine) => (
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
              <span>Expiry Alerts</span>
            </CardTitle>
            <CardDescription>
              Expired or expiring within 30 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            {[...expiredItems, ...nearExpiryItems].length === 0 ? (
              <p className="text-muted-foreground">No expiring items</p>
            ) : (
              <div className="space-y-2">
                {[...expiredItems, ...nearExpiryItems].slice(0, 5).map((medicine) => {
                  const isExpired = new Date(medicine.expiryDate) < new Date();
                  return (
                    <div key={medicine.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div>
                        <p className="font-medium">{medicine.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Expires: {new Date(medicine.expiryDate).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={isExpired ? "text-red-600 border-red-200" : "text-orange-600 border-orange-200"}
                      >
                        {isExpired ? 'Expired' : 'Expiring Soon'}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Sales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <span>Recent Sales</span>
          </CardTitle>
          <CardDescription>
            Today's transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {todaysSales.length === 0 ? (
            <p className="text-muted-foreground">No sales today</p>
          ) : (
            <div className="space-y-3">
              {todaysSales.slice(0, 5).map((sale) => (
                <div key={sale.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium">{sale.medicineName}</p>
                    <p className="text-sm text-muted-foreground">
                      Qty: {sale.quantity} × GH₵{sale.unitPrice.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">
                      GH₵{sale.totalPrice.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(sale.date).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
