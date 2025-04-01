import type React from "react"
import { Card, Typography, Tag, Space } from "antd"
import { CalendarOutlined, UserOutlined } from "@ant-design/icons"
import { Link } from "react-router-dom"
import { BlogPostFromBackend } from "@/types/blog.types"

const { Title, Text, Paragraph } = Typography

interface BlogCardProps {
  post: BlogPostFromBackend
  size?: "small" | "default" | "large"
}

const BlogCard: React.FC<BlogCardProps> = ({ post, size = "default" }) => {
  const isSmall = size === "small"
  const isLarge = size === "large"

  const imageHeight = isSmall ? 150 : isLarge ? 300 : 200
  const titleLevel = isSmall ? 5 : isLarge ? 3 : 4
  const excerptRows = isSmall ? 2 : isLarge ? 4 : 3

  return (
    <Link to={`/blog/${post.slug}`} style={{ textDecoration: "none" }}>
      <Card
        hoverable
        cover={
          post.featuredImage ? (
            <img
              alt={post.title}
              src={post.featuredImage || "/placeholder.svg"}
              style={{ height: imageHeight, objectFit: "cover" }}
            />
          ) : (
            <div
              style={{
                height: imageHeight,
                background: "#f5f5f5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text type="secondary">No Image</Text>
            </div>
          )
        }
        style={{ height: "100%", display: "flex", flexDirection: "column" }}
        bodyStyle={{ flex: 1, display: "flex", flexDirection: "column" }}
      >
        <div style={{ marginBottom: 12 }}>
          {post.categories?.slice(0, isSmall ? 1 : 2).map((category) => (
            <Tag color="blue" key={category._id} style={{ marginBottom: 4 }}>
              {category.name}
            </Tag>
          ))}
        </div>

        <Title level={titleLevel as any} ellipsis={{ rows: 2 }} style={{ marginTop: 0 }}>
          {post.title}
        </Title>

        <Paragraph ellipsis={{ rows: excerptRows }} type="secondary" style={{ flex: 1 }}>
          {post.excerpt}
        </Paragraph>

        <div style={{ marginTop: "auto" }}>
          <Space size={12} style={{ fontSize: "12px", color: "#8c8c8c" }}>
            <Space size={4}>
              <CalendarOutlined />
              <span>
                {new Date(post.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </Space>

            {post.author && (
              <Space size={4}>
                <UserOutlined />
                <span>{post.author.name}</span>
              </Space>
            )}
          </Space>

          {!isSmall && (
            <div style={{ marginTop: 8 }}>
              {post.tags?.slice(0, isLarge ? 5 : 3).map((tag) => (
                <Tag key={tag._id} style={{ marginBottom: 4 }}>
                  {tag.name}
                </Tag>
              ))}
            </div>
          )}
        </div>
      </Card>
    </Link>
  )
}

export default BlogCard

