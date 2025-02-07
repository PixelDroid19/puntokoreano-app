import { formatNumber } from "@/pages/store/utils/formatPrice";

// src/components/checkout/DetailBuy.component.tsx
interface OrderDetails {
  order_number: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  shipping_cost: number;
  total: number;
  subtotal: number;
  created_at: string;
}

interface Props {
  orderDetails: OrderDetails;
}

const DetailBuy: React.FC<Props> = ({ orderDetails }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-CO", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <section className="mt-5 sm:w-[550px] mx-auto">
      <div className="relative mt-12 bg-white shadow-xl rounded-2xl p-4">
        <figure className="absolute -top-6 left-[45%]">
          <img
            src="https://puntokoreano.com/images/logo-512x512.png"
            alt="logo"
            width={50}
          />
        </figure>

        <h3 className="text-xl font-semibold text-center pt-6 pb-2">
          Punto Koreano
        </h3>
        <p className="text-base text-gray-400 text-center border-b pb-2">
          {formatDate(orderDetails.created_at)}
        </p>

        <p className="text-base text-gray-400 mt-2">Detalle de la operación</p>
        <div>
          {orderDetails.items.map((item, index) => (
            <div
              key={index}
              className="border-b border-dotted mt-2 flex justify-between items-end pb-2"
            >
              <div className="w-fit">
                <h4 className="text-lg font-bold">{item.name}</h4>
                <div className="flex justify-between text-gray-400">
                  <p className="text-base">
                    $ {formatNumber(item?.price, "es-CO", "COP")} COP
                  </p>
                  <p className="text-base">x{item.quantity}</p>
                </div>
              </div>
              <p className="text-base font-bold">
                $ {formatNumber(item.price * item.quantity, "es-CO", "COP")} COP
              </p>
            </div>
          ))}

          <div className="pt-4 text-base border-b">
            <div className="flex justify-between pb-2">
              <p className="text-gray-400">Subtotal</p>
              <p>$ {formatNumber(orderDetails?.subtotal, "es-CO", "COP")} COP</p>
            </div>
          </div>

          <div className="pt-4 text-base border-b">
            <div className="flex justify-between pb-2">
              <p className="text-gray-400">Envío</p>
              <p>$ {formatNumber(orderDetails?.shipping_cost, "es-CO", "COP")} COP</p>
            </div>
          </div>

          <div className="pt-4 text-base flex justify-between">
            <p>Total</p>
            <p>$ {formatNumber(orderDetails?.total, "es-CO", "COP")} COP</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DetailBuy;
