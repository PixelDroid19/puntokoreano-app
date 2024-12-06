// components/reviews/WriteReview.tsx
import { useState, useEffect } from "react";
import { Form, Input, Rate, Upload, notification } from "antd";
import { useAuth } from "../../hooks/useAuth";
import { reviewService } from "../../services/reviewService";
import type { UploadFile } from "antd/es/upload/interface";
import { PlusOutlined } from "@ant-design/icons";
import { ReviewFormData } from "@/types/review.types";

interface ReviewStatus {
  canReview: boolean;
  hasOrdered: boolean;
  hasReviewed: boolean;
  orderInfo?: {
    orderNumber: string;
  };
}

interface Props {
  productId: string;
  onSuccess: () => void;
}

const WriteReview = ({ productId, onSuccess }: Props) => {
  const [form] = Form.useForm();
  const { isAuthenticated } = useAuth();
  const [reviewStatus, setReviewStatus] = useState<ReviewStatus | null>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const checkReviewEligibility = async () => {
      if (!isAuthenticated) return;

      try {
        const response = await reviewService.canUserReview(productId);
        if (response.success) {
          setReviewStatus(response.data);

          if (!response.data.canReview) {
            if (response.data.hasReviewed) {
              notification.info({
                message: "No puedes calificar este producto",
                description: "Ya has calificado este producto anteriormente",
              });
            } else if (!response.data.hasOrdered) {
              notification.info({
                message: "No puedes calificar este producto",
                description:
                  "Debes comprar este producto para poder calificarlo",
              });
            }
          }
        }
      } catch (error) {
        console.error("Error checking review eligibility:", error);
      }
    };

    checkReviewEligibility();
  }, [productId, isAuthenticated]);

  const handleSubmit = async (values: any) => {
    if (!isAuthenticated) {
      notification.error({
        message: "Debes iniciar sesión",
        description: "Para calificar un producto necesitas iniciar sesión",
      });
      return;
    }

    if (!reviewStatus?.canReview) {
      return;
    }

    setSubmitting(true);
    try {
      const reviewData: ReviewFormData = {
        rating: values.rating,
        title: values.title,
        content: values.content,
        images: fileList.map((file) => file.originFileObj as File),
      };

      const response = await reviewService.createReview(productId, reviewData);

      if (response.success) {
        notification.success({
          message: "Calificación enviada",
          description: "Tu calificación será revisada y publicada pronto",
        });

        form.resetFields();
        setFileList([]);
        onSuccess();
      } else {
        throw new Error(response.message || "Error al crear la reseña");
      }
    } catch (error: any) {
      notification.error({
        message: "Error",
        description:
          error.message ||
          "No se pudo enviar tu calificación. Intenta de nuevo.",
      });
    } finally {
      setSubmitting(false);
    }
  };
  if (!isAuthenticated) {
    return (
      <div className="text-center p-4 bg-gray-50 rounded-lg">
        <p>Debes iniciar sesión para calificar este producto</p>
      </div>
    );
  }

  if (!reviewStatus?.canReview) {
    return null;
  }

  return (
    <div className="my-4">
      <h2 className="text-center text-lg font-bold sm:text-start xl:text-2xl">
        Califica este producto
      </h2>

      {reviewStatus?.orderInfo && (
        <p className="text-sm text-gray-600 mb-4">
          Orden: #{reviewStatus.orderInfo.orderNumber}
        </p>
      )}

      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item
          name="rating"
          rules={[
            { required: true, message: "Por favor califica el producto" },
          ]}
        >
          <Rate />
        </Form.Item>

        <Form.Item
          name="title"
          rules={[{ required: true, message: "Por favor ingresa un título" }]}
        >
          <Input placeholder="Título de tu calificación" />
        </Form.Item>

        <Form.Item
          name="content"
          rules={[
            { required: true, message: "Por favor ingresa tu comentario" },
          ]}
        >
          <Input.TextArea
            rows={4}
            placeholder="Cuéntanos tu experiencia con el producto..."
          />
        </Form.Item>

        <Form.Item>
          <Upload
            listType="picture-card"
            fileList={fileList}
            onChange={({ fileList }) => setFileList(fileList)}
            beforeUpload={() => false}
          >
            {fileList.length >= 4 ? null : (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Agregar foto</div>
              </div>
            )}
          </Upload>
        </Form.Item>

        <Form.Item>
          <button
            type="submit"
            disabled={submitting}
            className="bg-[#E2060F] transition-[background-color] duration-300 hover:bg-[#001529] text-white py-2 px-4 rounded-full font-semibold disabled:opacity-50"
          >
            {submitting ? "Enviando..." : "Enviar calificación"}
          </button>
        </Form.Item>
      </Form>
    </div>
  );
};

export { WriteReview };
