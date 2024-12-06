// services/NotificationService.ts
import ENDPOINTS from '@/api';
import axios from 'axios';

class NotificationService {
  private readonly BASE_URL = ENDPOINTS.NOTIFICATIONS.GET_ALL.url;

  // Enviar notificación de review aprobado
  async sendReviewApprovedNotification(userId: string, reviewId: string) {
    try {
      await axios.post(`${this.BASE_URL}/send`, {
        type: 'REVIEW_APPROVED',
        user: userId,
        data: {
          reviewId,
          message: 'Tu calificación ha sido aprobada y ya está visible en el producto.'
        }
      });
    } catch (error) {
      console.error('Error sending review approved notification:', error);
      throw error;
    }
  }

  // Enviar notificación de review rechazado
  async sendReviewRejectedNotification(
    userId: string,
    reviewId: string,
    moderationNote: string
  ) {
    try {
      await axios.post(`${this.BASE_URL}/send`, {
        type: 'REVIEW_REJECTED',
        user: userId,
        data: {
          reviewId,
          moderationNote,
          message: 'Tu calificación no ha sido aprobada.'
        },
        priority: 'high'
      });
    } catch (error) {
      console.error('Error sending review rejected notification:', error);
      throw error;
    }
  }

  // Enviar notificación de que ya puede calificar un producto
  async sendCanReviewNotification(userId: string, orderId: string, productId: string) {
    try {
      await axios.post(`${this.BASE_URL}/send`, {
        type: 'CAN_REVIEW_PRODUCT',
        user: userId,
        data: {
          orderId,
          productId,
          message: '¡Ya puedes calificar tu compra! Tu opinión es importante para nosotros.'
        }
      });
    } catch (error) {
      console.error('Error sending can review notification:', error);
      throw error;
    }
  }
}

export const notificationService = new NotificationService();