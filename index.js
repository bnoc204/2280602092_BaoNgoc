const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.json());

const CATEGORIES_FILE = path.join(__dirname, 'data', 'categories.json');
const PRODUCTS_FILE = path.join(__dirname, 'data', 'products.json');

function loadJSON(file) {
  try {
    const raw = fs.readFileSync(file, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

function saveJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
}

let categories = loadJSON(CATEGORIES_FILE);
let products = loadJSON(PRODUCTS_FILE);

// GET all categories, optional query by name (case-insensitive, partial)
app.get('/api/v1/categories', (req, res) => {
  const { name } = req.query;
  let result = categories;
  if (name) {
    const q = name.toLowerCase();
    result = result.filter(c => c.name.toLowerCase().includes(q));
  }
  res.json(result);
});

// GET category by ID
app.get('/api/v1/categories/:id', (req, res) => {
  const id = Number(req.params.id);
  const cat = categories.find(c => c.id === id);
  if (!cat) return res.status(404).json({ message: 'Category not found' });
  res.json(cat);
});

// GET category by slug
app.get('/api/v1/categories/slug/:slug', (req, res) => {
  const { slug } = req.params;
  const cat = categories.find(c => c.slug === slug);
  if (!cat) return res.status(404).json({ message: 'Category not found' });
  res.json(cat);
});

// POST create category
app.post('/api/v1/categories', (req, res) => {
  const { name, slug, image } = req.body;
  if (!name || !slug) return res.status(400).json({ message: 'name and slug are required' });
  const newId = categories.reduce((max, c) => Math.max(max, c.id), 0) + 1;
  const now = new Date().toISOString();
  const newCat = { id: newId, name, slug, image: image || '', creationAt: now, updatedAt: now };
  categories.push(newCat);
  saveJSON(CATEGORIES_FILE, categories);
  res.status(201).json(newCat);
});

// PUT edit category
app.put('/api/v1/categories/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = categories.findIndex(c => c.id === id);
  if (idx === -1) return res.status(404).json({ message: 'Category not found' });
  const { name, slug, image } = req.body;
  if (name !== undefined) categories[idx].name = name;
  if (slug !== undefined) categories[idx].slug = slug;
  if (image !== undefined) categories[idx].image = image;
  categories[idx].updatedAt = new Date().toISOString();
  saveJSON(CATEGORIES_FILE, categories);
  res.json(categories[idx]);
});

// DELETE category
app.delete('/api/v1/categories/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = categories.findIndex(c => c.id === id);
  if (idx === -1) return res.status(404).json({ message: 'Category not found' });
  const removed = categories.splice(idx, 1)[0];
  saveJSON(CATEGORIES_FILE, categories);
  res.json({ message: 'Deleted', category: removed });
});

// GET products by category id
app.get('/api/v1/categories/:id/products', (req, res) => {
  const id = Number(req.params.id);
  const cat = categories.find(c => c.id === id);
  if (!cat) return res.status(404).json({ message: 'Category not found' });
  const prods = products.filter(p => Number(p.categoryId) === id);
  res.json(prods);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
