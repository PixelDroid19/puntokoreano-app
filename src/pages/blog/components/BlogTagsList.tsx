import type React from "react"
import { Typography, Tag, Spin, Empty, Space } from "antd"
import { TagOutlined } from "@ant-design/icons"
import { Link } from "react-router-dom"
import { usePublicBlogTags } from "@/hooks/useBlog.hooks"

const { Title } = Typography

const BlogTagsList: React.FC = () => {
  const { data: tags, isLoading, error } = usePublicBlogTags()

  if (isLoading) {
    return <Spin size="small" />
  }

  if (error || !tags || tags.length === 0) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No se encontraron etiquetas" />
  }

  return (
    <div className="blog-tags-list">
      <Title level={4} style={{ marginBottom: 16 }}>
        <TagOutlined /> Etiquetas
      </Title>
      <Space size={[8, 8]} wrap>
        {tags.map((tag) => (
          <Link key={tag._id} to={`/blog?tag=${tag._id}`}>
            <Tag>{tag.name}</Tag>
          </Link>
        ))}
      </Space>
    </div>
  )
}

export default BlogTagsList