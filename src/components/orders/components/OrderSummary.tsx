import { cn } from "@/utils/utils";

interface OrderSummaryProps {
  subtotal: number;
  shipping_cost: number;
  tax: number;
  total: number;
  className?: string;
}

const OrderSummary = ({ subtotal, shipping_cost, tax, total, className }: OrderSummaryProps) => {
  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500">Subtotal</span>
        <span className="text-gray-700">${subtotal.toLocaleString('es-CO')}</span>
      </div>
      
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500">Envío</span>
        <span className="text-gray-700">
          {shipping_cost > 0 ? `$${shipping_cost.toLocaleString('es-CO')}` : "Gratis"}
        </span>
      </div>
      
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500">Impuestos</span>
        <span className="text-gray-700">${tax.toLocaleString('es-CO')}</span>
      </div>
      
      <div className="h-px bg-gray-100 my-2"></div>
      
      <div className="flex items-center justify-between font-medium">
        <span className="text-gray-900">Total</span>
        <span className="text-gray-900">${total.toLocaleString('es-CO')}</span>
      </div>
    </div>
  );
};

export default OrderSummary;