import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const heroSlides = [
  {
    id: 1,
    title: "Find Your Dream Home in Ethiopia",
    subtitle: "Trusted real estate partner since 1990. Discover premium properties across Addis Ababa and beyond.",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    cta: "Explore Properties"
  },
  {
    id: 2,
    title: "Luxury Living Redefined",
    subtitle: "Experience premium amenities and modern design in Ethiopia's most prestigious locations.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    cta: "View Luxury Homes"
  },
  {
    id: 3,
    title: "Commercial Real Estate Excellence",
    subtitle: "Strategic locations for your business growth with state-of-the-art facilities and infrastructure.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    cta: "Commercial Properties"
  }
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (isAutoPlaying) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlaying]);

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    setIsAutoPlaying(false);
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center text-white overflow-hidden">
      {/* Background Images */}
      {heroSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            backgroundImage: `linear-gradient(rgba(0, 109, 50, 0.7), rgba(0, 109, 50, 0.7)), url(${slide.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <div className="animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold mb-6" data-testid="hero-title">
            {heroSlides[currentSlide].title.split(' ').map((word, index) => 
              word === 'Ethiopia' ? (
                <span key={index} className="text-secondary-400">{word} </span>
              ) : (
                <span key={index}>{word} </span>
              )
            )}
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90" data-testid="hero-subtitle">
            {heroSlides[currentSlide].subtitle}
          </p>
          
          {heroSlides[currentSlide].cta && (
            <button 
              className="bg-secondary-600 hover:bg-secondary-700 text-white px-8 py-4 text-lg font-medium rounded-lg transition-colors"
              data-testid="hero-cta"
            >
              {heroSlides[currentSlide].cta}
            </button>
          )}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={goToPrevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/80 hover:text-white text-2xl p-2 rounded-full bg-black/20 hover:bg-black/40 transition-colors"
        data-testid="hero-prev"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>
      
      <button 
        onClick={goToNextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/80 hover:text-white text-2xl p-2 rounded-full bg-black/20 hover:bg-black/40 transition-colors"
        data-testid="hero-next"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
            data-testid={`hero-indicator-${index}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}