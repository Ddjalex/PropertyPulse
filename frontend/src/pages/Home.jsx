import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import HeroSlider from '../components/HeroSlider'
import PropertyCard from '../components/PropertyCard'
import { Building, Users, TrendingUp, ChevronRight } from 'lucide-react'

export default function Home() {
  const [properties, setProperties] = useState([])
  const [projects, setProjects] = useState([])
  const [teamMembers, setTeamMembers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch featured properties
        const propertiesResponse = await fetch('/api/properties?featured=true')
        const propertiesData = await propertiesResponse.json()
        // Map _id to id for frontend compatibility
        const mappedProperties = propertiesData.map(property => ({
          ...property,
          id: property._id
        }))
        setProperties(mappedProperties.slice(0, 6)) // Show only 6 featured properties

        // Fetch projects
        const projectsResponse = await fetch('/api/projects')
        const projectsData = await projectsResponse.json()
        const mappedProjects = projectsData.map(project => ({
          ...project,
          id: project._id
        }))
        setProjects(mappedProjects.slice(0, 3))

        // Fetch team members
        const teamResponse = await fetch('/api/team')
        const teamData = await teamResponse.json()
        const mappedTeam = teamData.map(member => ({
          ...member,
          id: member._id
        }))
        setTeamMembers(mappedTeam.slice(0, 3))

        setLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleCall = (property) => {
    window.location.href = 'tel:+251911123456'
  }

  const handleWhatsApp = (property) => {
    const message = `Hi, I'm interested in ${property.title} - ${property.location}`
    const whatsappUrl = `https://wa.me/251911123456?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSlider />

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-600 text-white p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Building size={32} />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">500+</h3>
              <p className="text-gray-600">Properties Sold</p>
            </div>
            <div className="text-center">
              <div className="bg-secondary-600 text-white p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users size={32} />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">1000+</h3>
              <p className="text-gray-600">Happy Clients</p>
            </div>
            <div className="text-center">
              <div className="bg-primary-600 text-white p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <TrendingUp size={32} />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">30+</h3>
              <p className="text-gray-600">Years Experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Properties</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our handpicked selection of premium properties in Ethiopia's most desirable locations
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="card animate-pulse">
                  <div className="bg-gray-300 h-48 w-full"></div>
                  <div className="p-6 space-y-3">
                    <div className="bg-gray-300 h-6 w-3/4"></div>
                    <div className="bg-gray-300 h-4 w-1/2"></div>
                    <div className="bg-gray-300 h-8 w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onCall={handleCall}
                  onWhatsApp={handleWhatsApp}
                />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link 
              to="/properties" 
              className="btn-primary inline-flex items-center space-x-2"
            >
              <span>View All Properties</span>
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
                alt="About Gift Real Estate"
                className="rounded-lg shadow-lg"
              />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                About Gift Real Estate
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Since 1990, Gift Real Estate has been Ethiopia's premier real estate company, 
                specializing in luxury residential and commercial properties. We pride ourselves 
                on delivering exceptional service and finding the perfect property for every client.
              </p>
              <p className="text-gray-600 mb-6">
                Our team of experienced professionals understands the Ethiopian real estate market 
                like no other. From luxury villas in Bole to commercial spaces in the heart of 
                Addis Ababa, we have the expertise to guide you through every step of your 
                real estate journey.
              </p>
              <Link to="/about" className="btn-primary">
                Learn More About Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Find Your Dream Property?</h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Let our experienced team help you discover the perfect property that matches your needs and budget.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/properties" className="btn-secondary">
              Browse Properties
            </Link>
            <Link to="/contact" className="btn-primary bg-white text-primary-600 hover:bg-gray-100">
              Contact Us Today
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}