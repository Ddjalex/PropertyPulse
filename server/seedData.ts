import { PropertyModel, ProjectModel, TeamMemberModel } from '@shared/models';

export async function seedInitialData() {
  try {
    // Check if data already exists
    const existingProperties = await PropertyModel.countDocuments();
    const existingProjects = await ProjectModel.countDocuments();  
    const existingTeam = await TeamMemberModel.countDocuments();

    if (existingProperties > 0 && existingProjects > 0 && existingTeam > 0) {
      console.log('✅ Database already has data, skipping seed');
      return;
    }

    console.log('🌱 Seeding initial data...');

    // Seed sample properties
    if (existingProperties === 0) {
      const sampleProperties = [
        {
          title: "Modern Villa in Bole",
          description: "Beautiful 4-bedroom villa with modern amenities and great location in Bole area.",
          price: 8500000,
          listingType: "sale",
          type: "villa",
          bedrooms: 4,
          bathrooms: 3,
          area: 350,
          location: "Bole, Addis Ababa",
          status: "available",
          featured: true,
          images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9"]
        },
        {
          title: "Commercial Office Space",
          description: "Prime commercial space perfect for business operations in the heart of the city.",
          price: 120000,
          listingType: "rent",
          type: "commercial",
          area: 200,
          location: "CMC, Addis Ababa", 
          status: "available",
          featured: true,
          images: ["https://images.unsplash.com/photo-1497366216548-37526070297c"]
        }
      ];

      for (const property of sampleProperties) {
        await PropertyModel.create(property);
      }
      console.log('✅ Sample properties created');
    }

    // Seed sample projects
    if (existingProjects === 0) {
      const sampleProjects = [
        {
          name: "Skyline Residences",
          description: "Luxury residential complex with modern amenities and city views.",
          location: "Bole, Addis Ababa",
          progress: 75,
          availableUnits: 12,
          expectedCompletion: new Date('2025-06-01'),
          images: ["https://images.unsplash.com/photo-1503387762-592deb58ef4e"]
        }
      ];

      for (const project of sampleProjects) {
        await ProjectModel.create(project);
      }
      console.log('✅ Sample projects created');
    }

    // Seed sample team members
    if (existingTeam === 0) {
      const sampleTeam = [
        {
          name: "Alex Mekonnen",
          role: "Senior Real Estate Agent", 
          email: "alex@giftrealestate.com",
          phone: "+251911123456",
          whatsapp: "+251911123456",
          bio: "Experienced real estate professional with over 8 years in the Ethiopian market.",
          active: true,
          image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
        }
      ];

      for (const member of sampleTeam) {
        await TeamMemberModel.create(member);
      }
      console.log('✅ Sample team members created');
    }

    console.log('🎉 Initial data seeding completed successfully!');

  } catch (error) {
    console.error('❌ Error seeding data:', error);
  }
}