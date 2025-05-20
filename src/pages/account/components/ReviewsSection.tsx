// src/pages/account/components/ReviewsSection.tsx
import { useState, useEffect } from "react";
import {
  List,
  Rate,
  Tag,
  Button,
  Empty,
  notification,
  Spin,
  Modal,
  Form,
  Input,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { apiGet, apiDelete, apiPatch, ENDPOINTS } from "@/api/apiClient";
import { formatDistance } from "date-fns";
import { es } from "date-fns/locale";

interface Review {
  _id: string;
  product: {
    id: string;
    name: string;
    image: string;
  };
  rating: number;
  title: string;
  content: string;
  images?: string[];
  createdAt: string;
  purchase_verified: boolean;
  helpful_votes: {
    positive: number;
    negative: number;
  };
}

interface ReviewFormData {
  title: string;
  content: string;
  rating: number;
}

const { TextArea } = Input;

const DELETE_REVIEW_ENDPOINT = {
  url: `${
    import.meta.env.VITE_API_REST_URL || "http://localhost:5000/api/v1"
  }/reviews/:reviewId`,
  method: "DELETE",
};
const UPDATE_REVIEW_ENDPOINT = {
  url: `${
    import.meta.env.VITE_API_REST_URL || "http://localhost:5000/api/v1"
  }/reviews/:reviewId`,
  method: "PATCH",
};

const ReviewsSection = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentReview, setCurrentReview] = useState<Review | null>(null);
  const [form] = Form.useForm<ReviewFormData>();
  const [pagination, setPagination] = useState({ total: 0 });

  // Fetch user reviews
  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await apiGet<{
        success: boolean;
        data: { reviews: Review[]; pagination?: { total: number } };
      }>(ENDPOINTS.USER.GET_REVIEWS);
      if (response.success) {
        setReviews(response.data.reviews || []);
        setPagination((prev) => ({
          ...prev,
          total: response.data.pagination?.total || 0,
        }));
      }
    } catch (error: any) {
      notification.error({
        message: "Error",
        description:
          error.response?.data?.message || "No se pudieron cargar las reseñas",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleEditReview = (review: Review) => {
    setCurrentReview(review);
    form.setFieldsValue({
      title: review.title,
      content: review.content,
      rating: review.rating,
    });
    setEditModalVisible(true);
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      const response = await apiDelete<{ success: boolean }>(
        DELETE_REVIEW_ENDPOINT,
        { reviewId }
      );
      if (response.success) {
        notification.success({
          message: "Reseña eliminada",
          description: "La reseña ha sido eliminada exitosamente",
        });
        fetchReviews();
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description: "No se pudo eliminar la reseña",
      });
    }
  };

  const handleUpdateReview = async (values: ReviewFormData) => {
    if (!currentReview) return;

    try {
      const response = await apiPatch<{ success: boolean }>(
        UPDATE_REVIEW_ENDPOINT,
        values,
        { reviewId: currentReview._id }
      );
      if (response.success) {
        notification.success({
          message: "Reseña actualizada",
          description: "La reseña ha sido actualizada exitosamente",
        });
        setEditModalVisible(false);
        fetchReviews();
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description: "No se pudo actualizar la reseña",
      });
    }
  };

  const navigateToProduct = (productId: string) => {
    navigate(`/store/product/${productId}#reviews`);
  };

  if (loading) {
    return <Spin size="large" className="flex justify-center my-8" />;
  }

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-4">Mis reseñas</h2>

      {reviews.length === 0 ? (
        <Empty
          description="No has escrito ninguna reseña todavía"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ) : (
        <List
          dataSource={reviews}
          renderItem={(review) => (
            <List.Item
              actions={[
                <Button
                  icon={<EditOutlined />}
                  onClick={() => handleEditReview(review)}
                  type="text"
                />,
                <Button
                  icon={<DeleteOutlined />}
                  onClick={() => handleDeleteReview(review._id)}
                  type="text"
                  danger
                />,
              ]}
            >
              <div className="w-full">
                <div className="flex justify-between items-start mb-2">
                  <div
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => navigateToProduct(review.product.id)}
                  >
                    <img
                      src={review.product.image}
                      alt={review.product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <h3 className="font-semibold">{review.product.name}</h3>
                      <Rate
                        disabled
                        value={review.rating}
                        className="text-[#E2060F] text-sm"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-gray-500 text-sm">
                      {formatDistance(new Date(review.createdAt), new Date(), {
                        locale: es,
                        addSuffix: true,
                      })}
                    </span>
                    {review.purchase_verified && (
                      <Tag
                        icon={<CheckCircleOutlined />}
                        color="success"
                        className="mt-1"
                      >
                        Compra verificada
                      </Tag>
                    )}
                  </div>
                </div>

                <div className="mt-2">
                  <h4 className="font-semibold">{review.title}</h4>
                  <p className="text-gray-700">{review.content}</p>

                  {review.images && review.images.length > 0 && (
                    <div className="flex gap-2 mt-2">
                      {review.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Review image ${index + 1}`}
                          className="w-16 h-16 object-cover rounded"
                        />
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span>
                      {review.helpful_votes.positive} personas encontraron útil
                      esta reseña
                    </span>
                  </div>
                </div>
              </div>
            </List.Item>
          )}
        />
      )}

      <Modal
        title="Editar reseña"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
      >
        {currentReview && (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleUpdateReview}
            initialValues={{
              title: currentReview.title,
              content: currentReview.content,
              rating: currentReview.rating,
            }}
          >
            <div className="mb-4">
              <p className="font-semibold">{currentReview.product.name}</p>
            </div>

            <Form.Item
              name="rating"
              label="Calificación"
              rules={[
                { required: true, message: "Por favor califica el producto" },
              ]}
            >
              <Rate className="text-[#E2060F]" />
            </Form.Item>

            <Form.Item
              name="title"
              label="Título"
              rules={[
                {
                  required: true,
                  message: "Por favor ingresa un título para tu reseña",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="content"
              label="Comentario"
              rules={[
                { required: true, message: "Por favor ingresa tu comentario" },
              ]}
            >
              <TextArea rows={4} />
            </Form.Item>

            <Form.Item className="flex justify-end">
              <Button
                onClick={() => setEditModalVisible(false)}
                style={{ marginRight: 8 }}
              >
                Cancelar
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                className="bg-[#E2060F] hover:bg-[#001529]"
              >
                Actualizar
              </Button>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default ReviewsSection;
