#!/usr/bin/env node

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

import User from '../models/User.js';
import Stat from '../models/Stat.js';
import Animal from '../models/Animal.js';
import Rescue from '../models/Rescue.js';
import Settings from '../models/Settings.js';
import Volunteer from '../models/Volunteer.js';
import Blog from '../models/Blog.js';
import Media from '../models/Media.js';
import { uploadImageSource } from '../lib/cloudinary.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lahit-animal-welfare';
const RESET_CONTENT = process.env.LAHIT_RESET_SEED === 'true';
const image = (name) => `/images/rescues/${name}`;

const rescueStories = [
  {
    name: 'Kalu',
    type: 'Dog',
    location: 'Maneri, Uttarkashi',
    beforeImage: image('kalu-before.png'),
    afterImage: image('kalu-after.png'),
    story: 'A roadside tea seller in Maneri called us after Kalu spent two days curled beside the stone wall, too sore to stand. He had a deep scrape on his front leg, pine needles in his coat, and the quiet, watchful manner of an Indian Pariah dog used to being ignored. Our volunteers cleaned the wound, treated the infection, and brought him to the shelter for three weeks of rest. Kalu now greets every visitor at the gate and sleeps in the warmest patch of sun.',
    date: 'February 2026',
    published: true,
  },
  {
    name: 'Golu',
    type: 'Dog',
    location: 'Bhatwari, Uttarkashi',
    beforeImage: image('golu-before.png'),
    afterImage: image('golu-after.png'),
    story: 'Golu, a Himalayan Sheepdog (Bhutia), was found at the edge of a cattle path above Bhatwari with an injured paw and a coat matted from rain. He would move only when someone came close, then try to hide behind the wood stack. The team gave him antibiotics, careful grooming, and a soft place to sleep through the cold nights. Six weeks later he was walking the shelter boundary again, tail raised, choosing people instead of running from them.',
    date: 'January 2026',
    published: true,
  },
  {
    name: 'Choti',
    type: 'Dog',
    location: 'Dunda, Uttarkashi',
    beforeImage: image('choti-before.png'),
    afterImage: image('choti-after.png'),
    story: 'Choti was noticed by a school bus driver near a Dunda tea stall. Her rear paw was swollen and she kept shifting her weight, but she still followed anyone carrying food. An examination found a small road injury rather than a fracture. After cleaning, pain relief, vaccination, and ten quiet days indoors, Choti was back on her feet. She is now fostered by a shopkeeper who says she waits outside each morning for the first cup of chai and a scratch behind the ear.',
    date: 'December 2025',
    published: true,
  },
  {
    name: 'Gauri',
    type: 'Cow',
    location: 'Barkot, Uttarkashi',
    beforeImage: image('gauri-before.png'),
    afterImage: image('gauri-after.png'),
    story: 'Gauri, a small red-and-white Pahadi hill cow, was found near the Barkot road with a rope wound around her neck and no strength left to pull away. A nearby family kept her shaded while our team arranged transport to the gaushala. The wound needed daily dressing, but the bigger change came from regular water, fodder, and patient handling. Gauri now walks out to the feeding area on her own and has become the calmest resident in the shelter.',
    date: 'November 2025',
    published: true,
  },
  {
    name: 'Neel',
    type: 'Bird',
    location: 'Gangotri Road, Uttarkashi',
    beforeImage: image('monal-before.png'),
    afterImage: image('monal-after.png'),
    story: 'A forest worker found Neeli, a Himalayan monal, grounded beside the Gangotri Road after a wing injury. The bird was frightened and completely still, so the rescue was done quietly with help from the local forest team. We kept her in a dark recovery box, limited handling, and arranged a wildlife check before release. Once she could balance and lift both wings, Neeli was returned to a mossy forest clearing away from traffic.',
    date: 'October 2025',
    published: true,
  },
];

const animals = [
  {
    name: 'Kalu', type: 'Dog', breed: 'Indian Pariah Dog', age: '3 years', gender: 'Male',
    description: 'A steady, affectionate Uttarkashi street dog who loves quiet walks, warm blankets, and sitting near people.',
    image: image('kalu-after.png'), vaccinated: true, neutered: true, status: 'available', published: true,
  },
  {
    name: 'Gauri', type: 'Cow', breed: 'Pahadi Hill Cattle', age: '6 years', gender: 'Female',
    description: 'A gentle red-and-white hill cow recovering well at a partner gaushala in Barkot.',
    image: image('gauri-after.png'), vaccinated: true, neutered: false, status: 'adopted', published: true,
  },
  {
    name: 'Neel', type: 'Bird', breed: 'Himalayan Monal', age: 'Adult', gender: 'Male',
    description: 'A native Himalayan monal rehabilitated with the local forest team and released back to the Uttarkashi hills.',
    image: image('monal-after.png'), vaccinated: false, neutered: false, status: 'adopted', published: true,
  },
];

