import { Drawer, Image, Space, notification } from "antd";
import { useEffect, useRef } from "react";
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "@/store/cart.store";
import { formatNumber } from "@/pages/store/utils/formatPrice";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const CartModal = ({ open, setOpen }: Props) => {
  const md = useMediaQuery({ query: "(min-width: 768px)" });
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  // Use cart store
  const {
    items,
    subTotal,
    total,
    updateQuantity,
    removeItem,
    calculateTotals,
  } = useCartStore();

  const handleClose = () => setOpen(false);

  const handleQuantityChange = (
    itemId: string,
    increment: number,
    currentQty: number
  ) => {
    const newQuantity = currentQty + increment;
    if (newQuantity >= 1) {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleRemoveItem = (itemId: string) => {
    removeItem(itemId);
    notification.success({
      message: "Producto eliminado",
      description: "El producto fue eliminado del carrito exitosamente",
    });
  };

  useEffect(() => {
    calculateTotals();
  }, [items]);

  return (
    <Drawer
      destroyOnClose
      width={md ? 400 : 320}
      title="Carrito de compras"
      open={open}
      onClose={handleClose}
    >
      {items.map((item) => (
        <section key={item.id} className="flex gap-4 border-b mb-4">
          <figure className="w-24 h-28">
            <Image
              style={{ objectFit: "contain", width: 96, height: 112 }}
              src={item.image}
              alt={item.name}
              preview={false}
            />
          </figure>
          <div className="flex flex-col gap-1">
            <h3 className="text-base font-semibold">{item.name}</h3>
            <p>{formatNumber(item?.price, "es-CO", "COP")} COP</p>
            <Space className="gap-0 relative flex">
              <button
                onClick={() => handleQuantityChange(item.id, 1, item.quantity)}
                className="w-7 h-7 bg-gray-300 rounded-l-full font-bold text-xl flex justify-center items-center"
                disabled={item.quantity >= item.stock}
              >
                +
              </button>
              <input
                ref={inputRef}
                value={item.quantity}
                type="number"
                className="outline-none h-[25px] px-2 w-2 text-lg font-bold text-center box-content border-y no-spinner"
                readOnly
              />
              <button
                onClick={() => handleQuantityChange(item.id, -1, item.quantity)}
                className="w-7 h-7 bg-gray-300 rounded-r-full font-bold text-xl flex justify-center items-center"
              >
                -
              </button>
              <button
                onClick={() => handleRemoveItem(item.id)}
                className="underline text-base absolute -right-5 bottom-0 cursor-pointer hover:text-[#E2060F]"
              >
                Eliminar
              </button>
            </Space>
          </div>
        </section>
      ))}

      <section>
        <div className="flex justify-between mb-4">
          <p className="font-medium text-base">SubTotal:</p>
          <p className="font-medium text-base">
            {formatNumber(subTotal, "es-CO", "COP")} COP
          </p>
        </div>
        <div className="flex justify-between">
          <p className="font-medium text-base">Total:</p>
          <p className="font-medium text-base">
            {formatNumber(total, "es-CO", "COP")} COP
          </p>
        </div>
      </section>

      <section className="flex gap-4 mt-4">
        <button
          onClick={() => {
            setOpen(false);
            navigate("/store/cart");
          }}
          className="bg-[#E2060F] hover:bg-[#001529] transition-[background-color] duration-300 text-white w-full py-2 rounded-full font-semibold text-base mt-2"
        >
          Ver Carrito
        </button>
        <button
          className="bg-[#E2060F] hover:bg-[#001529] transition-[background-color] duration-300 text-white w-full py-2 rounded-full font-semibold text-base mt-2"
          onClick={() => {
            setOpen(false);
            navigate("store/checkout");
          }}
        >
          Ir a pagar
        </button>
      </section>
    </Drawer>
  );
};

export default CartModal;
