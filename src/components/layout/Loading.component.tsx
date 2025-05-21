import { Spin } from "antd";

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <Spin size="large" tip="Cargando..." />
    </div>
  );
};

export default Loading; 