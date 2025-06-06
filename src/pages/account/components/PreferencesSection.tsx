import { useState, useEffect } from "react";
import { Card, Switch, Button, Select, Form, notification, Divider, Alert } from "antd";
import { MailOutlined, BellOutlined, GlobalOutlined, BgColorsOutlined } from "@ant-design/icons";
import { useAuthStore } from "@/store/auth.store";
import { apiPatch, apiPost, ENDPOINTS } from "@/api/apiClient";

interface Preferences {
  notifications: boolean;
  newsletter: boolean;
  marketing_emails: boolean;
  order_updates: {
    email: boolean;
    sms: boolean;
  };
  theme: "light" | "dark";
  language: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
  code?: string;
}

const { Option } = Select;

const PreferencesSection = () => {
  const { user, updateUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState<Preferences>({
    notifications: user?.preferences?.notifications || true,
    newsletter: user?.preferences?.newsletter || false,
    marketing_emails: false,
    order_updates: {
      email: true,
      sms: false,
    },
    theme: user?.preferences?.theme || "light",
    language: user?.preferences?.language || "es",
  });
  const [emailVerified, setEmailVerified] = useState(user?.verified || false);
  const [phoneVerified, setPhoneVerified] = useState(false);

  useEffect(() => {
    // Sync with user preferences when user data changes
    if (user?.preferences) {
      setPreferences({
        notifications: user.preferences.notifications,
        newsletter: user.preferences.newsletter,
        marketing_emails: false,
        order_updates: {
          email: true,
          sms: false,
        },
        theme: user.preferences.theme || "light",
        language: user.preferences.language || "es",
      });
    }
  }, [user]);

  const handlePreferenceChange = (key: string, value: any) => {
    setPreferences(prev => {
      if (key.includes('.')) {
        const [parentKey, childKey] = key.split('.');
        return {
          ...prev,
          [parentKey]: {
            ...prev[parentKey as keyof Preferences] as any,
            [childKey]: value,
          },
        };
      }
      return {
        ...prev,
        [key]: value,
      };
    });
  };

  const handleSavePreferences = async () => {
    setLoading(true);
    try {
      const response = await apiPatch<ApiResponse<any>>(
        ENDPOINTS.USER.UPDATE_PREFERENCES,
        preferences
      );

      if (response.success) {
        // Update the user in the auth store
        updateUser({
          ...user!,
          preferences: {
            ...user!.preferences,
            ...preferences,
          },
        });

        notification.success({
          message: "Preferencias actualizadas",
          description: "Tus preferencias han sido guardadas correctamente.",
        });
      }
    } catch (error: any) {
      console.error("Error al actualizar preferencias:", error);
      notification.error({
        message: "Error al actualizar preferencias",
        description: error.response?.data?.message || "No se pudieron guardar las preferencias",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmail = async () => {
    try {
      await apiPost(ENDPOINTS.USER.RESEND_EMAIL_VERIFICATION, {});
      notification.success({
        message: "Correo de verificación enviado",
        description: "Revisa tu bandeja de entrada para verificar tu correo electrónico.",
      });
    } catch (error: any) {
      notification.error({
        message: "Error",
        description: "No se pudo enviar el correo de verificación",
      });
    }
  };

  return (
    <div className="w-full space-y-6">
      <Card title="Verificación de cuenta" className="w-full">
        {!emailVerified && (
          <Alert
            message="Correo electrónico no verificado"
            description="Para mayor seguridad, verifica tu correo electrónico."
            type="warning"
            showIcon
            action={
              <Button size="small" onClick={handleVerifyEmail}>
                Enviar verificación
              </Button>
            }
            className="mb-4"
          />
        )}
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MailOutlined />
              <span>Correo electrónico: {user?.email}</span>
            </div>
            <span className={`px-2 py-1 rounded text-sm ${
              emailVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {emailVerified ? 'Verificado' : 'Pendiente'}
            </span>
          </div>
          
          {user?.phone && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span>📱</span>
                <span>Teléfono: {user.phone}</span>
              </div>
              <span className={`px-2 py-1 rounded text-sm ${
                phoneVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {phoneVerified ? 'Verificado' : 'Pendiente'}
              </span>
            </div>
          )}
        </div>
      </Card>

      <Card title="Notificaciones" className="w-full">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BellOutlined />
              <div>
                <div className="font-semibold">Notificaciones generales</div>
                <div className="text-sm text-gray-500">
                  Recibir notificaciones sobre actualizaciones de pedidos y promociones
                </div>
              </div>
            </div>
            <Switch
              checked={preferences.notifications}
              onChange={(checked) => handlePreferenceChange('notifications', checked)}
            />
          </div>

          <Divider />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MailOutlined />
              <div>
                <div className="font-semibold">Newsletter</div>
                <div className="text-sm text-gray-500">
                  Recibir noticias y promociones especiales por email
                </div>
              </div>
            </div>
            <Switch
              checked={preferences.newsletter}
              onChange={(checked) => handlePreferenceChange('newsletter', checked)}
            />
          </div>

          <Divider />

          <div className="space-y-3">
            <h4 className="font-semibold">Actualizaciones de pedidos</h4>
            
            <div className="flex items-center justify-between pl-4">
              <div>
                <div className="font-medium">Por correo electrónico</div>
                <div className="text-sm text-gray-500">
                  Notificaciones de estado de pedidos por email
                </div>
              </div>
              <Switch
                checked={preferences.order_updates.email}
                onChange={(checked) => handlePreferenceChange('order_updates.email', checked)}
              />
            </div>

            <div className="flex items-center justify-between pl-4">
              <div>
                <div className="font-medium">Por SMS</div>
                <div className="text-sm text-gray-500">
                  Notificaciones de estado de pedidos por SMS
                </div>
              </div>
              <Switch
                checked={preferences.order_updates.sms}
                onChange={(checked) => handlePreferenceChange('order_updates.sms', checked)}
                disabled={!phoneVerified}
              />
            </div>
          </div>
        </div>
      </Card>

   {/*    <Card title="Apariencia y idioma" className="w-full">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BgColorsOutlined />
              <div>
                <div className="font-semibold">Tema</div>
                <div className="text-sm text-gray-500">
                  Selecciona el tema de la interfaz
                </div>
              </div>
            </div>
            <Select
              value={preferences.theme}
              onChange={(value) => handlePreferenceChange('theme', value)}
              style={{ width: 120 }}
            >
              <Option value="light">Claro</Option>
              <Option value="dark">Oscuro</Option>
            </Select>
          </div>

          <Divider />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GlobalOutlined />
              <div>
                <div className="font-semibold">Idioma</div>
                <div className="text-sm text-gray-500">
                  Idioma de la interfaz
                </div>
              </div>
            </div>
            <Select
              value={preferences.language}
              onChange={(value) => handlePreferenceChange('language', value)}
              style={{ width: 120 }}
            >
              <Option value="es">Español</Option>
              <Option value="en">English</Option>
            </Select>
          </div>
        </div>
      </Card>
 */}
      <div className="flex justify-end">
        <Button
          type="primary"
          loading={loading}
          onClick={handleSavePreferences}
          className="bg-[#E2060F] hover:bg-[#001529]"
          size="large"
        >
          Guardar preferencias
        </Button>
      </div>
    </div>
  );
};

export default PreferencesSection; 