// src/pages/account/components/ReviewsSection.tsx
import { useState, useEffect } from "react";
import { List, Card, Rate, Button, Empty, notification, Spin, Image, Tag } from "antd";
import { ShopOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { apiGet, ENDPOINTS } from "@/api/apiClient";

interface ReviewProduct {
  _id: string;
  name: string;
  images: string[];
  brand?: string;
}

interface Review {
  _id: string;
  product: ReviewProduct;
  rating: number;
  title: string;
  comment: string;
  verified_purchase: boolean;
  helpful_votes: number;
  status: "approved" | "pending" | "rejected";
  created_at: string;
  updated_at: string;
}

const ReviewsSection = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Fetch user reviews
  const fetchReviews = async (page = 1) => {
    setLoading(true);
    try {
      const response = await apiGet<{
        success: boolean;
        data: {
          reviews: Review[];
          pagination: {
            total: number;
            pages: number;
            page: number;
            limit: number;
          };
        };
      }>(
        ENDPOINTS.USER.GET_USER_REVIEWS,
        {},
        { page, limit: pagination.pageSize }
      );

      if (response.success) {
        setReviews(response.data.reviews);
        setPagination(prev => ({
          ...prev,
          current: page,
          total: response.data.pagination.total,
        }));
      }
    } catch (error: any) {
      notification.error({
        message: "Error",
        description: "No se pudieron cargar las reseñas",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handlePageChange = (page: number) => {
    fetchReviews(page);
  };

  const navigateToProduct = (productId: string) => {
    navigate(`/store/product/${productId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "green";
      case "pending":
        return "orange";
      case "rejected":
        return "red";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return "Aprobada";
      case "pending":
        return "Pendiente";
      case "rejected":
        return "Rechazada";
      default:
        return status;
    }
  };

  if (loading && reviews.length === 0) {
    return <Spin size="large" className="flex justify-center my-8" />;
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Mis reseñas</h2>
        <div className="text-gray-500">
          {pagination.total} reseña{pagination.total !== 1 ? "s" : ""}
        </div>
      </div>

      {reviews.length === 0 ? (
        <Empty
          description="No has escrito ninguna reseña"
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
          loading={loading}
          dataSource={reviews}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            onChange: handlePageChange,
            showSizeChanger: false,
            showQuickJumper: false,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} de ${total} reseñas`,
          }}
          renderItem={(review) => (
            <List.Item>
              <Card className="w-full">
                <div className="flex gap-4">
                  {/* Imagen del producto */}
                  <div className="flex-shrink-0">
                    <Image
                      src={review.product.images[0]}
                      alt={review.product.name}
                      width={80}
                      height={80}
                      className="object-cover rounded cursor-pointer"
                      onClick={() => navigateToProduct(review.product._id)}
                      preview={false}
                    />
                  </div>

                  {/* Contenido de la reseña */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 
                          className="font-semibold cursor-pointer hover:text-[#E2060F] transition-colors"
                          onClick={() => navigateToProduct(review.product._id)}
                        >
                          {review.product.name}
                        </h4>
                        {review.product.brand && (
                          <p className="text-sm text-gray-500">
                            {review.product.brand}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Tag color={getStatusColor(review.status)}>
                          {getStatusText(review.status)}
                        </Tag>
                        {review.verified_purchase && (
                          <Tag color="blue" icon={<ShopOutlined />}>
                            Compra verificada
                          </Tag>
                        )}
                      </div>
                    </div>

                    <div className="mb-2">
                      <Rate disabled value={review.rating} />
                      <span className="ml-2 text-sm text-gray-500">
                        {new Date(review.created_at).toLocaleDateString("es-CO")}
                      </span>
                    </div>

                    {review.title && (
                      <h5 className="font-medium mb-1">{review.title}</h5>
                    )}

                    <p className="text-gray-700 mb-3">{review.comment}</p>

                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        {review.helpful_votes > 0 && (
                          <span>👍 {review.helpful_votes} persona{review.helpful_votes !== 1 ? "s" : ""} encontraron esto útil</span>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        {review.status === "pending" && (
                          <Button
                            size="small"
                            icon={<EditOutlined />}
                            onClick={() => {
                              // Implementar edición de reseña
                              notification.info({
                                message: "Funcionalidad próximamente",
                                description: "La edición de reseñas estará disponible pronto",
                              });
                            }}
                          >
                            Editar
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default ReviewsSection;
