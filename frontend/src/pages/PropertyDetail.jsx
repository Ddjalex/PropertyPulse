import { useParams } from 'react-router-dom'

export default function PropertyDetail() {
  const { id } = useParams()
  
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-4">Property Detail</h1>
      <p>Property ID: {id}</p>
      <p className="text-gray-600">Property detail page - Coming soon</p>
    </div>
  )
}