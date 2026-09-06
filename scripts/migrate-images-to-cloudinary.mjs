#!/usr/bin/env node

import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Animal from '../models/Animal.js';
import Blog from '../models/Blog.js';
import Media from '../models/Media.js';
import Rescue from '../models/Rescue.js';
import RescueReport from '../models/RescueReport.js';
import Settings from '../models/Settings.js';
import { uploadImageSource } from '../lib/cloudinary.js';

dotenv.config({ path: '.env', quiet: true });

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/lahit-animal-welfare';
let migrated = 0;
const failures = [];

function isCloudinaryImage(value = '') {
  try {
    return new URL(value).hostname === 'res.cloudinary.com';
  } catch {
    return false;
  }
}

function resolveSource(value) {
  return value.startsWith('/') ? path.join(process.cwd(), 'public', value) : value;
}

async function migrateField(Model, document, field, folder) {
  const value = document[field];
  if (!value || isCloudinaryImage(value)) return;

  try {
    const result = await uploadImageSource(resolveSource(value), {
      folder,
      public_id: `${document._id}-${field}`,
      overwrite: true,
    });
    await Model.updateOne({ _id: document._id }, { $set: { [field]: result.secure_url } });
    migrated += 1;
  } catch (error) {
    failures.push(`${Model.modelName}.${document._id}.${field}: ${error.message}`);
  }
}

async function migrateCollection(Model, fields, folder) {
  const documents = await Model.find().lean();
  for (const document of documents) {
    for (const field of fields) {
      await migrateField(Model, document, field, folder);
    }
  }
}

async function migrateSettingsImages() {
  const settings = await Settings.findOne().lean();
  if (!settings?.instagramPosts?.length) return;

  const posts = [];
  for (const [index, post] of settings.instagramPosts.entries()) {
    if (!post.image || isCloudinaryImage(post.image)) {
      posts.push(post);
      continue;
    }
    try {
      const result = await uploadImageSource(resolveSource(post.image), {
        folder: 'lahit/instagram',
        public_id: `${settings._id}-instagram-${post.id || index}`,
        overwrite: true,
      });
      posts.push({ ...post, image: result.secure_url });
      migrated += 1;
    } catch (error) {
      posts.push(post);
      failures.push(`Settings.${settings._id}.instagramPosts.${index}: ${error.message}`);
    }
  }
  await Settings.updateOne({ _id: settings._id }, { $set: { instagramPosts: posts } });
}

try {
  await mongoose.connect(mongoUri);
  await migrateCollection(Media, ['url'], 'lahit/media');
  await migrateCollection(Animal, ['image'], 'lahit/animals');
  await migrateCollection(Rescue, ['beforeImage', 'afterImage'], 'lahit/rescues');
  await migrateCollection(Blog, ['coverImage'], 'lahit/blogs');
  await migrateCollection(RescueReport, ['image'], 'lahit/rescue-reports');
  await migrateSettingsImages();

  console.log(`Images migrated: ${migrated}`);
  if (failures.length > 0) {
    console.error(`Images failed: ${failures.length}`);
    failures.forEach((failure) => console.error(failure));
    process.exitCode = 1;
  }
} finally {
  await mongoose.disconnect();
}
