import React from 'react';

const DetailBuy = ({ orderDetails }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Fecha no disponible'; // Handle cases where dateString is null or undefined
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Check if orderDetails is defined before accessing its properties
  if (!orderDetails) {
    return <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <p>No hay detalles de la orden disponibles.</p>
    </div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Productos */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Productos</h2>
          {orderDetails.items && orderDetails.items.map((item, index) => ( // Check if orderDetails.items exists
            <div key={index} className="flex items-start gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
              <img
                src={item.product.images && item.product.images[0]} // Check if item.product.images exists
                alt={item.product.name}
                className="w-20 h-20 object-cover rounded-md"
              />
              <div className="flex-1">
                <h3 className="font-medium">{item.product.name}</h3>
                <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                <p className="font-medium text-gray-800">{formatPrice(item.total)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Información de envío */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Información de envío</h2>
          {/* Check if orderDetails.shipping_address exists before rendering this section */}
          {orderDetails.shipping_address ? (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-medium">{orderDetails.shipping_address.name}</p>
              <p className="text-gray-600">{orderDetails.shipping_address.address}</p>
              <p className="text-gray-600">
                {orderDetails.shipping_address.city}, {orderDetails.shipping_address.state}
              </p>
              <p className="text-gray-600">{orderDetails.shipping_address.zip}</p>
              <p className="text-gray-600">{orderDetails.shipping_address.country}</p>
              <p className="text-gray-600 mt-2">Tel: {orderDetails.shipping_address.phone}</p>
              <p className="text-gray-600">{orderDetails.shipping_address.email}</p>
            </div>
          ) : (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600">Información de envío no disponible.</p>
            </div>
          )}


          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-4">Entrega estimada</h2>
            <p className="text-gray-600">
              {formatDate(orderDetails.estimated_delivery)}
            </p>
          </div>
        </div>
      </div>

      {/* Resumen de la orden */}
      <div className="mt-8 border-t pt-6">
        <div className="max-w-sm ml-auto">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-medium">{formatPrice(orderDetails.subtotal)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">IVA:</span>
            <span className="font-medium">{formatPrice(orderDetails.tax)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Envío:</span>
            <span className="font-medium">{formatPrice(orderDetails.shipping_cost)}</span>
          </div>
          <div className="flex justify-between border-t pt-2 mt-2">
            <span className="font-semibold">Total:</span>
            <span className="font-semibold">{formatPrice(orderDetails.total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailBuy;