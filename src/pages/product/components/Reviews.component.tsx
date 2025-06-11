// components/Reviews/ReviewsProduct.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Select, Space, Tag } from "antd"; // Importa Select, Space y Tag de Ant Design
import { useProductReviews } from "@/hooks/useProductReviews";
import { ReviewsList } from "@/components/reviews/ReviewsList";
import { WriteReview } from "@/components/reviews/WriteReview";
import CountReview from "@/pages/store/components/CountReview.component";
import { StarFilled, StarOutlined } from "@ant-design/icons"; // Importa iconos de estrellas
import cn from "classnames"; // Importa classnames para clases condicionales

const ReviewsProduct = () => {
  const { id: productId } = useParams();
  const [isWritingReview, setIsWritingReview] = useState(false);
  const {
    canReview,
    isCheckingPermission,
    checkPermissionError,
    hasOrdered,
    hasReviewed,
    reviewRestrictionReason,
    stats,
  } = useProductReviews(productId || "");
  const [filterType, setFilterType] = useState<string | null>("all"); // Estado para el tipo de filtro
  const [sortType, setSortType] = useState<string>("recent"); // Estado para el tipo de ordenamiento
  
  // Debug logging
  useEffect(() => {
    console.log("Reviews.component debug:", {
      productId,
      canReview,
      isCheckingPermission,
      checkPermissionError: checkPermissionError?.message,
      hasOrdered,
      hasReviewed,
      reviewRestrictionReason,
    });
  }, [productId, canReview, isCheckingPermission, checkPermissionError, hasOrdered, hasReviewed, reviewRestrictionReason]);

  if (!productId) {
    return null;
  }

  const handleFilterChange = (value: string | null) => {
    setFilterType(value);
  };

  const handleSortChange = (value: string) => {
    setSortType(value);
  };

  const filterButtonClasses = (type: string) =>
    cn("rounded-md px-3 py-1.5 font-medium transition-colors duration-200", {
      "bg-gray-100 hover:bg-gray-200": filterType !== type,
      "bg-blue-500 text-white hover:bg-blue-600": filterType === type,
    });

  if (isCheckingPermission) {
    return <div>Verificando permisos...</div>;
  }

  if (checkPermissionError) {
    return (
      <div>Error al verificar permisos: {checkPermissionError.message}</div>
    );
  }

  const renderReviewButton = () => {
    if (!isWritingReview && canReview) {
      return (
        <Button
          type="primary"
          className="bg-[#E2060F] hover:bg-[#B7050B] active:bg-[#E2060F] transition-colors duration-200 font-medium"
          onClick={() => setIsWritingReview(true)}
        >
          <StarOutlined /> Escribir reseña
        </Button>
      );
    }

    if (hasReviewed) {
      return <Tag color="blue">Ya has escrito una reseña</Tag>;
    }

    if (!hasOrdered) {
      return (
        <Tag color="orange">
          Debes comprar el producto para escribir una reseña
        </Tag>
      );
    }

    if (reviewRestrictionReason) {
      return <Tag color="red">{reviewRestrictionReason}</Tag>;
    }

    return null;
  };

  return (
    <div className="flex flex-col gap-6 mb-8 bg-white p-6 rounded-xl shadow-md">
      {" "}
      {/* Mayor padding y shadow */}
      {/* Encabezado con resumen de reseñas */}
      <section className="w-full flex flex-col items-center gap-4 pb-6 border-b border-b-gray-200 sm:flex-row sm:justify-between">
        {" "}
        {/* Mayor gap y borde más claro */}
        <div className="flex flex-col items-center sm:items-start gap-1">
          {" "}
          {/* Menor gap interno */}
          <h2 className="text-xl font-semibold text-gray-800 text-center sm:text-start xl:text-2xl">
            {" "}
            {/* Texto más oscuro y semibold */}
            Comentarios de clientes
          </h2>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            {" "}
            {/* Texto más oscuro */}
            <CountReview />
            {stats?.totalReviews > 0 && (
              <>
                <span className="text-gray-400">•</span>{" "}
                {/* Separador visual */}
                {stats.verifiedPurchases > 0 ? (
                  <Tag color="green">
                    Compra Verificada: {stats.verifiedPurchases}
                  </Tag> // Tag para compras verificadas
                ) : (
                  <span>{stats.verifiedPurchases} compras verificadas</span> // Muestra 0 compras verificadas como texto normal
                )}
              </>
            )}
          </div>
        </div>
        {/* Botón para escribir reseña */}
        {renderReviewButton()}
      </section>
      {/* Formulario para escribir reseña */}
      {isWritingReview && (
        <div className="py-4">
          {" "}
          {/* Añade un poco de padding superior e inferior */}
          <WriteReview
            productId={productId}
            onSuccess={() => {
              setIsWritingReview(false);
            }}
            onCancel={() => setIsWritingReview(false)} // Añade función onCancel
          />
        </div>
      )}
      {/* Filtros y ordenamiento */}
      <section className="flex justify-between items-center py-3">
        {" "}
        {/* Menos padding vertical */}
        <div className="flex gap-2">
          <button
            className={filterButtonClasses("all")}
            onClick={() => handleFilterChange("all")}
          >
            Todas
          </button>
          <button
            className={filterButtonClasses("positive")}
            onClick={() => handleFilterChange("positive")}
          >
            Positivas
          </button>
          <button
            className={filterButtonClasses("critical")}
            onClick={() => handleFilterChange("critical")}
          >
            Críticas
          </button>
          <button
            className={filterButtonClasses("withPhotos")}
            onClick={() => handleFilterChange("withPhotos")}
          >
            Con fotos
          </button>
        </div>
        <Select
          defaultValue="recent"
          value={sortType}
          onChange={handleSortChange}
          className="w-36" // Ancho fijo para el Select
        >
          <Select.Option value="recent">Más recientes</Select.Option>
          <Select.Option value="helpful">Más útiles</Select.Option>
          <Select.Option value="rating-high">Mayor calificación</Select.Option>
          <Select.Option value="rating-low">Menor calificación</Select.Option>
        </Select>
      </section>
      {/* Lista de reseñas */}
      <section className="mt-2">
        {" "}
        {/* Menos margen superior */}
        <ReviewsList
          productId={productId}
          // filterType={filterType}
          // sortType={sortType}
        />{" "}
        {/* Pasa filterType y sortType */}
      </section>
      {/* Paginación y más reseñas */}
      {stats?.totalReviews > 10 && (
        <div className="flex justify-center mt-5">
          {" "}
          {/* Menos margen superior */}
          <Button type="primary" ghost className="font-medium">
            {" "}
            {/* font-medium */}
            Cargar más reseñas
          </Button>
        </div>
      )}
      {/* Información sobre moderación */}
      <p className="text-sm text-gray-500 text-center mt-3">
        {" "}
        {/* Menos margen superior */}
        Las reseñas son moderadas para asegurar la calidad y autenticidad.
      </p>
    </div>
  );
};

export default ReviewsProduct;
