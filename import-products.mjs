// Raees - bulk product importer
// Run from the project folder:  node import-products.mjs
import fs from 'fs';
import readline from 'readline';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import {
  getFirestore, collection, getDocs, doc, setDoc, deleteDoc, Timestamp,
} from 'firebase/firestore';

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf-8'));
const products = JSON.parse(fs.readFileSync('./products.json', 'utf-8'));

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((res) => rl.question(q, res));

const app = initializeApp(config);
const auth = getAuth(app);
const db = getFirestore(app, config.firestoreDatabaseId || '(default)');

try {
  console.log(`\nRaees importer: ${products.length} products found in products.json\n`);
  const email = (await ask('Admin email: ')).trim();
  const password = (await ask('Admin password: ')).trim();
  await signInWithEmailAndPassword(auth, email, password);
  console.log('Login OK.\n');

  const existing = await getDocs(collection(db, 'products'));
  const oldIds = existing.docs.map((d) => d.id);
  console.log(`Currently in database: ${oldIds.length} products (demo/old).`);
  const answer = (await ask('Delete the old products after importing? (yes/no): ')).trim().toLowerCase();

  let ok = 0;
  for (const p of products) {
    const id = `raees-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    await setDoc(doc(db, 'products', id), {
      id,
      name: p.name,
      tagline: 'Luxury fragrance',
      category: p.category,
      price: p.price,
      description: p.description,
      images: [p.image],
      sizes: [{ size: '50ml', price: p.price, inStock: true }],
      topNotes: ['Bergamot'],
      heartNotes: ['Rose'],
      baseNotes: ['Amber'],
      longevity: '12+ Hours',
      sillage: 'Strong',
      stock: p.stock,
      rating: 5,
      reviewsCount: 0,
      isFeatured: false,
      isBestSeller: false,
      createdAt: Timestamp.now(),
    });
    ok++;
    console.log(`  added ${ok}/${products.length}: ${p.name}`);
  }

  if (answer === 'yes' || answer === 'y') {
    for (const id of oldIds) await deleteDoc(doc(db, 'products', id));
    console.log(`\nDeleted ${oldIds.length} old products.`);
  }
  console.log(`\nDONE. ${ok} products imported. Refresh your website.`);
} catch (e) {
  console.error('\nERROR:', e.code || e.message);
  console.error('Check email/password and that Firestore rules are published.');
} finally {
  rl.close();
  process.exit(0);
}
