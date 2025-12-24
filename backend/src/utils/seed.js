const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/user-model');
const Property = require('../models/property-model');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await User.deleteMany({});
    await Property.deleteMany({});
    console.log('🗑️  Cleared existing data');

    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@smartrent.com',
      password: 'admin123',
      phone: '1234567890',
      role: 'admin'
    });
    console.log('✅ Created admin user');

    // Create landlords
    const landlord1 = await User.create({
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      password: 'password123',
      phone: '5551234567',
      role: 'landlord'
    });

    const landlord2 = await User.create({
      name: 'Michael Chen',
      email: 'michael@example.com',
      password: 'password123',
      phone: '5559876543',
      role: 'landlord'
    });
    console.log('✅ Created landlords');

    // Create tenants
    const tenant1 = await User.create({
      name: 'Emily Davis',
      email: 'emily@example.com',
      password: 'password123',
      phone: '5552468135',
      role: 'tenant'
    });

    const tenant2 = await User.create({
      name: 'James Wilson',
      email: 'james@example.com',
      password: 'password123',
      phone: '5553691470',
      role: 'tenant'
    });
    console.log('✅ Created tenants');

    // Create properties
    const properties = [
      {
        landlord: landlord1._id,
        title: 'Luxury Downtown Apartment',
        description: 'Beautiful 2-bedroom apartment in the heart of downtown with stunning city views',
        address: {
          street: '456 Park Avenue',
          city: 'New York',
          state: 'NY',
          zipCode: '10022',
          country: 'USA'
        },
        propertyType: 'apartment',
        bedrooms: 2,
        bathrooms: 2,
        area: 1200,
        rent: 3500,
        deposit: 7000,
        amenities: ['WiFi', 'Parking', 'Gym', 'Pool', 'Security'],
        status: 'available'
      },
      {
        landlord: landlord1._id,
        title: 'Cozy Studio in Brooklyn',
        description: 'Modern studio apartment in trendy Brooklyn neighborhood',
        address: {
          street: '123 Main St',
          city: 'Brooklyn',
          state: 'NY',
          zipCode: '11201',
          country: 'USA'
        },
        propertyType: 'studio',
        bedrooms: 0,
        bathrooms: 1,
        area: 500,
        rent: 2000,
        deposit: 4000,
        amenities: ['WiFi', 'Laundry'],
        status: 'available'
      },
      {
        landlord: landlord2._id,
        title: 'Spacious 3-Bedroom House',
        description: 'Large family home with backyard and driveway',
        address: {
          street: '789 Elm Street',
          city: 'Queens',
          state: 'NY',
          zipCode: '11354',
          country: 'USA'
        },
        propertyType: 'house',
        bedrooms: 3,
        bathrooms: 2,
        area: 2000,
        rent: 4500,
        deposit: 9000,
        amenities: ['Backyard', 'Driveway', 'Garage'],
        status: 'available'
      }
    ];

    await Property.create(properties);
    console.log('✅ Created properties');

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\nTest Credentials:');
    console.log('  Admin: admin@smartrent.com / admin123');
    console.log('  Landlord: sarah@example.com / password123');
    console.log('  Landlord: michael@example.com / password123');
    console.log('  Tenant: emily@example.com / password123');
    console.log('  Tenant: james@example.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Error:', error.message);
    process.exit(1);
  }
};

connectDB().then(() => seedData());
