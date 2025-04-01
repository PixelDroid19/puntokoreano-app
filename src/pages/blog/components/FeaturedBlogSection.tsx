import type React from "react"
import { Row, Col, Typography, Spin } from "antd"
import BlogCard from "./BlogCard"
import { useFeaturedBlogs } from "@/hooks/useBlog.hooks"

const { Title } = Typography

interface FeaturedBlogSectionProps {
  title?: string
  limit?: number
}

const FeaturedBlogSection: React.FC<FeaturedBlogSectionProps> = ({ title = "Featured Articles", limit = 3 }) => {
  const { data: featuredPosts, isLoading, error } = useFeaturedBlogs(limit)

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", padding: "40px 0" }}>
        <Spin size="large" />
      </div>
    )
  }

  if (error || !featuredPosts || featuredPosts.length === 0) {
    return null
  }

  return (
    <div className="featured-blog-section" style={{ padding: "40px 0" }}>
      <Title level={2} style={{ textAlign: "center", marginBottom: "40px" }}>
        {title}
      </Title>

      <Row gutter={[24, 24]}>
        {featuredPosts.map((post, index) => (
          <Col xs={24} md={index === 0 ? 24 : 12} lg={index === 0 ? 12 : 6} key={post._id}>
            <BlogCard post={post} size={index === 0 ? "large" : "default"} />
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default FeaturedBlogSection

