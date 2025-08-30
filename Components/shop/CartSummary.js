import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";

export default function CartSummary({ cart, subtotal, setupFee, total }) {
  const cartItems = Object.entries(cart).filter(([_, quantity]) => quantity > 0);
  
  if (cartItems.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="sticky top-8 shadow-xl border-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl text-slate-900">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {cartItems.map(([itemName, quantity]) => (
                <div key={itemName} className="flex justify-between text-sm">
                  <span className="text-slate-600">
                    {itemName} × {quantity}
                  </span>
                  <span className="font-medium text-slate-900">
                    ${(quantity * getItemPrice(itemName)).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Subtotal</span>
                <span className="font-medium text-slate-900">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Screen Setup Fee</span>
                <span className="font-medium text-slate-900">${setupFee.toFixed(2)}</span>
              </div>
            </div>
            
            <Separator />
            
            <div className="flex justify-between text-lg font-bold">
              <span className="text-slate-900">Total</span>
              <span className="text-blue-600">${total.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
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