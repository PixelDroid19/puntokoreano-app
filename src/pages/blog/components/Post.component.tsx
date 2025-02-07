import { useParams } from "react-router-dom";
import {
  LoadingOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  UserOutlined,
  CalendarOutlined,
  TagOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import { useArticleDetail } from "@/hooks/useBlog";
import { Typography, Card, Tag, Breadcrumb } from "antd";
import "./Post.component.css";
const { Title, Text } = Typography;

const BlogPost = () => {
  const { slug } = useParams();
  const { data: response, isLoading, isError } = useArticleDetail(slug || "");

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingOutlined className="text-4xl" />
      </div>
    );
  }

  if (isError || !response?.data) {
    return <div>Error cargando el artículo</div>;
  }

  const article = response.data;

  const formatTime = (time: { value: number; unit: string }) => {
    if (time.unit === "minutes" && time.value >= 60) {
      const hours = Math.floor(time.value / 60);
      const minutes = time.value % 60;
      return `${hours} hora${hours > 1 ? "s" : ""}${
        minutes > 0 ? ` ${minutes} minutos` : ""
      }`;
    }
    return `${time.value} ${time.unit === "minutes" ? "minutos" : "horas"}`;
  };

  const getDifficultyColor = (level: string) => {
    const colors: Record<string, string> = {
      beginner: "success",
      intermediate: "warning",
      advanced: "error",
    };
    return colors[level] || "default";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Breadcrumb Navigation */}
        <Breadcrumb className="mb-6">
          <Breadcrumb.Item>Blog</Breadcrumb.Item>
          <Breadcrumb.Item>{article.vehicle.brand}</Breadcrumb.Item>
          <Breadcrumb.Item>{article.vehicle.model}</Breadcrumb.Item>
        </Breadcrumb>

        <article className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Hero Image */}
          <div className="relative h-[400px]">
            <img
              src={article.featured_image}
              alt={article.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
              <Title level={1} className="text-white m-0">
                {article.title}
              </Title>
              <div className="flex gap-4 text-white/80 mt-2">
                <span className="flex items-center gap-1">
                  <UserOutlined /> {article.author}
                </span>
                <span className="flex items-center gap-1">
                  <CalendarOutlined />
                  {new Date(article.date).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <EyeOutlined /> {article.views} visitas
                </span>
              </div>
            </div>
          </div>

          {/* Vehicle Info */}
          <div className="p-6 bg-gray-50 border-b">
            <div className="flex items-center gap-4">
              <img
                src={`/logos/${article.vehicle.brand.toLowerCase()}.png`}
                alt={`Logo ${article.vehicle.brand}`}
                className="h-12 w-auto"
              />
              <div>
                <Text className="text-lg font-medium">
                  {article.vehicle.brand} {article.vehicle.model}
                </Text>
                <Text className="block text-gray-500">
                  {article.vehicle.year}
                </Text>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Technical Information */}
            <Card className="mt-8 bg-gray-50">
              <Title level={3}>
                <ToolOutlined className="mr-2" />
                Información Técnica
              </Title>
              <div className="grid md:grid-cols-3 gap-6 mt-4">
                <div>
                  <Text type="secondary">Tipo de mantenimiento</Text>
                  <Tag color="blue" className="mt-1 text-base capitalize">
                    {article.maintenance_type}
                  </Tag>
                </div>
                <div>
                  <Text type="secondary">Nivel de dificultad</Text>
                  <Tag
                    color={getDifficultyColor(article.difficulty_level)}
                    className="mt-1 text-base capitalize"
                  >
                    {article.difficulty_level}
                  </Tag>
                </div>
                <div>
                  <Text type="secondary">Tiempo estimado</Text>
                  <div className="flex items-center gap-2 mt-1">
                    <ClockCircleOutlined />
                    <Text>{formatTime(article.estimated_time)}</Text>
                  </div>
                </div>
              </div>
            </Card>

            {/* Tags */}
            <div className="mt-8">
              <Title level={4} className="flex items-center gap-2">
                <TagOutlined /> Etiquetas relacionadas
              </Title>
              <div className="flex flex-wrap gap-2 mt-4">
                {[
                  article.vehicle.brand,
                  article.vehicle.model,
                  article.maintenance_type,
                  article.difficulty_level,
                ].map((tag, index) => (
                  <Tag
                    key={index}
                    className="px-4 py-1 text-sm cursor-pointer hover:bg-blue-50"
                  >
                    {tag}
                  </Tag>
                ))}
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogPost;
