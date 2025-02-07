import { faArrowLeft, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Image, Space, Table, notification } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "@/store/cart.store";
import { formatNumber } from "../store/utils/formatPrice";

const Cart = () => {
  const navigate = useNavigate();

  // Usar el store del carrito
  const {
    items,
    subTotal,
    total,
    updateQuantity,
    removeItem,
    calculateTotals,
  } = useCartStore();

  // Manejar incremento de cantidad
  const handleQuantityChange = (
    itemId: string,
    increment: number,
    currentQty: number
  ) => {
    const newQuantity = currentQty + increment;
    if (newQuantity >= 1) {
      updateQuantity(itemId, newQuantity);
      calculateTotals();
    }
  };

  // Manejar eliminación de item
  const handleRemoveItem = (itemId: string) => {
    removeItem(itemId);
    notification.success({
      message: "Producto eliminado",
      description: "El producto fue eliminado del carrito exitosamente",
    });
  };

  const columns = [
    {
      title: "Producto",
      dataIndex: "name",
      render: (name: string, element: Record<string, any>) => (
        <figure className="flex gap-3 items-center">
          <Image src={element.image} preview={false} />
          <figcaption className="text-ellipsis">{name}</figcaption>
        </figure>
      ),
    },
    {
      title: "Precio",
      dataIndex: "price",
      render: (price: number) => <p>$ {formatNumber(price, "es-CO", "COP")} COP</p>,
    },
    {
      title: "Cantidad",
      dataIndex: "quantity",
      render: (quantity: number, record: any) => (
        <Space className="gap-0 relative flex">
          <button
            onClick={() => handleQuantityChange(record.id, 1, quantity)}
            className="w-7 h-7 bg-gray-300 rounded-l-full font-bold text-xl flex justify-center items-center"
            disabled={quantity >= record.stock}
          >
            +
          </button>
          <input
            value={quantity}
            type="number"
            className="outline-none h-[25px] px-2 w-2 text-lg font-bold text-center box-content border-y no-spinner"
            readOnly
          />
          <button
            onClick={() => handleQuantityChange(record.id, -1, quantity)}
            className="w-7 h-7 bg-gray-300 rounded-r-full font-bold text-xl flex justify-center items-center"
            disabled={quantity <= 1}
          >
            -
          </button>
        </Space>
      ),
    },
    {
      title: "",
      key: "action",
      render: (_: any, record: any) => (
        <button
          onClick={() => handleRemoveItem(record.id)}
          className="bg-[#E2060F] 2xl:ml-2 hover:bg-[#001529] shadow-xl transition-[background] duration-300 rounded-full px-[5px]"
        >
          <FontAwesomeIcon icon={faXmark} className="text-white" />
        </button>
      ),
      style: { padding: 0 },
    },
  ];

  return (
    <div className="max-w-[1280px] px-5 pt-4 lg:px-[50px] xl:min-h-[80vh] xl:mx-auto xl:px-0">
      <section
        className="flex items-center gap-3 w-fit cursor-pointer"
        onClick={() => navigate("/store")}
      >
        <FontAwesomeIcon className="text-lg" icon={faArrowLeft} />
        <p className="text-lg font-semibold">Tienda</p>
      </section>

      <section className="mb-10 max-w-6xl mx-auto">
        <h1 className="font-bold text-xl text-center mt-2 mb-5 xl:text-2xl">
          Carrito de compras
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg mb-4">Tu carrito está vacío</p>
            <Link
              to="/store"
              className="bg-[#E2060F] hover:bg-[#001529] transition-[background-color] duration-300 text-white px-6 py-2 rounded-full inline-block"
            >
              Ir a la tienda
            </Link>
          </div>
        ) : (
          <>
            <Table
              pagination={false}
              size="small"
              columns={columns}
              dataSource={items}
              rowKey="id"
              summary={() => (
                <Table.Summary fixed={"bottom"}>
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={24}>
                      <div className="flex justify-between">
                        <p className="font-medium text-xl xl:text-2xl">
                          SubTotal:
                        </p>
                        <p className="font-medium text-base">
                          $ {formatNumber(subTotal, "es-CO", "COP")} COP
                        </p>
                      </div>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={24}>
                      <div className="flex justify-between">
                        <p className="font-medium text-xl xl:text-2xl">
                          Total:
                        </p>
                        <p className="font-medium text-base">
                          $ {formatNumber(total, "es-CO", "COP")} COP
                        </p>
                      </div>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </Table.Summary>
              )}
            />
            <div className="flex items-center justify-between gap-14 px-2 mt-4">
              <Link
                className="text-base font-bold hover:text-[#E2060F] transition-colors duration-300"
                to="/store"
              >
                Seguir comprando
              </Link>
              <button
                className="bg-[#E2060F] hover:bg-[#001529] transition-[background-color] duration-300 text-white px-8 py-2 rounded-full font-semibold text-base"
                onClick={() => navigate("/store/checkout")}
              >
                Ir a pagar
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default Cart;
