import { useState, useEffect } from "react";
import { List, Button, Empty, notification, Spin, Card, Rate, Image } from "antd";
import { HeartOutlined, ShoppingCartOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { apiGet, apiDelete, ENDPOINTS } from "@/api/apiClient";
import { formatNumber } from "@/pages/store/utils/formatPrice";

interface WishlistItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    price: number;
    images: string[];
    rating: {
      average: number;
      count: number;
    };
    stock: number;
    inStock: boolean;
  };
  added_at: string;
}

const WishlistSection = () => {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch user wishlist
  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const response = await apiGet<{
        success: boolean;
        data: WishlistItem[];
      }>(ENDPOINTS.USER.GET_WISHLIST);
      
      if (response.success) {
        setWishlist(response.data);
      }
    } catch (error: any) {
      notification.error({
        message: "Error",
        description: "No se pudo cargar la lista de deseos",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      const response = await apiDelete<{ success: boolean }>(
        ENDPOINTS.USER.REMOVE_FROM_WISHLIST,
        { productId }
      );
      
      if (response.success) {
        notification.success({
          message: "Producto eliminado",
          description: "El producto ha sido eliminado de tu lista de deseos",
        });
        fetchWishlist();
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description: "No se pudo eliminar el producto de la lista de deseos",
      });
    }
  };

  const navigateToProduct = (productId: string) => {
    navigate(`/store/product/${productId}`);
  };

  const handleAddToCart = (product: any) => {
    // Implementar lógica para agregar al carrito
    notification.success({
      message: "Producto agregado",
      description: `${product.name} ha sido agregado al carrito`,
    });
  };

  if (loading) {
    return <Spin size="large" className="flex justify-center my-8" />;
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Mi lista de deseos</h2>
        <span className="text-gray-500">{wishlist.length} productos</span>
      </div>

      {wishlist.length === 0 ? (
        <Empty
          description="Tu lista de deseos está vacía"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          className="my-8"
        >
          <Button 
            type="primary" 
            onClick={() => navigate("/store")}
            className="bg-[#E2060F] hover:bg-[#001529]"
          >
            Explorar productos
          </Button>
        </Empty>
      ) : (
        <List
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 2,
            lg: 3,
            xl: 3,
            xxl: 4,
          }}
          dataSource={wishlist}
          renderItem={(item) => (
            <List.Item>
              <Card
                hoverable
                className="h-full"
                cover={
                  <div className="relative">
                    <Image
                      alt={item.product.name}
                      src={item.product.images[0]}
                      className="h-48 object-cover cursor-pointer"
                      onClick={() => navigateToProduct(item.product._id)}
                      preview={false}
                    />
                    <Button
                      icon={<DeleteOutlined />}
                      className="absolute top-2 right-2 bg-white hover:bg-red-50 border-red-300 text-red-500"
                      size="small"
                      onClick={() => handleRemoveFromWishlist(item.product._id)}
                    />
                    {!item.product.inStock && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs rounded">
                        Sin stock
                      </div>
                    )}
                  </div>
                }
                actions={[
                  <Button
                    key="cart"
                    type="primary"
                    icon={<ShoppingCartOutlined />}
                    onClick={() => handleAddToCart(item.product)}
                    disabled={!item.product.inStock}
                    className="bg-[#E2060F] hover:bg-[#001529]"
                    block
                  >
                    {item.product.inStock ? "Agregar al carrito" : "Sin stock"}
                  </Button>,
                ]}
              >
                <Card.Meta
                  title={
                    <div 
                      className="cursor-pointer hover:text-[#E2060F] transition-colors"
                      onClick={() => navigateToProduct(item.product._id)}
                    >
                      {item.product.name}
                    </div>
                  }
                  description={
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Rate
                          disabled
                          allowHalf
                          value={item.product.rating.average}
                          className="text-sm"
                        />
                        <span className="text-gray-500 text-sm">
                          ({item.product.rating.count} reseñas)
                        </span>
                      </div>
                      <div className="text-lg font-bold text-[#E2060F]">
                        $ {formatNumber(item.product.price, "es-CO", "COP")} COP
                      </div>
                      <div className="text-xs text-gray-500">
                        Agregado: {new Date(item.added_at).toLocaleDateString("es-CO")}
                      </div>
                    </div>
                  }
                />
              </Card>
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default WishlistSection; 