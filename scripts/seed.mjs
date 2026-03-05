#!/usr/bin/env node
/**
 * Database Seed Script for LAHIT Animal Welfare Admin Panel
 *
 * Usage: node scripts/seed.mjs
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

// Load environment variables
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// MongoDB Connection URI
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lahit-animal-welfare';

// Import models
import User from '../models/User.js';
import Stat from '../models/Stat.js';
import Animal from '../models/Animal.js';
import Rescue from '../models/Rescue.js';
import Settings from '../models/Settings.js';
import Volunteer from '../models/Volunteer.js';

async function connectDB() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
}

async function createAdminUser() {
  console.log('\n👤 Creating admin user...');

  try {
    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: 'admin@lahit.org' });

    if (existingAdmin) {
      console.log('ℹ️  Admin user already exists (admin@lahit.org)');
      return existingAdmin;
    }

    // Hash password manually
    const hashedPassword = await bcrypt.hash('admin123', 12);

    // Create new admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@lahit.org',
      password: hashedPassword,
      role: 'admin',
    });

    await adminUser.save();
    console.log('✅ Admin user created successfully');
    console.log('   Email: admin@lahit.org');
    console.log('   Password: admin123');
    console.log('   Role: admin');

    return adminUser;
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    throw error;
  }
}

async function createInitialStats() {
  console.log('\n📊 Creating initial stats data...');

  try {
    // Check if stats already exist
    const existingStats = await Stat.findOne();

    if (existingStats) {
      console.log('ℹ️  Stats data already exists');
      return existingStats;
    }

    // Create initial stats
    const stats = new Stat({
      animalsRescued: 1200,
      mealsServed: 30000,
      treatments: 500,
      adoptions: 200,
      volunteers: 50,
      citiesCovered: 15,
      partnerVets: 10,
      yearsActive: 4,
    });

    await stats.save();
    console.log('✅ Initial stats created successfully');

    return stats;
  } catch (error) {
    console.error('❌ Error creating stats:', error.message);
    throw error;
  }
}

async function createAnimals() {
  console.log('\n🐕 Creating sample animals...');

  try {
    // Clear existing animals
    await Animal.deleteMany({});
    
    const animals = [
      {
        name: 'Tommy',
        type: 'Dog',
        breed: 'Indie Mix',
        age: '2 years',
        gender: 'Male',
        description: 'Friendly and energetic. Loves to play fetch and gets along well with children. Perfect for active families looking for a loyal companion.',
        image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop',
        vaccinated: true,
        neutered: true,
        status: 'available',
        published: true
      },
      {
        name: 'Molly',
        type: 'Dog',
        breed: 'Indie',
        age: '1 year',
        gender: 'Female',
        description: 'Gentle and loving. Perfect for families looking for a calm companion. Good with other pets and very affectionate.',
        image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=400&h=400&fit=crop',
        vaccinated: true,
        neutered: true,
        status: 'available',
        published: true
      },
      {
        name: 'Simba',
        type: 'Cat',
        breed: 'Domestic Short Hair',
        age: '8 months',
        gender: 'Male',
        description: 'Playful and curious. Loves to explore and cuddle. Very affectionate kitten looking for a forever home.',
        image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop',
        vaccinated: true,
        neutered: false,
        status: 'available',
        published: true
      },
      {
        name: 'Rosie',
        type: 'Dog',
        breed: 'Indie Mix',
        age: '3 years',
        gender: 'Female',
        description: 'Loyal and protective. Great watchdog and loving family member. Well trained and obedient.',
        image: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=400&h=400&fit=crop',
        vaccinated: true,
        neutered: true,
        status: 'available',
        published: true
      },
      {
        name: 'Max',
        type: 'Dog',
        breed: 'Labrador Mix',
        age: '4 years',
        gender: 'Male',
        description: 'Friendly and obedient. Great with kids and other dogs. Loves swimming and outdoor activities.',
        image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop',
        vaccinated: true,
        neutered: true,
        status: 'pending',
        published: true
      },
      {
        name: 'Luna',
        type: 'Cat',
        breed: 'Persian',
        age: '2 years',
        gender: 'Female',
        description: 'Calm and elegant. Prefers a quiet environment. Very low maintenance and loves to nap.',
        image: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=400&h=400&fit=crop',
        vaccinated: true,
        neutered: true,
        status: 'adopted',
        published: true
      },
      {
        name: 'Buddy',
        type: 'Dog',
        breed: 'Golden Retriever',
        age: '5 years',
        gender: 'Male',
        description: 'Gentle giant. Perfect family dog. Loves everyone and everything. Great with children.',
        image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop',
        vaccinated: true,
        neutered: true,
        status: 'available',
        published: true
      },
      {
        name: 'Whiskers',
        type: 'Cat',
        breed: 'Tabby',
        age: '1 year',
        gender: 'Female',
        description: 'Curious and playful. Loves toys and climbing. Would do well in a home with other cats.',
        image: 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=400&h=400&fit=crop',
        vaccinated: true,
        neutered: false,
        status: 'available',
        published: true
      }
    ];

    await Animal.insertMany(animals);
    console.log('✅ Sample animals created successfully');
  } catch (error) {
    console.error('❌ Error creating animals:', error.message);
    throw error;
  }
}

async function createRescues() {
  console.log('\n🐾 Creating sample rescue stories...');

  try {
    // Clear existing rescues
    await Rescue.deleteMany({});
    
    const rescues = [
      {
        name: 'Bruno',
        type: 'Dog',
        location: 'Dehradun',
        beforeImage: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop&灰度=80',
        afterImage: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop',
        story: 'Found injured on roadside in Dehradun with a severe leg wound and malnourished. Rescued and treated by volunteers. After 3 months of care and physiotherapy, Bruno made a full recovery. He was adopted by a loving family and now lives happily.',
        date: 'January 2024',
        published: true
      },
      {
        name: 'Luna',
        type: 'Cat',
        location: 'Mussoorie',
        beforeImage: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop&灰度=80',
        afterImage: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop',
        story: 'Abandoned near Mall Road with severe skin infection and wounds. Received intensive care and love from our team. After two months of treatment, Luna transformed into a beautiful, playful cat.',
        date: 'February 2024',
        published: true
      },
      {
        name: 'Rocky',
        type: 'Dog',
        location: 'Uttarkashi',
        beforeImage: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=400&h=300&fit=crop&灰度=80',
        afterImage: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=400&h=300&fit=crop',
        story: 'Hit by a vehicle and left unable to walk. Our team rushed him to the vet in Dehradun. After successful surgery and physiotherapy, Rocky is now running and playing like any healthy dog.',
        date: 'March 2024',
        published: true
      },
      {
        name: 'Mithu',
        type: 'Bird',
        location: 'Rishikesh',
        beforeImage: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=400&h=300&fit=crop&灰度=80',
        afterImage: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=400&h=300&fit=crop',
        story: 'Found with a broken wing in a local market, likely from illegal trapping. Nursed back to health over two months. Now flying free in a safe habitat near Rishikesh.',
        date: 'December 2023',
        published: true
      },
      {
        name: 'Kali',
        type: 'Dog',
        location: 'Haridwar',
        beforeImage: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=300&fit=crop&灰度=80',
        afterImage: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=300&fit=crop',
        story: 'Severely malnourished mother dog with three puppies found near a temple. All were rescued and cared for. Puppies found homes through our adoption program.',
        date: 'November 2023',
        published: true
      },
      {
        name: 'Bella',
        type: 'Cow',
        location: 'Dehradun',
        beforeImage: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=400&h=300&fit=crop&灰度=80',
        afterImage: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=400&h=300&fit=crop',
        story: 'Injured cow found on highway with deep cuts from an accident. Treated by our veterinary team and rehabilitated. Now resides safely at a local gaushala.',
        date: 'October 2023',
        published: true
      },
      {
        name: 'Charlie',
        type: 'Dog',
        location: 'Rishikesh',
        beforeImage: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&h=300&fit=crop&灰度=80',
        afterImage: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&h=300&fit=crop',
        story: 'Puppy dumped in a river bag, barely alive. Rescued by our volunteers and given emergency care. Charlie survived against all odds and grew into a healthy, happy dog.',
        date: 'September 2023',
        published: true
      },
      {
        name: 'Whiskers',
        type: 'Cat',
        location: 'Dehradun',
        beforeImage: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=400&h=300&fit=crop&灰度=80',
        afterImage: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=400&h=300&fit=crop',
        story: 'Kitten found with eye infection so severe she was almost blind. After specialized treatment and surgery, Whiskers regained her sight.',
        date: 'August 2023',
        published: true
      }
    ];

    await Rescue.insertMany(rescues);
    console.log('✅ Sample rescue stories created successfully');
  } catch (error) {
    console.error('❌ Error creating rescues:', error.message);
    throw error;
  }
}

async function createSettings() {
  console.log('\n⚙️ Creating default settings...');

  try {
    // Check if settings already exist
    const existingSettings = await Settings.findOne();

    if (existingSettings) {
      console.log('ℹ️  Settings already exist');
      return;
    }

    const settings = new Settings({
      siteName: 'LAHIT - Animal Welfare',
      siteDescription: 'LAHIT is a non-profit organization dedicated to rescuing, rehabilitating, and finding loving homes for stray and abandoned animals in Uttarakhand, India.',
      contactEmail: 'contact@lahit.org',
      contactPhone: '+91 98765 43210',
      address: 'Dehradun, Uttarakhand, India',
      facebook: 'https://facebook.com/lahitanimalwelfare',
      instagram: 'https://instagram.com/lahit_animals',
      youtube: 'https://youtube.com/@lahitanimalwelfare',
      maintenanceMode: false,
      volunteerActivities: [
        'Animal Rescue Operations',
        'Daily Feeding Drives',
        'Medical Assistance',
        'Adoption Events',
        'Community Awareness',
        'Foster Care'
      ]
    });

    await settings.save();
    console.log('✅ Default settings created successfully');
  } catch (error) {
    console.error('❌ Error creating settings:', error.message);
    throw error;
  }
}

async function createVolunteers() {
  console.log('\n🙋 Creating sample volunteers...');

  try {
    // Check if volunteers already exist
    const existingVolunteers = await Volunteer.countDocuments();
    
    if (existingVolunteers > 0) {
      console.log(`ℹ️  ${existingVolunteers} volunteers already exist`);
      return;
    }

    const volunteers = [
      {
        name: 'Rahul Sharma',
        email: 'rahul.sharma@email.com',
        phone: '+91 98765 43211',
        location: 'Dehradun',
        interest: 'Animal Rescue Operations',
        message: 'I have been passionate about animal welfare for years and would love to join your team.',
        status: 'approved'
      },
      {
        name: 'Priya Singh',
        email: 'priya.singh@email.com',
        phone: '+91 98765 43212',
        location: 'Mussoorie',
        interest: 'Daily Feeding Drives',
        message: 'I can dedicate weekends to help with feeding drives in my area.',
        status: 'approved'
      },
      {
        name: 'Amit Kumar',
        email: 'amit.kumar@email.com',
        phone: '+91 98765 43213',
        location: 'Rishikesh',
        interest: 'Medical Assistance',
        message: 'I am a veterinary student and would like to help with medical treatments.',
        status: 'contacted'
      },
      {
        name: 'Sneha Gupta',
        email: 'sneha.gupta@email.com',
        phone: '+91 98765 43214',
        location: 'Haridwar',
        interest: 'Community Awareness',
        message: 'I want to organize awareness campaigns in schools and colleges.',
        status: 'pending'
      },
      {
        name: 'Vikram Joshi',
        email: 'vikram.joshi@email.com',
        phone: '+91 98765 43215',
        location: 'Uttarkashi',
        interest: 'Foster Care',
        message: 'I have a large backyard and can foster animals temporarily.',
        status: 'approved'
      }
    ];

    await Volunteer.insertMany(volunteers);
    console.log('✅ Sample volunteers created successfully');
  } catch (error) {
    console.error('❌ Error creating volunteers:', error.message);
    throw error;
  }
}

async function seed() {
  console.log('🌱 Starting database seed...\n');

  await connectDB();

  try {
    // Create admin user
    await createAdminUser();

    // Create initial stats
    await createInitialStats();

    // Create sample animals
    await createAnimals();

    // Create sample rescues
    await createRescues();

    // Create default settings
    await createSettings();

    // Create sample volunteers
    await createVolunteers();

    console.log('\n✨ Database seed completed successfully!');
    console.log('\n📝 Login Credentials:');
    console.log('   Email: admin@lahit.org');
    console.log('   Password: admin123');
    console.log('\n⚠️  Please change the default password after first login.\n');
  } catch (error) {
    console.error('\n❌ Seed failed:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run the seed function
seed();
