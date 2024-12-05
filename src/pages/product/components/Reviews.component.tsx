// components/Reviews/ReviewsProduct.tsx
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from 'antd';
import { useProductReviews } from '@/hooks/useProductReviews';
import { ReviewsList } from '@/components/reviews/ReviewsList';
import { WriteReview } from '@/components/reviews/WriteReview';
import CountReview from '@/pages/store/components/CountReview.component';


const ReviewsProduct = () => {
    const { id: productId } = useParams();
    const [isWritingReview, setIsWritingReview] = useState(false);
    const { canReview, stats } = useProductReviews(productId || '');

    if (!productId) {
        return null;
    }

    return (
        <div className="flex flex-col gap-2 mb-4 bg-white p-4 rounded-xl xl:px-10 xl:py-6">
            {/* Encabezado con resumen de reseñas */}
            <section className="w-full flex flex-col items-center gap-2 border-b border-b-gray-300 pb-4 sm:flex-row sm:justify-between">
                <div>
                    <h2 className="text-lg font-bold text-center sm:text-start xl:text-2xl">
                        Comentarios de clientes
                    </h2>
                    <div className="flex items-center gap-2">
                        <CountReview />
                        {stats?.totalReviews > 0 && (
                            <span className="text-sm text-gray-500">
                                · {stats.verifiedPurchases} compras verificadas
                            </span>
                        )}
                    </div>
                </div>

                {/* Botón para escribir reseña */}
                {!isWritingReview && canReview && (
                    <Button
                        type="primary"
                        className="bg-[#E2060F] hover:bg-[#001529] transition-[background-color] duration-300"
                        onClick={() => setIsWritingReview(true)}
                    >
                        Escribir una reseña
                    </Button>
                )}
            </section>

            {/* Formulario para escribir reseña */}
            {isWritingReview && (
                <WriteReview 
                    productId={productId}
                    onSuccess={() => {
                        setIsWritingReview(false);
                    }} 
                />
            )}

            {/* Filtros y ordenamiento */}
            <section className="flex justify-between items-center py-4">
                <div className="flex gap-2">
                    <Button type="text">Todas</Button>
                    <Button type="text">Positivas</Button>
                    <Button type="text">Críticas</Button>
                    <Button type="text">Con fotos</Button>
                </div>
                <select className="border rounded-md px-2 py-1">
                    <option value="recent">Más recientes</option>
                    <option value="helpful">Más útiles</option>
                    <option value="rating-high">Mayor calificación</option>
                    <option value="rating-low">Menor calificación</option>
                </select>
            </section>

            {/* Lista de reseñas */}
            <section className="mt-4">
                <ReviewsList productId={productId} />
            </section>

            {/* Paginación y más reseñas */}
            {stats?.totalReviews > 10 && (
                <div className="flex justify-center mt-6">
                    <Button type="primary" ghost>
                        Cargar más reseñas
                    </Button>
                </div>
            )}

            {/* Información sobre moderación */}
            <p className="text-sm text-gray-500 text-center mt-4">
                Las reseñas son moderadas para asegurar la calidad y autenticidad
            </p>
        </div>
    );
};

export default ReviewsProduct;