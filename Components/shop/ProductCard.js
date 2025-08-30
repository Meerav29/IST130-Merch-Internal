import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { motion } from "framer-motion";

export default function ProductCard({ product, quantity, onQuantityChange }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
        <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
          <div className="text-6xl text-slate-400">
            {product.name === 'Stickers' ? '📧' : 
             product.name === 'T-shirts' ? '👕' : 
             product.name === 'Polo Shirt' ? '👔' :
             product.name === 'Hoodies' ? '👟' : '🧥'}
          </div>
        </div>
        
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900">{product.name}</h3>
              <p className="text-2xl font-bold text-blue-600 mt-2">
                {product.price === 0 ? 'FREE' : `$${product.price.toFixed(2)}`}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onQuantityChange(product.name, Math.max(0, quantity - 1))}
                  disabled={quantity === 0}
                  className="h-10 w-10 rounded-full"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                
                <span className="text-lg font-semibold w-8 text-center text-slate-900">
                  {quantity}
                </span>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onQuantityChange(product.name, quantity + 1)}
                  className="h-10 w-10 rounded-full hover:bg-blue-50 hover:border-blue-300"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              {quantity > 0 && (
                <div className="text-right">
                  <p className="text-sm text-slate-500">Subtotal</p>
                  <p className="font-bold text-slate-900">
                    ${(product.price * quantity).toFixed(2)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}