import { Drawer, Image, notification } from "antd";
import { useMediaQuery } from "react-responsive";
import { useWishlistStore } from "@/store/wishlist.store";
import { useCartStore } from "@/store/cart.store";
import { formatNumber } from "@/pages/store/utils/formatPrice";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const WishlistModal = ({ open, setOpen }: Props) => {
  const md = useMediaQuery({ query: "(min-width: 768px)" });

  // Use wishlist and cart stores
  const { items, removeItem } = useWishlistStore();
  const { addItem } = useCartStore();

  const handleClose = () => setOpen(false);

  const handleAddToCart = (item: any) => {
    addItem(item);
    notification.success({
      message: "Producto agregado",
      description: "El producto fue agregado al carrito exitosamente",
    });
  };

  const handleRemoveFromWishlist = (itemId: string) => {
    removeItem(itemId);
    notification.success({
      message: "Producto eliminado",
      description:
        "El producto fue eliminado de la lista de deseos exitosamente",
    });
  };

  return (
    <Drawer
      destroyOnClose
      width={md ? 400 : 320}
      title="Lista de deseos"
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
            <p>$ {formatNumber(item?.price, "es-CO", "COP")} COP</p>
            <div className="flex gap-2">
              <button
                onClick={() => handleAddToCart(item)}
                className="bg-[#E2060F] hover:bg-[#001529] transition-[background-color] duration-300 text-white px-3 py-1.5 rounded-lg"
              >
                Añadir al carrito
              </button>
              <button
                onClick={() => handleRemoveFromWishlist(item.id)}
                className="text-[#E2060F] hover:text-[#001529] transition-colors duration-300"
              >
                Eliminar
              </button>
            </div>
          </div>
        </section>
      ))}

      {items.length === 0 && (
        <div className="text-center text-gray-500">
          No hay productos en tu lista de deseos
        </div>
      )}
    </Drawer>
  );
};

export default WishlistModal;
