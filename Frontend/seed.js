import { MongoClient } from 'mongodb';
import { categories, subcategories, businesses } from './src/data/mockData.js';
import dotenv from 'dotenv';
import path from 'path';

// read from backend .env
dotenv.config({ path: '../backend/.env' });

const uri = process.env.MONGO_URI;
const dbName = process.env.DATABASE_NAME || 'nearlly_db';

async function seed() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(dbName);
    
    // Collections
    const catsCol = db.collection('categories');
    const subcatsCol = db.collection('subcategories');
    const bizCol = db.collection('businesses');
    
    // Clear existing data
    await catsCol.deleteMany({});
    await subcatsCol.deleteMany({});
    await bizCol.deleteMany({});
    console.log('Cleared existing data');
    
    // Insert new data
    if (categories.length > 0) await catsCol.insertMany(categories);
    console.log(`Inserted ${categories.length} categories`);
    
    if (subcategories.length > 0) await subcatsCol.insertMany(subcategories);
    console.log(`Inserted ${subcategories.length} subcategories`);
    
    if (businesses.length > 0) await bizCol.insertMany(businesses);
    console.log(`Inserted ${businesses.length} businesses`);
    
  } catch (err) {
    console.error('Failed to seed DB', err);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

seed();