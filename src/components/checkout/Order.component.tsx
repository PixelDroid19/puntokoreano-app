import { Badge, Image } from "antd";
import { useCartStore } from "@/store/cart.store";
import { formatNumber } from "@/pages/store/utils/formatPrice";

const Orders = () => {
  // Usar el store del carrito
  const { items, subTotal, total } = useCartStore();

  return (
    <section className="bg-[#FFFFFF] rounded-lg mt-4 px-4 border shadow-xl pb-5 md:h-fit md:w-fit md:sticky lg:w-2/5 lg:mt-[75px]">
      <h3 className="text-xl text-center py-4 font-bold">Su orden</h3>

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
            <p>$ {formatNumber(item?.price, "es-CO", "COP")} COP</p>
          </div>
        </div>
      ))}

      <div className="pt-4 text-base border-b">
        <div className="flex justify-between pb-2">
          <p className="text-gray-400">Subtotal</p>
          <p>$ {formatNumber(subTotal, "es-CO", "COP")} COP</p>
        </div>
      </div>

      <div className="pt-4 text-base flex justify-between">
        <p>Total</p>
        <p>$ {formatNumber(total, "es-CO", "COP")} COP</p>
      </div>
    </section>
  );
};

export default Orders;
