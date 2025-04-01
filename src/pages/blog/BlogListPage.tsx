import type React from "react";
import { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Typography,
  Pagination,
  Spin,
  Empty,
  Tag,
  Input,
  Select,
} from "antd";
import {
  SearchOutlined,
  TagOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import {
  usePublishedBlogs,
  usePublicBlogCategories,
  usePublicBlogTags,
} from "@/hooks/useBlog.hooks";
import { Link } from "react-router-dom";
import { useBlogStore } from "@/store/blog.store";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const BlogListPage: React.FC = () => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 9,
    search: "",
    category: "",
    tag: "",
    sort: "createdAt",
    sortOrder: "desc",
  });

  const { setBlogFilters } = useBlogStore();
  const { data, isLoading, error } = usePublishedBlogs(filters);
  const { data: categories, isLoading: categoriesLoading } =
    usePublicBlogCategories();
  const { data: tags, isLoading: tagsLoading } = usePublicBlogTags();

  useEffect(() => {
    setBlogFilters(filters);
  }, [filters, setBlogFilters]);

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
    window.scrollTo(0, 0);
  };

  const handleSearch = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value, page: 1 }));
  };

  const handleCategoryChange = (value: string) => {
    setFilters((prev) => ({ ...prev, category: value, page: 1 }));
  };

  const handleTagChange = (value: string) => {
    setFilters((prev) => ({ ...prev, tag: value, page: 1 }));
  };

  const handleSortChange = (value: string) => {
    const [sort, sortOrder] = value.split("-");
    setFilters((prev) => ({ ...prev, sort, sortOrder, page: 1 }));
  };

  if (error) {
    return (
      <div className="error-container">
        <Empty
          description="Error al cargar las entradas del blog. Por favor, inténtalo de nuevo más tarde."
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </div>
    );
  }

  return (
    <div className="blog-list-container" style={{ padding: "24px" }}>
      <Title level={2} style={{ textAlign: "center", marginBottom: "40px" }}>
        Nuestro Blog
      </Title>

      <Row gutter={[24, 24]} style={{ marginBottom: "32px" }}>
        <Col xs={24} md={8}>
          <Input
            placeholder="Buscar artículos..."
            prefix={<SearchOutlined />}
            allowClear
            onChange={(e) => handleSearch(e.target.value)}
            size="large"
          />
        </Col>
        <Col xs={24} md={6}>
          <Select
            placeholder="Filtrar por Categoría"
            style={{ width: "100%" }}
            onChange={handleCategoryChange}
            loading={categoriesLoading}
            allowClear
            size="large"
          >
            {categories?.map((category) => (
              <Option key={category._id} value={category._id}>
                <AppstoreOutlined /> {category.name}
              </Option>
            ))}
          </Select>
        </Col>
        <Col xs={24} md={6}>
          <Select
            placeholder="Filtrar por Etiqueta"
            style={{ width: "100%" }}
            onChange={handleTagChange}
            loading={tagsLoading}
            allowClear
            size="large"
          >
            {tags?.map((tag) => (
              <Option key={tag._id} value={tag._id}>
                <TagOutlined /> {tag.name}
              </Option>
            ))}
          </Select>
        </Col>
        <Col xs={24} md={4}>
          <Select
            placeholder="Ordenar por"
            style={{ width: "100%" }}
            onChange={handleSortChange}
            defaultValue="createdAt-desc"
            size="large"
          >
            <Option value="createdAt-desc">Más recientes primero</Option>
            <Option value="createdAt-asc">Más antiguos primero</Option>
            <Option value="title-asc">Título A-Z</Option>
            <Option value="title-desc">Título Z-A</Option>
          </Select>
        </Col>
      </Row>

      {isLoading ? (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <Spin size="large" />
        </div>
      ) : data?.posts && data.posts.length > 0 ? (
        <>
          <Row gutter={[24, 24]}>
            {data.posts.map((post) => (
              <Col xs={24} sm={12} lg={8} key={post._id}>
                <Link
                  to={`/blog/${post.slug}`}
                  style={{ textDecoration: "none" }}
                >
                  <Card
                    hoverable
                    cover={
                      post.featuredImage ? (
                        <img
                          alt={post.title}
                          src={post.featuredImage || "/placeholder.svg"}
                          style={{ height: 200, objectFit: "cover" }}
                        />
                      ) : (
                        <div
                          style={{
                            height: 200,
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
                    style={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                    bodyStyle={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <div style={{ marginBottom: 12 }}>
                      {post.categories?.slice(0, 2).map((category) => (
                        <Tag
                          color="blue"
                          key={category._id}
                          style={{ marginBottom: 4 }}
                        >
                          {category.name}
                        </Tag>
                      ))}
                    </div>
                    <Title
                      level={4}
                      ellipsis={{ rows: 2 }}
                      style={{ marginTop: 0 }}
                    >
                      {post.title}
                    </Title>
                    <Paragraph
                      ellipsis={{ rows: 3 }}
                      type="secondary"
                      style={{ flex: 1 }}
                    >
                      {post.excerpt}
                    </Paragraph>
                    <div style={{ marginTop: "auto" }}>
                      <Text type="secondary" style={{ fontSize: "12px" }}>
                        {new Date(post.createdAt).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </Text>
                      <div style={{ marginTop: 8 }}>
                        {post.tags?.slice(0, 3).map((tag) => (
                          <Tag key={tag._id} style={{ marginBottom: 4 }}>
                            {tag.name}
                          </Tag>
                        ))}
                      </div>
                    </div>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>

          <div style={{ textAlign: "center", marginTop: "40px" }}>
            <Pagination
              current={filters.page}
              pageSize={filters.limit}
              total={data.pagination?.totalItems || 0}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          </div>
        </>
      ) : (
        <Empty description="No se encontraron entradas de blog" />
      )}
    </div>
  );
};

export default BlogListPage;
