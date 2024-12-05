import React, { useState } from "react";
import { Rate, Button, Modal, Form, Input, notification, Tag } from "antd";
import {
  LikeOutlined,
  DislikeOutlined,
  FlagOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useAuth } from "@/hooks/useAuth";
import { useProductReviews } from "@/hooks/useProductReviews";
import { formatDistance } from "date-fns";
import { es } from "date-fns/locale";

const ReviewUser = ({ review }) => {
  const [isReportModalVisible, setIsReportModalVisible] = useState(false);
  const [reportForm] = Form.useForm();
  const { user } = useAuth();
  const { voteReview, reportReview } = useProductReviews(review.product);
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  const handleVote = async (vote) => {
    if (!user) {
      notification.info({
        message: "Inicia sesión",
        description: "Necesitas iniciar sesión para votar las reseñas",
      });
      return;
    }

    try {
      await voteReview({ reviewId: review._id, vote });
      notification.success({
        message: "Voto registrado",
        description: "Gracias por tu retroalimentación",
      });
    } catch (error) {
      notification.error({
        message: "Error",
        description: "No se pudo registrar tu voto",
      });
    }
  };

  const handleReport = async (values) => {
    if (!user) {
      notification.info({
        message: "Inicia sesión",
        description: "Necesitas iniciar sesión para reportar reseñas",
      });
      return;
    }

    setIsSubmittingReport(true);
    try {
      await reportReview({
        reviewId: review._id,
        reason: values.reason,
        details: values.details,
      });

      notification.success({
        message: "Reporte enviado",
        description:
          "Gracias por ayudarnos a mantener la calidad de las reseñas",
      });

      setIsReportModalVisible(false);
      reportForm.resetFields();
    } catch (error) {
      notification.error({
        message: "Error",
        description: "No se pudo enviar el reporte",
      });
    } finally {
      setIsSubmittingReport(false);
    }
  };

  return (
    <div className="border-b border-gray-200 pb-4">
      {/* Cabecera de la reseña */}
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="font-bold">{review.user?.name || "Usuario"}</div>
          <Rate
            disabled
            value={review.rating}
            className="text-[#E2060F] text-sm"
          />
          {review.purchase_verified && (
            <Tag
              icon={<CheckCircleOutlined />}
              color="success"
              className="ml-2"
            >
              Compra verificada
            </Tag>
          )}
        </div>
        <span className="text-gray-500 text-sm">
          {formatDistance(new Date(review.createdAt), new Date(), {
            locale: es,
            addSuffix: true,
          })}
        </span>
      </div>

      {/* Contenido de la reseña */}
      <h4 className="font-semibold mb-1">{review.title}</h4>
      <p className="text-gray-700 mb-3">{review.content}</p>

      {/* Imágenes de la reseña */}
      {review.images?.length > 0 && (
        <div className="flex gap-2 mb-3">
          {review.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Review image ${index + 1}`}
              className="w-20 h-20 object-cover rounded"
            />
          ))}
        </div>
      )}

      {/* Acciones de la reseña */}
      <div className="flex items-center gap-4">
        <Button
          type="text"
          icon={<LikeOutlined />}
          onClick={() => handleVote(true)}
          className="text-green-600"
        >
          {review.helpful_votes?.positive || 0}
        </Button>
        <Button
          type="text"
          icon={<DislikeOutlined />}
          onClick={() => handleVote(false)}
          className="text-red-600"
        >
          {review.helpful_votes?.negative || 0}
        </Button>
        <Button
          type="text"
          icon={<FlagOutlined />}
          onClick={() => setIsReportModalVisible(true)}
          className="text-yellow-600"
        >
          Reportar
        </Button>
      </div>

      {/* Modal de reporte */}
      <Modal
        title="Reportar reseña"
        open={isReportModalVisible}
        onCancel={() => setIsReportModalVisible(false)}
        footer={null}
      >
        <Form form={reportForm} onFinish={handleReport} layout="vertical">
          <Form.Item
            name="reason"
            label="Motivo del reporte"
            rules={[
              { required: true, message: "Por favor selecciona un motivo" },
            ]}
          >
            <Input.Select
              options={[
                { value: "inappropriate", label: "Contenido inapropiado" },
                { value: "spam", label: "Spam o publicidad" },
                { value: "fake", label: "Reseña falsa" },
                { value: "other", label: "Otro" },
              ]}
            />
          </Form.Item>

          <Form.Item
            name="details"
            label="Detalles adicionales"
            rules={[
              { required: true, message: "Por favor proporciona más detalles" },
            ]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <div className="flex justify-end gap-2">
            <Button onClick={() => setIsReportModalVisible(false)}>
              Cancelar
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isSubmittingReport}
              className="bg-[#E2060F] hover:bg-[#001529]"
            >
              Enviar reporte
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default ReviewUser;
