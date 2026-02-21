import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useStore from '../../store/store';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  ArrowLeft,
  Loader2,
  XCircle,
  PackageCheck,
  AlertCircle
} from 'lucide-react';

const STATUS_FLOW = [
  'Processing',
  'Confirmed',
  'Preparing',
  'Shipped',
  'Out for Delivery',
  'Delivered'
];

const TrackOrder = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { currency, trackOrder } = useStore();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      try {
        setLoading(true);
        const data = await trackOrder(orderId);
        setOrder(data);
      } catch (err) {
        setError(err?.response?.data?.message || 'Order not found');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const statusIndex = STATUS_FLOW.includes(order?.status)
    ? STATUS_FLOW.indexOf(order.status)
    : 0;

  const statusIcon = (status, active) => {
    const cls = active ? 'text-white' : 'text-gray-400';
    switch (status) {
      case 'Delivered':
        return <CheckCircle2 className={cls} />;
      case 'Out for Delivery':
        return <Truck className={cls} />;
      case 'Shipped':
        return <PackageCheck className={cls} />;
      case 'Processing':
      case 'Confirmed':
      case 'Preparing':
        return <Package className={cls} />;
      default:
        return <AlertCircle className={cls} />;
    }
  };

  /* ================== LOADING ================== */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50">
        <Loader2 className="animate-spin text-pink-600" size={48} />
      </div>
    );
  }

  /* ================== ERROR ================== */
  if (error || !order) {
    return (
      <div className="min-h-screen bg-pink-50 pt-32 px-6">
        <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-xl p-10 text-center">
          <XCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Order Not Found</h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => navigate('/orders')}
            className="mt-6 px-6 py-3 rounded-full bg-pink-600 text-white"
          >
            View My Orders
          </button>
        </div>
      </div>
    );
  }

  /* ================== CANCELLED ================== */
  if (['Cancelled', 'Returned'].includes(order.status)) {
    return (
      <div className="min-h-screen bg-pink-50 pt-28 px-6">
        <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-pink-700 mb-6"
          >
            <ArrowLeft size={18} /> Back
          </button>

          <div className="flex items-start gap-4 bg-red-50 p-6 rounded-xl border border-red-200">
            <XCircle className="text-red-600" />
            <div>
              <h3 className="font-semibold text-red-800">
                Order {order.status}
              </h3>
              <p className="text-sm text-red-600">
                {order.cancelReason || 'This order is no longer active.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ================== MAIN ================== */
  return (
    <section className="min-h-screen bg-pink-50 pt-24 pb-24 px-6">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* HEADER */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-pink-700 mb-3"
              >
                <ArrowLeft size={18} /> Back
              </button>
              <h1 className="text-2xl font-serif text-pink-900">
                Order #{order.orderId}
              </h1>
              <p className="text-sm text-gray-500">
                Placed on{' '}
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-2xl font-semibold text-pink-700">
                {currency}{order.total}
              </p>
            </div>
          </div>
        </div>

        {/* STATUS TIMELINE */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h2 className="text-lg font-semibold text-pink-900 mb-6">
            Order Progress
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            {STATUS_FLOW.map((status, index) => {
              const active = index <= statusIndex;
              return (
                <div key={status} className="flex flex-col items-center text-center">
                  <div
                    className={`w-12 h-12 flex items-center justify-center rounded-full ${
                      active ? 'bg-pink-600' : 'bg-gray-200'
                    }`}
                  >
                    {statusIcon(status, active)}
                  </div>
                  <p
                    className={`mt-2 text-sm font-medium ${
                      active ? 'text-pink-800' : 'text-gray-400'
                    }`}
                  >
                    {status}
                  </p>
                </div>
              );
            })}
          </div>

          {order.estimatedDelivery && (
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm">
              <strong>Estimated Delivery:</strong>{' '}
              {new Date(order.estimatedDelivery).toLocaleDateString()}
            </div>
          )}
        </div>

        {/* SHIPPING */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <MapPin className="text-pink-600" /> Shipping Address
          </h2>
          <p>{order.shippingAddress.street}</p>
          <p>
            {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
            {order.shippingAddress.zip}
          </p>
          <p>{order.shippingAddress.country}</p>
        </div>

        {/* ITEMS */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h2 className="text-lg font-semibold mb-6">Items</h2>

          {order.items.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-6 py-4 border-b last:border-0"
            >
              <img
                  src={Array.isArray(item.image) ? item.image[0] : item.image}
                  className="w-20 h-24 rounded-xl object-cover"
                  alt={item.name}
                />
              <div className="flex-1">
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">
                  Size {item.size} • Qty {item.quantity}
                </p>
              </div>
              <p className="font-semibold text-pink-700">
                {currency}{item.price * item.quantity}
              </p>
            </div>
          ))}

          {/* SUMMARY */}
          <div className="mt-6 pt-6 border-t space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{currency}{order.subtotal ?? order.total}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-{currency}{order.discount}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold text-lg pt-4">
              <span>Total</span>
              <span>{currency}{order.total}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrackOrder;
