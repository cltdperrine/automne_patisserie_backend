import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL is required");
  process.exit(1);
}

const databaseClient = neon(databaseUrl);

function sqlValue(val) {
  if (val === null || val === undefined) return "NULL";
  if (typeof val === "number") return String(val);
  if (typeof val === "boolean") return val ? "TRUE" : "FALSE";
  return `'${String(val).replace(/'/g, "''")}'`;
}

function rowsToInserts(tableName, rows) {
  if (!rows || rows.length === 0) return `-- (no rows in ${tableName})\n`;
  const cols = Object.keys(rows[0]);
  const lines = rows.map((row) => {
    const values = cols.map((c) => sqlValue(row[c])).join(", ");
    return `INSERT INTO ${tableName} (${cols.join(", ")}) VALUES (${values});`;
  });
  return lines.join("\n") + "\n";
}

async function backup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const outDir = path.resolve("scripts/backups");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, `backup-${timestamp}.sql`);

  const users = await databaseClient`SELECT id, first_name, last_name, email, password, role, created_at FROM users`;
  const categories = await databaseClient`SELECT id, name, image, created_at FROM categories`;
  const products = await databaseClient`SELECT id, name, price, description, allergens, category_id, created_at FROM products`;
  const images = await databaseClient`SELECT id, name, url, product_id, created_at FROM images`;
  const orders = await databaseClient`SELECT id, first_name, last_name, phone, pickup_location, pickup_date, notes, status, created_at FROM orders`;
  const orderItems = await databaseClient`SELECT order_id, product_id, quantity, unit_price, created_at FROM order_items`;
  const cart = await databaseClient`SELECT product_id, user_id, quantity, created_at FROM cart`;

  const sql = [
    `-- Automne Pâtisserie — Sauvegarde du ${new Date().toLocaleString("fr-FR")}`,
    `-- Restauration : psql $DATABASE_URL < ce_fichier.sql`,
    ``,
    `-- Extensions et types`,
    `CREATE EXTENSION IF NOT EXISTS "pgcrypto";`,
    `DO $$ BEGIN CREATE TYPE user_role AS ENUM ('admin', 'user', 'moderator'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;`,
    `DO $$ BEGIN CREATE TYPE status AS ENUM ('pending', 'canceled', 'fulfilled'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;`,
    ``,
    `-- Tables`,
    `CREATE TABLE IF NOT EXISTS users (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), first_name TEXT, last_name TEXT, email TEXT UNIQUE NOT NULL, password TEXT NOT NULL, role user_role NOT NULL DEFAULT 'user', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);`,
    `CREATE TABLE IF NOT EXISTS categories (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name TEXT NOT NULL, image TEXT NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);`,
    `CREATE TABLE IF NOT EXISTS products (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name TEXT NOT NULL, price NUMERIC(10,2) NOT NULL, description TEXT, allergens TEXT, category_id UUID REFERENCES categories(id) ON DELETE SET NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);`,
    `CREATE TABLE IF NOT EXISTS orders (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), first_name TEXT NOT NULL, last_name TEXT NOT NULL, phone TEXT NOT NULL, pickup_location TEXT NOT NULL, pickup_date DATE NOT NULL, notes TEXT, status status NOT NULL DEFAULT 'pending', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);`,
    `CREATE TABLE IF NOT EXISTS order_items (order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE, product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT, quantity INT NOT NULL CHECK (quantity > 0), unit_price NUMERIC(10,2) NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (order_id, product_id));`,
    `CREATE INDEX IF NOT EXISTS order_items_product_id_idx ON order_items(product_id);`,
    `CREATE TABLE IF NOT EXISTS images (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name TEXT, url TEXT, product_id UUID REFERENCES products(id) ON DELETE CASCADE, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);`,
    `CREATE TABLE IF NOT EXISTS cart (product_id UUID REFERENCES products(id) ON DELETE CASCADE, user_id UUID REFERENCES users(id) ON DELETE CASCADE, quantity INT NOT NULL DEFAULT 1, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY(product_id, user_id));`,
    ``,
    `-- Données`,
    rowsToInserts("users", users),
    rowsToInserts("categories", categories),
    rowsToInserts("products", products),
    rowsToInserts("images", images),
    rowsToInserts("orders", orders),
    rowsToInserts("order_items", orderItems),
    rowsToInserts("cart", cart),
  ].join("\n");

  fs.writeFileSync(outFile, sql, "utf-8");
  return { outFile, counts: { users: users.length, categories: categories.length, products: products.length, images: images.length, orders: orders.length, orderItems: orderItems.length } };
}

backup()
  .then(({ outFile, counts }) => {
    console.log(`Sauvegarde créée : ${outFile}`);
    console.log(`  ${counts.users} utilisateurs, ${counts.categories} catégories, ${counts.products} produits, ${counts.images} images, ${counts.orders} commandes, ${counts.orderItems} lignes de commande`);
  })
  .catch((err) => {
    console.error("Erreur lors de la sauvegarde :", err);
    process.exit(1);
  });
