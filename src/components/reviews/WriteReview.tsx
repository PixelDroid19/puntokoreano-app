// components/reviews/WriteReview.tsx
import { useState, useEffect } from "react";
import { Form, Input, Rate, notification } from "antd";
import { useAuth } from "../../hooks/useAuth";
import type { UploadFile } from "antd/es/upload/interface";
import { ReviewFormData } from "@/types/review.types";
import { useProductReviews } from "@/hooks/useProductReviews";

interface Props {
  productId: string;
  onSuccess: () => void;
  onCancel?: () => void;
}

const WriteReview = ({ productId, onSuccess, onCancel }: Props) => {
  const [form] = Form.useForm();
  const { isAuthenticated, user } = useAuth();
  const {
    canReview,
    hasOrdered,
    hasReviewed,
    orderInfo,
    reviewRestrictionReason,
    isCheckingPermission,
    checkPermissionError,
    createReview,
    isCreating,
    createError,
  } = useProductReviews(productId);

  const [fileList, setFileList] = useState<UploadFile[]>([]);

  // Debug logging para identificar problemas
  useEffect(() => {
    console.log("WriteReview Debug Info:", {
      productId,
      isAuthenticated,
      user: user ? { id: user.id, name: user.name } : null,
      canReview,
      hasOrdered,
      hasReviewed,
      orderInfo,
      reviewRestrictionReason,
      isCheckingPermission,
      checkPermissionError: checkPermissionError?.message,
    });
  }, [
    productId,
    isAuthenticated,
    user,
    canReview,
    hasOrdered,
    hasReviewed,
    orderInfo,
    reviewRestrictionReason,
    isCheckingPermission,
    checkPermissionError,
  ]);

  const handleSubmit = async (values: any) => {
    if (!isAuthenticated || !canReview) {
      notification.error({
        message: "No autorizado",
        description: "No tienes permisos para calificar este producto",
      });
      return;
    }

    try {
      const reviewData: ReviewFormData = {
        rating: values.rating,
        title: values.title,
        content: values.content,
        images: fileList.map((file) => file.originFileObj as File),
        orderId: orderInfo?.orderId,
      };

      console.log("Enviando review:", reviewData);

      createReview(reviewData, {
        onSuccess: () => {
          notification.success({
            message: "Calificación enviada",
            description: "Tu calificación será revisada y publicada pronto",
          });

          form.resetFields();
          setFileList([]);
          onSuccess();
        },
        onError: (error: any) => {
          console.error("Error creating review:", error);
          notification.error({
            message: "Error",
            description: error?.message || "No se pudo enviar tu calificación",
          });
        },
      });
    } catch (error: any) {
      console.error("Error in handleSubmit:", error);
      notification.error({
        message: "Error",
        description: error?.message || "No se pudo enviar tu calificación",
      });
    }
  };

  // Mostrar loading mientras se verifica permisos
  if (isCheckingPermission) {
    return (
      <div className="text-center p-4 bg-gray-50 rounded-lg">
        <p>Verificando permisos...</p>
      </div>
    );
  }

  // Mostrar error si hubo problema verificando permisos
  if (checkPermissionError) {
    return (
      <div className="text-center p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">
          Error verificando permisos: {checkPermissionError.message}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 text-blue-600 underline"
        >
          Intentar de nuevo
        </button>
      </div>
    );
  }

  // Verificar si el usuario puede escribir review
  if (!isAuthenticated) {
    return (
      <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-blue-700">
          Debes <a href="/auth/login" className="underline">iniciar sesión</a> para calificar productos
        </p>
      </div>
    );
  }

  if (!canReview) {
    const getMessage = () => {
      if (hasReviewed) return "Ya has calificado este producto";
      if (!hasOrdered) return "Debes comprar este producto para calificarlo";
      return reviewRestrictionReason || "No puedes calificar este producto aún";
    };

    return (
      <div className="text-center p-4 bg-orange-50 border border-orange-200 rounded-lg">
        <p className="text-orange-700">{getMessage()}</p>
      </div>
    );
  }

  return (
    <div className="my-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold sm:text-start xl:text-2xl">
          Califica este producto
        </h2>
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        )}
      </div>

      {orderInfo && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700">
            ✅ Compra verificada - Orden: #{orderInfo.orderNumber}
          </p>
        </div>
      )}

      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item
          name="rating"
          label="Calificación"
          rules={[
            { required: true, message: "Por favor califica el producto" },
          ]}
        >
          <Rate />
        </Form.Item>

        <Form.Item
          name="title"
          label="Título"
          rules={[{ required: true, message: "Por favor ingresa un título" }]}
        >
          <Input placeholder="Título de tu calificación" />
        </Form.Item>

        <Form.Item
          name="content"
          label="Comentario"
          rules={[
            { required: true, message: "Por favor ingresa tu comentario" },
            { min: 20, message: "El comentario debe tener al menos 20 caracteres" },
          ]}
        >
          <Input.TextArea
            rows={4}
            placeholder="Cuéntanos tu experiencia con el producto..."
            showCount
            maxLength={2000}
          />
        </Form.Item>

        <Form.Item>
          <button
            type="submit"
            disabled={isCreating}
            className="bg-[#E2060F] transition-[background-color] duration-300 hover:bg-[#001529] text-white py-2 px-4 rounded-full font-semibold disabled:opacity-50"
          >
            {isCreating ? "Enviando..." : "Enviar calificación"}
          </button>
        </Form.Item>
      </Form>
    </div>
  );
};

export { WriteReview };
