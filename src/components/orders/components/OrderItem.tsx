import { cn } from "@/utils/utils";

interface Product {
  id: string;
  name: string;
  code: string;
  base_price: number;
  images: string[];
}

interface OrderItemProps {
  product: Product;
  quantity: number;
  price_paid: number;
  total: number;
  className?: string;
}

const OrderItem = ({ product, quantity, price_paid, total, className }: OrderItemProps) => {
  return (
    <div className={cn("flex items-start py-4 border-b border-gray-100", className)}>
      <div className="h-16 w-16 rounded-lg border border-gray-100 overflow-hidden bg-gray-50 flex-shrink-0">
        {product.images && product.images.length > 0 ? (
          <img 
            src={product.images[0]} 
            alt={product.name} 
            className="h-full w-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "https://placehold.co/64x64/f3f4f6/a3a3a3?text=No%20Image";
            }}
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-gray-100 text-gray-400 text-xs">
            Sin imagen
          </div>
        )}
      </div>
      
      <div className="ml-4 flex-1">
        <h3 className="font-medium text-gray-900">{product.name}</h3>
        <p className="text-sm text-gray-500 mt-0.5">Código: {product.code}</p>
        <div className="flex items-center justify-between mt-1">
          <span className="text-sm text-gray-600">
            {quantity} × ${price_paid.toLocaleString('es-CO')}
          </span>
          <span className="font-medium text-gray-900">
            ${total.toLocaleString('es-CO')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderItem;