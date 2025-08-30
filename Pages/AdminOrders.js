
import React, { useState, useEffect } from 'react';
import { Order } from '@/entities/Order';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Download, Eye, Package, Users, DollarSign, Clock, Shirt
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const ordersList = await Order.list('-created_date');
      setOrders(ordersList);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await Order.update(orderId, { status: newStatus });
      loadOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const exportToCSV = () => {
    const csvData = orders.map(order => ({
      'Order ID': order.id,
      'Date': format(new Date(order.created_date), 'yyyy-MM-dd'),
      'Customer Name': order.customer_name,
      'Customer Email': order.customer_email,
      'Items': order.items.map(item => `${item.name} (${item.quantity})`).join('; '),
      'Subtotal': order.subtotal,
      'Setup Fee': order.setup_fee,
      'Total': order.total_amount,
      'Status': order.status,
      'Notes': order.notes || ''
    }));

    const headers = Object.keys(csvData[0]);
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => headers.map(header => `"${row[header]}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'team-merch-orders.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === statusFilter);

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total_amount, 0);
  const pendingOrders = orders.filter(order => order.status === 'pending').length;

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Order Management</h1>
            <p className="text-slate-600 mt-2">View and manage team merch orders</p>
          </div>
          <Button
            onClick={exportToCSV}
            variant="outline"
            className="gap-2"
            disabled={orders.length === 0}
          >
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Total Orders</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{totalOrders}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Package className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Total Revenue</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">${totalRevenue.toFixed(2)}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Pending Orders</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{pendingOrders}</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Unique Customers</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">
                      {new Set(orders.map(o => o.customer_email)).size}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader className="border-b border-slate-200">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl font-bold text-slate-900">All Orders</CardTitle>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Orders</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50">
                      <TableHead className="font-semibold">Order Date</TableHead>
                      <TableHead className="font-semibold">Customer</TableHead>
                      <TableHead className="font-semibold">Items & Sizes</TableHead>
                      <TableHead className="font-semibold">Total</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow key={order.id} className="hover:bg-slate-50">
                        <TableCell>
                          {format(new Date(order.created_date), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-slate-900">{order.customer_name}</p>
                            <p className="text-sm text-slate-500">{order.customer_email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-2">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="text-sm">
                                <div>
                                  <span className="font-medium">{item.name}</span>
                                  <span className="text-slate-500"> × {item.quantity}</span>
                                </div>
                                {item.sizes && item.sizes.length > 0 && (
                                  <div className="flex items-center gap-1.5 text-xs text-slate-600">
                                    <Shirt className="w-3 h-3 flex-shrink-0" />
                                    <span className="truncate">{item.sizes.join(', ')}</span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-bold text-slate-900">${order.total_amount.toFixed(2)}</p>
                            <p className="text-xs text-slate-500">
                              (${order.subtotal.toFixed(2)} + ${order.setup_fee.toFixed(2)} fee)
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={order.status}
                            onValueChange={(value) => updateOrderStatus(order.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <Badge className={getStatusColor(order.status)} variant="outline">
                                {order.status}
                              </Badge>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="processing">Processing</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedOrder(order)}
                            className="gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedOrder(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">Order Details</h3>
                    <p className="text-slate-500">
                      {format(new Date(selectedOrder.created_date), 'MMMM d, yyyy at h:mm a')}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedOrder(null)}
                    className="text-slate-500 hover:text-slate-700"
                  >
                    ✕
                  </Button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Customer Information</h4>
                    <div className="bg-slate-50 rounded-lg p-4">
                      <p><span className="font-medium">Name:</span> {selectedOrder.customer_name}</p>
                      <p><span className="font-medium">Email:</span> {selectedOrder.customer_email}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Order Items</h4>
                    <div className="space-y-2">
                      {selectedOrder.items.map((item, idx) => (
                        <div key={idx} className="p-3 bg-slate-50 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-slate-900">{item.name}</p>
                              <p className="text-sm text-slate-500">
                                ${item.price.toFixed(2)} × {item.quantity}
                              </p>
                              {item.sizes && item.sizes.length > 0 && (
                                <p className="text-sm text-blue-600 font-medium mt-1">
                                  Sizes: {item.sizes.join(', ')}
                                </p>
                              )}
                            </div>
                            <p className="font-bold text-slate-900">${item.total.toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Order Total</h4>
                    <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>${selectedOrder.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Screen Setup Fee:</span>
                        <span>${selectedOrder.setup_fee.toFixed(2)}</span>
                      </div>
                      <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-lg">
                        <span>Total:</span>
                        <span>${selectedOrder.total_amount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {selectedOrder.notes && (
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2">Special Instructions</h4>
                      <div className="bg-slate-50 rounded-lg p-4">
                        <p className="text-slate-700">{selectedOrder.notes}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
