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

const TrackOrder = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { currency, trackOrder } = useStore();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTracking = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await trackOrder(orderId);
        setOrder(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Order not found');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchTracking();
    }
  }, [orderId, trackOrder]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered':
        return <CheckCircle2 className="text-green-600" size={24} />;
      case 'Out for Delivery':
        return <Truck className="text-blue-600" size={24} />;
      case 'Shipped':
        return <PackageCheck className="text-blue-500" size={24} />;
      case 'Preparing':
      case 'Confirmed':
        return <Package className="text-purple-600" size={24} />;
      case 'Processing':
        return <Clock className="text-yellow-600" size={24} />;
      case 'Cancelled':
      case 'Returned':
        return <XCircle className="text-red-600" size={24} />;
      default:
        return <AlertCircle className="text-gray-600" size={24} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-500';
      case 'Out for Delivery':
        return 'bg-blue-600';
      case 'Shipped':
        return 'bg-blue-500';
      case 'Preparing':
      case 'Confirmed':
        return 'bg-purple-500';
      case 'Processing':
        return 'bg-yellow-500';
      case 'Cancelled':
      case 'Returned':
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  };

  if (loading) {
    return (
      <section className="min-h-screen pt-28 bg-gradient-to-br from-[#fffafc] via-[#fff1f4] to-[#ffe6ee] flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={48} className="animate-spin text-pink-600 mx-auto mb-4" />
          <p className="text-pink-600">Loading order details...</p>
        </div>
      </section>
    );
  }

  if (error || !order) {
    return (
      <section className="min-h-screen pt-28 bg-gradient-to-br from-[#fffafc] via-[#fff1f4] to-[#ffe6ee]">
        <div className="max-w-4xl mx-auto px-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-pink-700 mb-8"
          >
            <ArrowLeft /> Back
          </button>
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-10 text-center">
            <XCircle className="text-red-500 mx-auto mb-4" size={48} />
            <h2 className="text-2xl text-pink-800 mb-2">Order Not Found</h2>
            <p className="text-pink-600">{error || 'The order you are looking for does not exist.'}</p>
            <button
              onClick={() => navigate('/orders')}
              className="mt-6 bg-pink-700 text-white px-8 py-3 rounded-full"
            >
              View My Orders
            </button>
          </div>
        </div>
      </section>
    );
  }

  const statusOrder = [
    'Processing',
    'Confirmed',
    'Preparing',
    'Shipped',
    'Out for Delivery',
    'Delivered'
  ];
  const currentStatusIndex = statusOrder.indexOf(order.status);

  return (
    <section className="min-h-screen pt-24 pb-24 bg-gradient-to-br from-[#fffafc] via-[#fff1f4] to-[#ffe6ee]">
      <div className="max-w-6xl mx-auto px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-pink-700 mb-8"
        >
          <ArrowLeft /> Back
        </button>

        {/* Header */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-10 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="font-serif text-3xl text-pink-900 mb-2">
                Track Order #{order.orderId}
              </h1>
              <p className="text-pink-600">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div className="text-right">
              <p className="text-pink-600 text-sm mb-1">Total Amount</p>
              <p className="text-2xl font-semibold text-pink-800">
                {currency}{order.total}
              </p>
            </div>
          </div>
        </div>

        {/* Tracking Timeline */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-10 mb-8">
          <h2 className="text-xl font-semibold text-pink-900 mb-8">Order Status</h2>
          
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-pink-200"></div>
            
            {/* Status Steps */}
            <div className="space-y-8">
              {statusOrder.map((status, index) => {
                const isCompleted = index <= currentStatusIndex;
                const isCurrent = index === currentStatusIndex;
                const historyEntry = order.statusHistory?.find(h => h.status === status);
                
                return (
                  <div key={status} className="relative flex items-start gap-6">
                    {/* Icon */}
                    <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full ${
                      isCompleted ? getStatusColor(status) : 'bg-gray-300'
                    } text-white`}>
                      {isCompleted ? getStatusIcon(status) : <Clock size={20} />}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 pt-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className={`font-semibold ${
                          isCurrent ? 'text-pink-900' : isCompleted ? 'text-gray-700' : 'text-gray-400'
                        }`}>
                          {status}
                        </h3>
                        {historyEntry && (
                          <span className="text-sm text-pink-600">
                            {new Date(historyEntry.timestamp).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      {historyEntry?.note && (
                        <p className="text-sm text-gray-600">{historyEntry.note}</p>
                      )}
                      {isCurrent && order.trackingNumber && (
                        <div className="mt-2 p-3 bg-pink-50 rounded-lg">
                          <p className="text-sm font-medium text-pink-900">Tracking Number</p>
                          <p className="text-lg font-mono text-pink-700">{order.trackingNumber}</p>
                          {order.carrier && (
                            <p className="text-xs text-pink-600 mt-1">Carrier: {order.carrier}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Estimated Delivery */}
          {order.estimatedDelivery && order.status !== 'Delivered' && (
            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900">
                <strong>Estimated Delivery:</strong>{' '}
                {new Date(order.estimatedDelivery).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          )}
        </div>

        {/* Shipping Address */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-10 mb-8">
          <h2 className="text-xl font-semibold text-pink-900 mb-6 flex items-center gap-2">
            <MapPin className="text-pink-600" /> Shipping Address
          </h2>
          <div className="text-gray-700">
            <p className="font-medium">{order.shippingAddress.street}</p>
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
            </p>
            <p>{order.shippingAddress.country}</p>
            {order.shippingAddress.phone && (
              <p className="mt-2 text-pink-600">Phone: {order.shippingAddress.phone}</p>
            )}
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-10">
          <h2 className="text-xl font-semibold text-pink-900 mb-6">Order Items</h2>
          <div className="space-y-4">
            {order.items.map((item, idx) => (
              <div
                key={item.productId?._id || idx}
                className="flex gap-6 items-center py-4 border-b border-pink-100 last:border-0"
              >
                <img
                  src={Array.isArray(item.image) ? item.image[0] : item.image}
                  className="w-20 h-24 rounded-xl object-cover"
                  alt={item.name}
                />
                <div className="flex-1">
                  <h4 className="text-pink-900 font-medium">{item.name}</h4>
                  <p className="text-sm text-pink-600">
                    Size: {item.size} • Quantity: {item.quantity}
                  </p>
                </div>
                <p className="text-pink-800 font-semibold">
                  {currency}{item.price * item.quantity}
                </p>
              </div>
            ))}
          </div>
          
          {/* Order Summary */}
          <div className="mt-8 pt-6 border-t border-pink-200">
            <div className="flex justify-between text-gray-700 mb-2">
              <span>Subtotal</span>
              <span>{currency}{order.subtotal || order.total}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-green-600 mb-2">
                <span>Discount</span>
                <span>-{currency}{order.discount}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-700 mb-2">
              <span>Delivery Fee</span>
              <span>{order.deliveryFee === 0 ? 'Free' : `${currency}${order.deliveryFee}`}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold text-pink-900 mt-4 pt-4 border-t border-pink-200">
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
