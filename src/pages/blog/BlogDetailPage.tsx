import type React from "react";
import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Row,
  Col,
  Typography,
  Spin,
  Tag,
  Divider,
  Space,
  Avatar,
  Button,
  Empty,
  Card,
} from "antd";
import {
  CalendarOutlined,
  UserOutlined,
  TagOutlined,
  ArrowLeftOutlined,
  ShareAltOutlined,
  HeartOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { useBlogBySlug, useRelatedBlogs } from "@/hooks/useBlog.hooks";

const { Title, Text, Paragraph } = Typography;

const BlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading, error } = useBlogBySlug(slug || "");
  const { data: relatedPosts, isLoading: relatedLoading } = useRelatedBlogs(
    post?._id || "",
    3
  );

  useEffect(() => {
    if (post) {
      document.title = `${post.title} | Blog`;
    }
    window.scrollTo(0, 0);
  }, [post]);

  // Función para formatear la fecha en español
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("es-ES", options);
  };

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "100px 0",
          background: "#f5f5f5",
          minHeight: "100vh",
        }}
      >
        <Space direction="vertical" align="center">
          <Spin size="large" />
          <Text type="secondary">Cargando artículo...</Text>
        </Space>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div
        style={{
          padding: "100px 0",
          textAlign: "center",
          background: "#f5f5f5",
          minHeight: "100vh",
        }}
      >
        <Empty
          description="No se encontró la entrada del blog o ocurrió un error"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
        <Button type="primary" style={{ marginTop: 16 }}>
          <Link to="/blog">
            <ArrowLeftOutlined /> Volver al Blog
          </Link>
        </Button>
      </div>
    );
  }

  // Función para formatear el contenido con párrafos y encabezados adecuados
  const formatContent = (content: string) => {
    if (!content) return null;

    const paragraphs = content.split("\n\n");

    return paragraphs.map((paragraph, index) => {
      // Si el párrafo está vacío, devolver un espacio
      if (!paragraph.trim()) {
        return <div key={`empty-${index}`} style={{ height: "1rem" }} />;
      }

      // Si el párrafo parece un encabezado (termina con un salto de línea)
      if (paragraph.includes("\n") && !paragraph.startsWith(" ")) {
        const [heading, ...rest] = paragraph.split("\n");
        return (
          <div key={index}>
            <Title
              level={3}
              style={{ marginTop: 24, marginBottom: 16, fontWeight: 500 }}
            >
              {heading}
            </Title>
            {rest.map((p, i) => (
              <Paragraph
                key={`${index}-${i}`}
                style={{ fontSize: "16px", lineHeight: 1.8, marginBottom: 16 }}
              >
                {p}
              </Paragraph>
            ))}
          </div>
        );
      }

      // Párrafo normal
      return (
        <Paragraph
          key={index}
          style={{ fontSize: "16px", lineHeight: 1.8, marginBottom: 16 }}
        >
          {paragraph}
        </Paragraph>
      );
    });
  };

  return (
    <div
      className="blog-detail-container"
      style={{
        background: "#f5f5f5",
        minHeight: "100vh",
        paddingBottom: 40,
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 20px",
        }}
      >
        <div style={{ padding: "16px 0" }}>
          <Link to="/blog">
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              style={{
                color: "#1890ff",
                fontWeight: 500,
                padding: "4px 0",
                height: "auto",
              }}
            >
              Volver al Blog
            </Button>
          </Link>
        </div>

        {post.featuredImage && (
          <div style={{ marginBottom: 24 }}>
            <img
              src={post.featuredImage || "/placeholder.svg"}
              alt={post.title}
              style={{
                width: "100%",
                height: "auto",
                maxHeight: "500px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
          </div>
        )}

        <Card
          bordered={false}
          style={{
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
          }}
        >
          <div style={{ padding: "8px 0" }}>
            <Row gutter={[16, 16]}>
              <Col xs={24}>
                <div style={{ marginBottom: 16 }}>
                  {post.categories?.map((category) => (
                    <Tag
                      color="#1890ff"
                      key={category._id}
                      style={{
                        marginRight: 8,
                        borderRadius: "2px",
                      }}
                    >
                      {category.name}
                    </Tag>
                  ))}
                </div>

                <Title
                  level={1}
                  style={{
                    marginBottom: 16,
                    fontSize: "32px",
                    fontWeight: 600,
                    lineHeight: 1.3,
                  }}
                >
                  {post.title}
                </Title>

                <Space size={16} wrap style={{ marginBottom: 16 }}>
                  <Space>
                    <Avatar
                      size="small"
                      icon={<UserOutlined />}
                      src={post.author?.avatar}
                      style={{ backgroundColor: "#1890ff" }}
                    />
                    <Text style={{ color: "#666" }}>
                      {post.author?.name || "Autor desconocido"}
                    </Text>
                  </Space>

                  <Space>
                    <CalendarOutlined style={{ color: "#666" }} />
                    <Text style={{ color: "#666" }}>
                      {formatDate(post.createdAt)}
                    </Text>
                  </Space>
                </Space>

                <Divider style={{ margin: "16px 0" }} />

                <div
                  style={{
                    background: "#f9f9f9",
                    padding: "16px",
                    borderRadius: "4px",
                    borderLeft: "4px solid #1890ff",
                    marginBottom: 24,
                  }}
                >
                  <Paragraph
                    style={{
                      fontSize: "16px",
                      fontStyle: "italic",
                      color: "#595959",
                      margin: 0,
                    }}
                  >
                    {post.excerpt}
                  </Paragraph>
                </div>

                <div className="blog-content">
                  {formatContent(post.content)}
                </div>

                <Divider style={{ margin: "24px 0" }} />

                <div className="blog-footer">
                  <Row justify="space-between" align="middle" gutter={[16, 16]}>
                    <Col xs={24} sm={12}>
                      <div>
                        <Text strong style={{ marginRight: 8 }}>
                          Etiquetas:
                        </Text>
                        {post.tags?.map((tag) => (
                          <Tag
                            key={tag._id}
                            style={{
                              marginBottom: 4,
                              borderRadius: "2px",
                              background: "#f0f5ff",
                              color: "#1890ff",
                              border: "1px solid #d6e4ff",
                            }}
                          >
                            <TagOutlined /> {tag.name}
                          </Tag>
                        ))}
                      </div>
                    </Col>
                    <Col xs={24} sm={12} style={{ textAlign: "right" }}>
                      <Space>
                        <Button type="primary" icon={<HeartOutlined />}>
                          Me gusta
                        </Button>
                        <Button type="primary" icon={<ShareAltOutlined />}>
                          Compartir
                        </Button>
                        <Button type="primary" icon={<MessageOutlined />}>
                          Comentar
                        </Button>
                      </Space>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          </div>
        </Card>

        {relatedPosts && relatedPosts.length > 0 && (
          <div className="related-posts" style={{ marginTop: 32 }}>
            <Card
              bordered={false}
              style={{
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
              }}
            >
              <Title level={3} style={{ marginBottom: 24, fontWeight: 500 }}>
                Artículos relacionados
              </Title>
              <Row gutter={[24, 24]}>
                {relatedLoading ? (
                  <Col span={24} style={{ textAlign: "center" }}>
                    <Spin />
                  </Col>
                ) : (
                  relatedPosts.map((relatedPost) => (
                    <Col xs={24} sm={8} key={relatedPost._id}>
                      <Link
                        to={`/blog/${relatedPost.slug}`}
                        style={{ textDecoration: "none" }}
                      >
                        <Card
                          hoverable
                          className="blog-card"
                          cover={
                            relatedPost.featuredImage ? (
                              <img
                                alt={relatedPost.title}
                                src={
                                  relatedPost.featuredImage ||
                                  "/placeholder.svg"
                                }
                                style={{
                                  height: 150,
                                  objectFit: "cover",
                                  transition: "transform 0.3s ease",
                                }}
                              />
                            ) : (
                              <div
                                style={{
                                  height: 150,
                                  background: "#f5f5f5",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <Text type="secondary">Sin imagen</Text>
                              </div>
                            )
                          }
                          style={{ height: "100%" }}
                        >
                          <Title level={5} ellipsis={{ rows: 2 }}>
                            {relatedPost.title}
                          </Title>
                          <Text type="secondary" ellipsis={{ rows: 2 }}>
                            {relatedPost.excerpt}
                          </Text>
                        </Card>
                      </Link>
                    </Col>
                  ))
                )}
              </Row>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogDetailPage;
