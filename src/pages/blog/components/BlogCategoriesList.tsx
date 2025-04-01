import type React from "react";
import { List, Typography, Tag, Spin, Empty } from "antd";
import { AppstoreOutlined } from "@ant-design/icons";

import { Link } from "react-router-dom";
import { usePublicBlogCategories } from "@/hooks/useBlog.hooks";

const { Title } = Typography;

const BlogCategoriesList: React.FC = () => {
  const { data: categories, isLoading, error } = usePublicBlogCategories();

  if (isLoading) {
    return <Spin size="small" />;
  }

  if (error || !categories || categories.length === 0) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description="No se encontraron categorías"
      />
    );
  }

  return (
    <div className="blog-categories-list">
      <Title level={4} style={{ marginBottom: 16 }}>
        <AppstoreOutlined /> Categorías
      </Title>
      <List
        size="small"
        dataSource={categories}
        renderItem={(category) => (
          <List.Item>
            <Link
              to={`/blog?category=${category._id}`}
              style={{ display: "block", width: "100%" }}
            >
              <Tag color="blue" style={{ marginRight: 8 }}>
                {category.name}
              </Tag>
            </Link>
          </List.Item>
        )}
      />
    </div>
  );
};

export default BlogCategoriesList;
