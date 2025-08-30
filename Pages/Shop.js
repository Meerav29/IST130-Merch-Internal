import React, { useState } from 'react';
import { Order } from '@/entities/Order';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/shop/ProductCard';
import CartSummary from '../components/shop/CartSummary';
import CheckoutForm from '../components/shop/CheckoutForm';

const PRODUCTS = [
  { name: 'Hoodies', price: 35.23 },
  { name: 'Quarter Zips', price: 31.37 },
  { name: 'T-shirts', price: 8.44 },
  { name: 'Polo Shirt', price: 17.23 },
  { name: 'Stickers', price: 0 }
];

export default function Shop() {
  const [cart, setCart] = useState({
    'Hoodies': 0,
    'Quarter Zips': 0,
    'T-shirts': 0,
    'Polo Shirt': 0,
    'Stickers': 0
  });
  
  const [orderComplete, setOrderComplete] = useState(false);

  const handleQuantityChange = (productName, quantity) => {
    setCart(prev => ({
      ...prev,
      [productName]: quantity
    }));
  };

  const subtotal = Object.entries(cart).reduce((total, [name, quantity]) => {
    const product = PRODUCTS.find(p => p.name === name);
    return total + (product?.price || 0) * quantity;
  }, 0);

  const setupFee = subtotal > 0 ? 1.25 : 0;
  const total = subtotal + setupFee;

  const handleOrderComplete = async (orderData) => {
    await Order.create(orderData);
    setOrderComplete(true);
    setCart({
      'Hoodies': 0,
      'Quarter Zips': 0,
      'T-shirts': 0,
      'Polo Shirt': 0,
      'Stickers': 0
    });
  };

  const resetOrder = () => {
    setOrderComplete(false);
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto text-center"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              🎉
            </motion.div>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Order Placed Successfully!</h1>
          <p className="text-slate-600 mb-8">
            Your merch order has been submitted. The admin team will process it soon.
          </p>
          <button
            onClick={resetOrder}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
          >
            Place Another Order
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Team Merch Store</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Order your team merch items below. A $1.25 screen setup fee will be added to each order.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {PRODUCTS.map((product, index) => (
                <motion.div
                  key={product.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ProductCard
                    product={product}
                    quantity={cart[product.name]}
                    onQuantityChange={handleQuantityChange}
                  />
                </motion.div>
              ))}
            </div>

            <AnimatePresence>
              {Object.values(cart).some(qty => qty > 0) && (
                <CheckoutForm
                  cart={cart}
                  subtotal={subtotal}
                  setupFee={setupFee}
                  total={total}
                  onOrderComplete={handleOrderComplete}
                />
              )}
            </AnimatePresence>
          </div>

          <div className="lg:col-span-1">
            <CartSummary
              cart={cart}
              subtotal={subtotal}
              setupFee={setupFee}
              total={total}
            />
          </div>
        </div>
      </div>
    </div>
  );
}