const volunteers = [
  {
    name: 'Meera Rawat', email: 'meera.rawat@lahit.org', phone: '+91 98765 43211', location: 'Uttarkashi town',
    interest: ['Rescue transport', 'Animal first aid'], message: 'I can take the evening rescue calls around the town and help get animals safely to the clinic.', status: 'approved',
  },
  {
    name: 'Deepak Negi', email: 'deepak.negi@lahit.org', phone: '+91 98765 43212', location: 'Bhatwari',
    interest: ['Mountain rescue', 'Feeding drives'], message: 'I have a small vehicle and can help with rescues on the Bhatwari side, especially before winter nights.', status: 'approved',
  },
  {
    name: 'Kavita Bisht', email: 'kavita.bisht@lahit.org', phone: '+91 98765 43213', location: 'Dunda',
    interest: ['Foster care', 'Community awareness'], message: 'I can provide short-term indoor care and speak with shopkeepers and schools about injured street animals.', status: 'approved',
  },
  {
    name: 'Mohan Lal', email: 'mohan.lal@lahit.org', phone: '+91 98765 43214', location: 'Barkot',
    interest: ['Gaushala support', 'Animal transport'], message: 'I work with local families and can coordinate fodder, water, and safe transport for hill cattle.', status: 'contacted',
  },
  {
    name: 'Sanjana Nautiyal', email: 'sanjana.nautiyal@lahit.org', phone: '+91 98765 43215', location: 'Uttarkashi town',
    interest: ['Wildlife response', 'Photography'], message: 'I can document recoveries respectfully and help contact the forest team when native birds are found hurt.', status: 'pending',
  },
];

const blogs = [
  {
    title: 'The Animals We Meet on Uttarkashi Roads', slug: 'animals-we-meet-on-uttarkashi-roads',
    excerpt: 'From Indian Pariah dogs near Maneri to hill cattle in Barkot, rescue work here starts with knowing the animals who already belong to these mountains.',
    content: '<p>Uttarkashi rescues rarely begin with a dramatic moment. More often, someone notices an animal missing from the roadside rhythm: a dog who no longer gets up for food, a cow standing alone near a bend, or a Himalayan bird grounded below the forest line.</p><p>Our first response is deliberately local. We call people who know the road, carry water and a blanket, and choose the safest route to care. Indian Pariah dogs, Himalayan Sheepdogs, Pahadi hill cattle, and native Himalayan birds all need different handling. The rescue works when that difference is respected.</p><p>Every recovery is also a community story. A tea seller makes the first call, a driver offers transport, and a volunteer stays through the coldest night. That is how a small team keeps animals visible in a very large landscape.</p>',
    coverImage: image('kalu-after.png'), author: 'LAHIT Uttarkashi team', category: 'Rescue Stories', tags: ['uttarkashi', 'indian pariah dog', 'community'], published: true, featured: true,
  },
  {
    title: 'A Warm Shed, Clean Water, and Time to Heal', slug: 'a-warm-shed-clean-water-and-time-to-heal',
    excerpt: 'Gauri’s recovery shows why practical, patient care matters as much as emergency treatment for Pahadi hill cattle.',
    content: '<p>When Gauri arrived from Barkot, the visible injury was the rope mark around her neck. The less visible problem was exhaustion. She had been standing in the same place for so long that even fresh fodder felt like too much effort.</p><p>The care plan was simple: shade, clean water, small regular feeds, a daily dressing, and someone calm enough to sit nearby without forcing contact. Within days, Gauri started turning toward the sound of the bucket. Within weeks, she was walking to the feeding area herself.</p><p>Good rescue care is not always dramatic. Sometimes it is doing the ordinary things consistently until an animal feels safe enough to try again.</p>',
    coverImage: image('gauri-after.png'), author: 'LAHIT Uttarkashi team', category: 'Medical Updates', tags: ['pahadi cow', 'barkot', 'recovery'], published: true, featured: false,
  },
  {
    title: 'When a Himalayan Monal Cannot Fly', slug: 'when-a-himalayan-monal-cannot-fly',
    excerpt: 'A quiet rescue on Gangotri Road, and the careful handoff that helped a native Himalayan bird return to the forest.',
    content: '<p>Bird rescues ask for a different kind of patience. Neel, a Himalayan monal, was found beside Gangotri Road after a wing injury. The safest first step was not to feed or handle him repeatedly, but to reduce noise, protect him from dogs, and call the local forest team.</p><p>During recovery, the box stayed covered and checks were brief. We watched for balance, alertness, and a full wing lift rather than rushing toward a release date. When Neel could stand firmly and move both wings, the team chose a quiet forest clearing away from traffic.</p><p>Native wildlife belongs in the wild whenever it is safe. Our job is to support that return with care, restraint, and the right local partners.</p>',
    coverImage: image('monal-after.png'), author: 'LAHIT Uttarkashi team', category: 'Rescue Stories', tags: ['himalayan monal', 'wildlife', 'gangotri road'], published: true, featured: false,
  },
];

