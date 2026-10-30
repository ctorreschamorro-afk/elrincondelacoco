"use client";

import React, { useState } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { motion } from 'framer-motion';

export default function CheckoutPage() {
  const { items, getTotal, clearCart } = useCartStore();
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
  const [paymentMethod, setPaymentMethod] = useState<'webpay' | 'transfer' | 'pickup_pay'>('webpay');
  const [commune, setCommune] = useState('Curicó');
  const [address, setAddress] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryTimeSlot, setDeliveryTimeSlot] = useState('10:00 - 13:00');
  const [comments, setComments] = useState('');

  const isCuricoValid = commune.toLowerCase().trim() === 'curicó' || commune.toLowerCase().trim() === 'curico';

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (deliveryType === 'delivery' && !isCuricoValid) {
      alert('Actualmente sólo realizamos repartos dentro de la comuna de Curicó.');
      return;
    }

    if (paymentMethod === 'webpay') {
      const res = await fetch('/store/webpay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: getTotal(),
          buyOrder: `ORD-${Date.now()}`,
          sessionId: `SESS-${Math.floor(Math.random() * 1000000)}`,
          returnUrl: `${window.location.origin}/checkout/confirm`,
        }),
      });

      const data = await res.json();
      if (data.url && data.token) {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = data.url;
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'token_ws';
        input.value = data.token;
        form.appendChild(input);
        document.body.appendChild(form);
        form.submit();
      }
    } else {
      alert('Pedido registrado con éxito. Nos pondremos en contacto para la entrega.');
      clearCart();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8 dark:bg-slate-900 dark:text-white">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
        <h1 className="text-2xl font-bold mb-6">Checkout Expres (Paso Único)</h1>
        <form onSubmit={handleCheckout} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tipo de Entrega</label>
            <div className="flex gap-4">
              <button
                type="button"
                className={`flex-1 p-3 rounded border text-center font-semibold ${deliveryType === 'delivery' ? 'bg-green-600 text-white border-green-600' : 'bg-gray-100 dark:bg-slate-800'}`}
                onClick={() => setDeliveryType('delivery')}
              >
                Despacho a Domicilio
              </button>
              <button
                type="button"
                className={`flex-1 p-3 rounded border text-center font-semibold ${deliveryType === 'pickup' ? 'bg-green-600 text-white border-green-600' : 'bg-gray-100 dark:bg-slate-800'}`}
                onClick={() => setDeliveryType('pickup')}
              >
                Retiro en Tienda
              </button>
            </div>
          </div>

          {deliveryType === 'delivery' && (
            <>
              <div>
                <label className="block text-sm font-medium">Comuna</label>
                <input
                  type="text"
                  value={commune}
                  onChange={(e) => setCommune(e.target.value)}
                  className="w-full p-2 border rounded dark:bg-slate-800 border-gray-300 dark:border-slate-700"
                  required
                />
                {!isCuricoValid && (
                  <p className="text-red-500 text-xs mt-1">⚠️ Cobertura exclusiva en la comuna de Curicó.</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium">Dirección de Entrega</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Calle, número, depto o villa"
                  className="w-full p-2 border rounded dark:bg-slate-800 border-gray-300 dark:border-slate-700"
                  required
                />
              </div>
            </>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Fecha de Entrega</label>
              <input
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="w-full p-2 border rounded dark:bg-slate-800 border-gray-300 dark:border-slate-700"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Bloque Horario</label>
              <select
                value={deliveryTimeSlot}
                onChange={(e) => setDeliveryTimeSlot(e.target.value)}
                className="w-full p-2 border rounded dark:bg-slate-800 border-gray-300 dark:border-slate-700"
              >
                <option value="10:00 - 13:00">10:00 - 13:00</option>
                <option value="15:00 - 18:00">15:00 - 18:00</option>
                <option value="18:00 - 21:00">18:00 - 21:00</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Comentarios / Instrucciones</label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Ej: Timbre malo, dejar con conserje"
              className="w-full p-2 border rounded dark:bg-slate-800 border-gray-300 dark:border-slate-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Método de Pago</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as any)}
              className="w-full p-2 border rounded dark:bg-slate-800 border-gray-300 dark:border-slate-700"
            >
              <option value="webpay">Webpay Plus (Débito/Crédito Transbank)</option>
              <option value="transfer">Transferencia Bancaria Directa</option>
              <option value="pickup_pay">Pago contra entrega / Retiro</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={deliveryType === 'delivery' && !isCuricoValid}
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded shadow-lg transition-colors disabled:bg-gray-400"
          >
            Confirmar y Pagar ${getTotal().toLocaleString('es-CL')}
          </button>
        </form>
      </motion.div>

      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-gray-50 dark:bg-slate-800 p-6 rounded-lg h-fit">
        <h2 className="text-xl font-bold mb-4 border-b pb-2">Resumen del Pedido</h2>
        <div className="space-y-3 max-h-80 overflow-y-auto mb-4">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between items-center text-sm border-b pb-2 dark:border-slate-700">
              <div>
                <p className="font-semibold">{item.title}</p>
                <p className="text-gray-500 text-xs">
                  {item.quantity} x ${item.price.toLocaleString('es-CL')} ({item.unitType})
                </p>
              </div>
              <p className="font-bold">${(item.quantity * item.price).toLocaleString('es-CL')}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-between text-lg font-bold pt-2 border-t dark:border-slate-700">
          <span>Total</span>
          <span>${getTotal().toLocaleString('es-CL')} CLP</span>
        </div>
      </motion.div>
    </div>
  );
}