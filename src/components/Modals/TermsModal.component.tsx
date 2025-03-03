import { Modal } from "antd";
import { useEffect, useState } from "react";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const TermsModal = ({ open, setOpen }: Props) => {
  const [hasAccepted, setHasAccepted] = useState<boolean>(false);

  useEffect(() => {
    const accepted = localStorage.getItem("termsAccepted");
    if (accepted) {
      setHasAccepted(true);
      setOpen(false);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("termsAccepted", "true");
    setHasAccepted(true);
    setOpen(false);
  };

  return (
    <Modal
      title="Términos y Condiciones"
      open={open && !hasAccepted}
      onOk={handleAccept}
      onCancel={() => {}}
      cancelButtonProps={{ style: { display: 'none' } }}
      closable={false}
      maskClosable={false}
      okText="Aceptar"
      className="terms-modal"
    >
      <div className="terms-content">
        <h3 className="text-lg font-semibold mb-4">Bienvenido a Punto Koreano</h3>
        
        <section className="mb-6">
          <h4 className="font-semibold mb-2">Uso de Cookies</h4>
          <p className="text-gray-600 mb-4">
            Utilizamos cookies y tecnologías similares para mejorar su experiencia en nuestro sitio web. 
            Estas nos permiten recordar sus preferencias, entender cómo utiliza nuestro sitio y personalizar 
            el contenido que le mostramos.
          </p>
        </section>

        <section className="mb-6">
          <h4 className="font-semibold mb-2">Política de Privacidad</h4>
          <p className="text-gray-600 mb-4">
            Nos comprometemos a proteger su privacidad y a manejar sus datos personales de manera segura y 
            responsable. La información que recopilamos se utiliza únicamente para mejorar nuestros servicios 
            y su experiencia de compra.
          </p>
        </section>

        <section className="mb-6">
          <h4 className="font-semibold mb-2">Términos de Uso</h4>
          <p className="text-gray-600 mb-4">
            Al utilizar nuestro sitio web, usted acepta cumplir con nuestros términos y condiciones. 
            Esto incluye el uso apropiado de nuestros servicios, el respeto a los derechos de propiedad 
            intelectual y el cumplimiento de las leyes aplicables.
          </p>
        </section>

        <p className="text-sm text-gray-500 mt-4">
          Al hacer clic en "Aceptar", usted confirma que ha leído y está de acuerdo con nuestros términos 
          y condiciones, política de privacidad y uso de cookies.
        </p>
      </div>
    </Modal>
  );
};

export default TermsModal;