async function ensureLoginUsers() {
  const adminPassword = await bcrypt.hash('admin123', 12);
  await User.updateOne(
    { email: 'admin@lahit.org' },
    { $setOnInsert: { name: 'Admin User', email: 'admin@lahit.org', password: adminPassword, role: 'admin' } },
    { upsert: true },
  );

  const volunteerPassword = await bcrypt.hash('volunteer123', 12);
  await User.updateOne(
    { email: 'volunteer@lahit.org' },
    { $setOnInsert: { name: 'LAHIT Volunteer', email: 'volunteer@lahit.org', password: volunteerPassword, role: 'volunteer' } },
    { upsert: true },
  );
}

async function seedSettingsAndStats() {
  await Stat.findOneAndUpdate(
    {},
    { animalsRescued: 5, mealsServed: 1840, treatments: 37, adoptions: 2, volunteers: 5, citiesCovered: 1, partnerVets: 2, yearsActive: 4 },
    { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
  );

  await Settings.findOneAndUpdate(
    {},
    {
      siteName: 'LAHIT - Uttarkashi Animal Welfare',
      siteDescription: 'Local rescue, treatment, and rehabilitation for animals found in the Uttarkashi hills.',
      contactEmail: 'contact@lahit.org', contactPhone: '+91 98765 43210', address: 'Uttarkashi, Uttarakhand, India',
      facebook: 'https://facebook.com/lahitanimalwelfare', instagram: 'https://instagram.com/lahit_animals', youtube: 'https://youtube.com/@lahitanimalwelfare',
      maintenanceMode: false,
      rescueLocations: [
        { id: 'uttarkashi-base', name: 'Uttarkashi', coordinates: [30.7268, 78.4354], address: 'Uttarkashi, Uttarakhand', isBase: true },
        { id: 'bhatwari', name: 'Bhatwari rescue route', coordinates: [30.7527, 78.6387], address: 'Bhatwari, Uttarkashi', animalsHelped: 2 },
        { id: 'barkot', name: 'Barkot gaushala route', coordinates: [30.8085, 78.2066], address: 'Barkot, Uttarkashi', animalsHelped: 1 },
        { id: 'dunda', name: 'Dunda roadside response', coordinates: [30.7333, 78.4500], address: 'Dunda, Uttarkashi', animalsHelped: 1 },
      ],
      volunteerActivities: ['Mountain rescue operations', 'Daily feeding drives', 'Animal first aid', 'Gaushala support', 'Wildlife response'],
    },
    { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
  );
}

async function seedContent() {
  const cloudinaryConfigured = Boolean(
    (process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME)
    && (process.env.CLOUDINARY_API_KEY || process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY)
    && (process.env.CLOUDINARY_API_SECRET || process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET),
  );
  const imageCache = new Map();

  async function storedImage(value) {
    if (!cloudinaryConfigured || !value.startsWith('/images/')) return value;
    if (imageCache.has(value)) return imageCache.get(value);

    try {
      const source = path.join(__dirname, '..', 'public', value);
      const filename = path.basename(value, path.extname(value));
      const result = await uploadImageSource(source, {
        folder: 'lahit/seed-rescues',
        public_id: filename,
        overwrite: true,
      });
      imageCache.set(value, result.secure_url);
      return result.secure_url;
    } catch (error) {
      console.warn(`⚠️ Could not upload ${value}; keeping the local path. ${error.message}`);
      return value;
    }
  }

  const neelRescueUpdate = {
    type: 'Bird',
    beforeImage: image('monal-before.png'),
    afterImage: image('monal-after.png'),
    story: 'A shopkeeper found Neel, a blue-grey rock pigeon, grounded beside Gangotri Road after a collision left one wing hanging low. The bird was frightened and still, so volunteers moved him quietly into a dark recovery box and contacted the local animal-care team. After rest, wound care, and careful checks, Neel could perch and fly short distances. He was released from a quiet mountain-side ledge away from traffic.',
  };
  const neelAnimalUpdate = {
    type: 'Bird',
    breed: 'Rock Pigeon',
    description: 'A blue-grey rock pigeon recovering after a wing injury and ready to return to the skies around Uttarkashi.',
    image: image('monal-after.png'),
  };
  const neelBlogUpdate = {
    title: 'When a Pigeon Cannot Fly',
    excerpt: 'A quiet rescue on Gangotri Road shows how patience and careful wing care helped Neel return to the skies.',
    content: '<p>Bird rescues ask for a different kind of patience. Neel, a blue-grey rock pigeon, was found beside Gangotri Road after a collision left one wing hanging low. The safest first step was to reduce noise, limit handling, and give him a dark, quiet recovery box.</p><p>For several days, the team checked his balance, appetite, and wing movement without rushing him. Rest, gentle wound care, and short supervised perches helped Neel regain strength. When he could perch securely and fly across the room, the team chose a quiet mountain-side ledge away from traffic.</p><p>Even a common city bird deserves careful help when it is hurt. Good wildlife rescue often means doing less, patiently, until an animal can safely return to its own world.</p>',
    coverImage: image('monal-after.png'),
    tags: ['rock pigeon', 'wildlife rescue', 'gangotri road'],
  };

  const seededRescues = await Promise.all(rescueStories.map(async (story) => ({
    ...(story.name === 'Neel' ? { ...story, ...neelRescueUpdate } : story),
    beforeImage: await storedImage(story.beforeImage),
    afterImage: await storedImage(story.afterImage),
  })));
  const seededAnimals = await Promise.all(animals.map(async (animal) => ({
    ...(animal.name === 'Neel' ? { ...animal, ...neelAnimalUpdate } : animal),
    image: await storedImage(animal.name === 'Neel' ? neelAnimalUpdate.image : animal.image),
  })));
  const seededBlogs = await Promise.all(blogs.map(async (blog) => ({
    ...(blog.slug === 'when-a-himalayan-monal-cannot-fly' ? { ...blog, ...neelBlogUpdate } : blog),
    coverImage: await storedImage(blog.slug === 'when-a-himalayan-monal-cannot-fly' ? neelBlogUpdate.coverImage : blog.coverImage),
  })));

  if (RESET_CONTENT) {
    await Animal.deleteMany({});
    await Rescue.deleteMany({});
    await Volunteer.deleteMany({});
    await Blog.deleteMany({});
    await Media.deleteMany({ category: { $in: ['rescue', 'animal', 'blog'] } });
  }

  if (RESET_CONTENT) {
    await Animal.insertMany(seededAnimals);
    await Rescue.insertMany(seededRescues);
    await Volunteer.insertMany(volunteers);
    await Blog.insertMany(seededBlogs);
  } else {
    await Animal.bulkWrite(seededAnimals.map((animal) => ({ updateOne: { filter: { name: animal.name }, update: { $set: animal }, upsert: true } })));
    await Rescue.bulkWrite(seededRescues.map((story) => ({ updateOne: { filter: { name: story.name, location: story.location }, update: { $set: story }, upsert: true } })));
    await Volunteer.bulkWrite(volunteers.map((volunteer) => ({ updateOne: { filter: { email: volunteer.email }, update: { $set: volunteer }, upsert: true } })));
    await Blog.bulkWrite(seededBlogs.map((blog) => ({ updateOne: { filter: { slug: blog.slug }, update: { $set: blog }, upsert: true } })));
  }

  const media = [
    ...seededRescues.map((story) => ({ filename: story.beforeImage.split('/').pop(), url: story.beforeImage, type: 'image', category: 'rescue', alt: `${story.name} before rescue`, caption: `${story.name} before rescue`, uploadedBy: 'Admin' })),
    ...seededRescues.map((story) => ({ filename: story.afterImage.split('/').pop(), url: story.afterImage, type: 'image', category: 'rescue', alt: `${story.name} after rescue`, caption: `${story.name} after rescue`, uploadedBy: 'Admin' })),
    ...seededBlogs.map((blog) => ({ filename: blog.coverImage.split('/').pop(), url: blog.coverImage, type: 'image', category: 'blog', alt: blog.title, caption: blog.title, uploadedBy: 'Admin' })),
  ];

  if (RESET_CONTENT) {
    await Media.insertMany(media);
  } else {
    await Media.bulkWrite(media.map((item) => ({ updateOne: { filter: { filename: item.filename }, update: { $set: item }, upsert: true } })));
  }
}

async function seed() {
  console.log('🌱 Seeding LAHIT with Uttarkashi content...');
  await mongoose.connect(MONGODB_URI);

  try {
    await ensureLoginUsers();
    await seedSettingsAndStats();
    await seedContent();
    console.log(`✅ Seeded ${rescueStories.length} rescue stories, ${blogs.length} blogs, and ${volunteers.length} volunteers.`);
    console.log(RESET_CONTENT ? '   Content reset was explicitly enabled.' : '   Existing records were preserved; matching seed records were updated.');
    console.log('   Admin: admin@lahit.org / admin123');
    console.log('   Volunteer: volunteer@lahit.org / volunteer123');
  } finally {
    await mongoose.connection.close();
  }
}

seed().catch((error) => {
  console.error('❌ Seed failed:', error.message);
  process.exitCode = 1;
});
