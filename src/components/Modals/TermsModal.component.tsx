// src/components/Modals/TermsModal.component.tsx

import { Modal } from "antd";

interface Props {
  open: boolean;
  onAccept: () => void;
}

const TermsModal = ({ open, onAccept }: Props) => {
  const handleCancel = () => {};

  return (
    <Modal
      title={<h2 className="text-lg font-medium">Términos y Condiciones</h2>}
      open={open}
      onOk={onAccept}
      onCancel={handleCancel}
      cancelButtonProps={{ style: { display: "none" } }}
      closable={false}
      maskClosable={false}
      okText="Aceptar"
      okButtonProps={{
        className: "bg-primary hover:bg-primary/90 text-white w-full",
      }}
      className="max-w-md"
      bodyStyle={{ padding: "16px" }}
      centered
    >
      {/* Content stays the same */}
      <div className="space-y-5 text-sm">
        <div>
          <h3 className="font-medium mb-1">Bienvenido a Punto Koreano</h3>
        </div>
        <div>
          <h4 className="font-medium text-sm mb-1">Uso de Cookies</h4>
          <p className="text-gray-500 text-xs leading-relaxed">
            Utilizamos cookies y tecnologías similares para mejorar su
            experiencia en nuestro sitio web. Estas nos permiten recordar sus
            preferencias y personalizar el contenido.
          </p>
        </div>
        <div className="border-t border-gray-100 pt-4">
          <h4 className="font-medium text-sm mb-1">Política de Privacidad</h4>
          <p className="text-gray-500 text-xs leading-relaxed">
            Nos comprometemos a proteger su privacidad y a manejar sus datos
            personales de manera segura. La información recopilada se utiliza
            únicamente para mejorar nuestros servicios.
          </p>
        </div>
        <div className="border-t border-gray-100 pt-4">
          <h4 className="font-medium text-sm mb-1">Términos de Uso</h4>
          <p className="text-gray-500 text-xs leading-relaxed">
            Al utilizar nuestro sitio web, usted acepta cumplir con nuestros
            términos y condiciones, incluyendo el uso apropiado de servicios y
            el respeto a los derechos de propiedad intelectual.
          </p>
        </div>
        <p className="text-xs text-gray-400 mt-4 italic">
          Al hacer clic en "Aceptar", confirma que está de acuerdo con nuestros
          términos y condiciones.
        </p>
      </div>
    </Modal>
  );
};

export default TermsModal;
