
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const CLOTHING_ITEMS = ['Hoodies', 'Quarter Zips', 'T-shirts', 'Polo Shirt'];
const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

export default function CheckoutForm({ cart, subtotal, setupFee, total, onOrderComplete }) {
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    notes: ''
  });
  const [itemSizes, setItemSizes] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Use a functional update to correctly manage dependencies and avoid potential loops.
    setItemSizes(prevItemSizes => {
      const newSizes = {}; // Start with an empty object
      Object.entries(cart).forEach(([name, quantity]) => {
        if (CLOTHING_ITEMS.includes(name) && quantity > 0) {
          const existingSizes = prevItemSizes[name] || [];
          // Create a new array for the current quantity, preserving any sizes already selected.
          newSizes[name] = Array(quantity).fill('').map((_, i) => existingSizes[i] || '');
        }
        // Items not in CLOTHING_ITEMS or with quantity 0 will not be added to newSizes,
        // implicitly removing them if they were in prevItemSizes.
      });
      return newSizes;
    });
  }, [cart]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSizeChange = (itemName, index, value) => {
    setItemSizes(prev => {
      const newSizes = [...(prev[itemName] || [])];
      newSizes[index] = value;
      return { ...prev, [itemName]: newSizes };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const orderData = {
        ...formData,
        items: Object.entries(cart)
          .filter(([_, quantity]) => quantity > 0)
          .map(([name, quantity]) => ({
            name,
            price: getItemPrice(name),
            quantity,
            sizes: itemSizes[name] || [],
            total: getItemPrice(name) * quantity
          })),
        subtotal,
        setup_fee: setupFee,
        total_amount: total,
        status: 'pending'
      };
      
      await onOrderComplete(orderData);
    } catch (error) {
      console.error('Error submitting order:', error);
      setIsSubmitting(false); // Reset submitting state on error
    } finally {
      // Ensure submitting state is reset after async operation, unless it was already reset in catch
      // This helps if onOrderComplete doesn't throw but has other issues, or if successful.
      if (isSubmitting) { // Only reset if still submitting
        setIsSubmitting(false);
      }
    }
  };

  const cartItems = Object.entries(cart).filter(([_, quantity]) => quantity > 0);
  if (cartItems.length === 0) return null;

  const areAllSizesSelected = () => {
    return Object.entries(itemSizes).every(([name, sizes]) => {
      // Check if the item is in the cart and is a clothing item
      if (CLOTHING_ITEMS.includes(name) && cart[name] > 0) {
        // Ensure the number of sizes matches the quantity and all selected sizes are non-empty
        return cart[name] === sizes.length && sizes.every(size => size !== '');
      }
      // For non-clothing items or items not in cart, no size selection is required
      return true;
    });
  };
  
  const isFormValid = formData.customer_name && formData.customer_email && areAllSizesSelected();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="shadow-xl border-0">
        <CardHeader>
          <CardTitle className="text-xl text-slate-900">Complete Your Order</CardTitle>
          <CardDescription>Enter your details and specify sizes for each clothing item.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4 rounded-lg border border-slate-200 p-4">
              <h3 className="font-semibold text-slate-800">Your Items</h3>
              {cartItems.map(([name, quantity]) => (
                <div key={name} className="space-y-2">
                  <p className="font-medium mb-2">{name} (x{quantity})</p>
                  {CLOTHING_ITEMS.includes(name) && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pl-2 border-l-2 border-slate-200 ml-2">
                      {(itemSizes[name] || []).map((size, index) => (
                        <div key={index} className="space-y-1">
                          <Label htmlFor={`${name}-${index}`} className="text-xs text-slate-500">Size #{index + 1}</Label>
                          <Select
                            value={size}
                            onValueChange={(value) => handleSizeChange(name, index, value)}
                            required
                          >
                            <SelectTrigger id={`${name}-${index}`}>
                              <SelectValue placeholder="Select size" />
                            </SelectTrigger>
                            <SelectContent>
                              {SIZES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name *</Label>
                <Input
                  id="name"
                  value={formData.customer_name}
                  onChange={(e) => handleInputChange('customer_name', e.target.value)}
                  placeholder="Enter your full name"
                  required
                  className="border-slate-300 focus:border-blue-500"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.customer_email}
                  onChange={(e) => handleInputChange('customer_email', e.target.value)}
                  placeholder="your.email@company.com"
                  required
                  className="border-slate-300 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Special Instructions (Optional)</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Any special requests or instructions..."
                className="border-slate-300 focus:border-blue-500 h-24"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || !isFormValid}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg font-semibold rounded-xl"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Placing Order...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Place Order - ${total.toFixed(2)}
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function getItemPrice(itemName) {
  const prices = {
    'Hoodies': 35.23,
    'Quarter Zips': 31.37,
    'T-shirts': 8.44,
    'Polo Shirt': 17.23,
    'Stickers': 0
  };
  return prices[itemName] || 0;
}
