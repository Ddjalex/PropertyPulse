import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

interface SearchFilters {
  propertyType: string;
  location: string;
  priceRange: string;
  listingType: string;
}

interface SearchFormProps {
  onSearch?: (filters: SearchFilters) => void;
  className?: string;
}

export default function SearchForm({ onSearch, className = "" }: SearchFormProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    propertyType: '',
    location: '',
    priceRange: '',
    listingType: ''
  });

  const handleSearch = () => {
    if (onSearch) {
      onSearch(filters);
    }
  };

  const updateFilter = (key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className={`bg-white/95 backdrop-blur-md rounded-lg p-6 shadow-lg ${className}`} data-testid="search-form">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
          <Select value={filters.propertyType} onValueChange={(value) => updateFilter('propertyType', value)}>
            <SelectTrigger data-testid="select-property-type">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="apartment">Apartment</SelectItem>
              <SelectItem value="villa">Villa</SelectItem>
              <SelectItem value="office">Office</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
              <SelectItem value="land">Land</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
          <Select value={filters.location} onValueChange={(value) => updateFilter('location', value)}>
            <SelectTrigger data-testid="select-location">
              <SelectValue placeholder="All Areas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Areas</SelectItem>
              <SelectItem value="Bole">Bole</SelectItem>
              <SelectItem value="Kazanchis">Kazanchis</SelectItem>
              <SelectItem value="CMC">CMC</SelectItem>
              <SelectItem value="Sarbet">Sarbet</SelectItem>
              <SelectItem value="4 Kilo">4 Kilo</SelectItem>
              <SelectItem value="Mexico">Mexico</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Price Range (ETB)</label>
          <Select value={filters.priceRange} onValueChange={(value) => updateFilter('priceRange', value)}>
            <SelectTrigger data-testid="select-price-range">
              <SelectValue placeholder="Any Price" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Price</SelectItem>
              <SelectItem value="500000-1000000">500K - 1M</SelectItem>
              <SelectItem value="1000000-5000000">1M - 5M</SelectItem>
              <SelectItem value="5000000-10000000">5M - 10M</SelectItem>
              <SelectItem value="10000000-50000000">10M - 50M</SelectItem>
              <SelectItem value="50000000+">50M+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Listing Type</label>
          <Select value={filters.listingType} onValueChange={(value) => updateFilter('listingType', value)}>
            <SelectTrigger data-testid="select-listing-type">
              <SelectValue placeholder="Sale & Rent" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Sale & Rent</SelectItem>
              <SelectItem value="sale">For Sale</SelectItem>
              <SelectItem value="rent">For Rent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-6">
        <Button 
          onClick={handleSearch}
          className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 font-medium"
          data-testid="button-search"
        >
          <Search className="mr-2" size={20} />
          Search Properties
        </Button>
      </div>
    </div>
  );
}
