import { useParams } from 'react-router-dom'

export default function ProjectDetail() {
  const { id } = useParams()
  
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-4">Project Detail</h1>
      <p>Project ID: {id}</p>
      <p className="text-gray-600">Project detail page - Coming soon</p>
    </div>
  )
}