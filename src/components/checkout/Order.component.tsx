import { Badge, Image, Divider } from "antd";
import { useCartStore } from "@/store/cart.store";
import { formatNumber } from "@/pages/store/utils/formatPrice";
import { Package, Calculator, Truck, CreditCard } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import ENDPOINTS from "@/api";

const Orders = () => {
  // Usar el store del carrito
  const { items, subTotal, total } = useCartStore();
  
  // 🆕 Estado para configuración de envío
  const [shippingConfig, setShippingConfig] = useState<any>(null);

  // 🆕 Cargar configuración de envío
  useEffect(() => {
    const loadShippingConfig = async () => {
      try {
        const response = await axios.get(ENDPOINTS.ORDERS.SHIPPING_CONFIG.url);
        if (response.data.success) {
          setShippingConfig(response.data.data);
        }
      } catch (error) {
        console.error("Error cargando configuración de envío:", error);
      }
    };

    loadShippingConfig();
  }, []);

  // 🆕 Calcular IVA (19%)
  const taxRate = 0.19;
  const tax = subTotal * taxRate;
  
  // 🆕 Verificar si califica para envío gratis
  const freeShippingThreshold = shippingConfig?.freeShipping?.threshold || 0;
  const qualifiesForFreeShipping = freeShippingThreshold > 0 && (subTotal + tax) >= freeShippingThreshold;
  
  // 🆕 Estimar envío
  const estimatedShipping = qualifiesForFreeShipping ? 0 : 15000; // Costo base estimado
  
  // 🆕 Total estimado incluyendo IVA y envío
  const estimatedTotal = subTotal + tax + estimatedShipping;

  return (
    <section className="bg-[#FFFFFF] rounded-lg mt-4 px-4 border shadow-xl pb-5 md:h-fit md:w-fit md:sticky lg:w-2/5 lg:mt-[75px]">
      <h3 className="text-xl text-center py-4 font-bold flex items-center justify-center">
        <Package className="mr-2 w-5 h-5" />
        Su orden
      </h3>

      {items.map((item) => (
        <div
          key={item.id}
          className="flex justify-center gap-4 border-b mt-5 sm:gap-10 sm:justify-start"
        >
          <figure>
            <Badge count={item.quantity}>
              <Image preview={false} src={item.image} />
            </Badge>
          </figure>
          <div>
            <h2 className="font-semibold text-lg">{item.name}</h2>
            <p>{formatNumber(item?.price, "es-CO", "COP")} COP</p>
          </div>
        </div>
      ))}

      <Divider className="my-4" />

      {/* 🆕 Desglose detallado de costos */}
      <div className="space-y-3">
        <div className="flex justify-between text-base">
          <span className="text-gray-600">Subtotal productos</span>
          <span>{formatNumber(subTotal, "es-CO", "COP")} COP</span>
        </div>

        <div className="flex justify-between text-base">
          <span className="text-gray-600 flex items-center">
            <Calculator className="mr-1 w-4 h-4" />
            IVA (19%)
          </span>
          <span>{formatNumber(tax, "es-CO", "COP")} COP</span>
        </div>

        <div className="flex justify-between text-base">
          <span className="text-gray-600 flex items-center">
            <Truck className="mr-1 w-4 h-4" />
            Envío
          </span>
          {qualifiesForFreeShipping ? (
            <span className="text-green-600 font-medium">¡Gratis!</span>
          ) : (
            <span className="text-sm">Se calcula en siguiente paso</span>
          )}
        </div>

        {/* 🆕 Mostrar progreso hacia envío gratis si está disponible */}
        {shippingConfig?.freeShipping?.available && !qualifiesForFreeShipping && freeShippingThreshold > 0 && (
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-sm text-blue-700 mb-1">
              Envío gratis desde {formatNumber(freeShippingThreshold, "es-CO", "COP")} COP
            </div>
            <div className="text-xs text-blue-600">
              Te faltan {formatNumber(freeShippingThreshold - (subTotal + tax), "es-CO", "COP")} COP
            </div>
          </div>
        )}

        <Divider className="my-2" />

        <div className="flex justify-between text-lg font-semibold">
          <span>Total {qualifiesForFreeShipping ? "(con envío gratis)" : "(sin envío)"}</span>
          <span className="text-[#E2060F]">
            {formatNumber(subTotal + tax + (qualifiesForFreeShipping ? 0 : 0), "es-CO", "COP")} COP
          </span>
      </div>

        <div className="text-center text-sm text-gray-500 mt-2">
          {qualifiesForFreeShipping ? (
            "🎉 ¡Tu pedido incluye envío gratis!"
          ) : (
            "💡 El costo de envío se calculará según tu ubicación"
          )}
        </div>
      </div>
    </section>
  );
};

export default Orders;
