import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL is required");
  process.exit(1);
}

const databaseClient = neon(databaseUrl);

const categories = [
  {
    name: "Tartes",
    image:
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80",
    products: [
      {
        name: "Tarte aux pommes",
        price: 4.5,
        description:
          "Pâte sablée maison, pommes caramélisées et touche de cannelle.",
        allergens: "gluten, oeufs, lait",
        images: [
          {
            name: "Tarte aux pommes - vue de dessus",
            url: "https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?w=800&q=80",
          },
        ],
      },
      {
        name: "Tarte au citron meringuée",
        price: 5.0,
        description:
          "Crème de citron acidulée recouverte d'une meringue italienne dorée.",
        allergens: "gluten, oeufs, lait",
        images: [
          {
            name: "Tarte au citron meringuée",
            url: "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=800&q=80",
          },
        ],
      },
      {
        name: "Tarte aux fraises",
        price: 5.5,
        description: "Fraises fraîches sur lit de crème pâtissière vanillée.",
        allergens: "gluten, oeufs, lait",
        images: [
          {
            name: "Tarte aux fraises",
            url: "https://images.unsplash.com/photo-1464195244916-405fa0a82545?w=800&q=80",
          },
        ],
      },
    ],
  },
  {
    name: "Viennoiseries",
    image:
      "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&q=80",
    products: [
      {
        name: "Croissant au beurre",
        price: 1.4,
        description: "Croissant feuilleté pur beurre AOP de Charentes-Poitou.",
        allergens: "gluten, lait",
        images: [
          {
            name: "Croissant doré",
            url: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&q=80",
          },
        ],
      },
      {
        name: "Pain au chocolat",
        price: 1.6,
        description:
          "Viennoiserie feuilletée garnie de deux barres de chocolat noir.",
        allergens: "gluten, lait, soja",
        images: [
          {
            name: "Pain au chocolat",
            url: "https://images.unsplash.com/photo-1623334044303-241021148842?w=800&q=80",
          },
        ],
      },
      {
        name: "Chausson aux pommes",
        price: 2.2,
        description:
          "Pâte feuilletée croustillante et compote de pommes maison.",
        allergens: "gluten, lait",
        images: [
          {
            name: "Chausson aux pommes",
            url: "https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=800&q=80",
          },
        ],
      },
    ],
  },
  {
    name: "Gâteaux",
    image:
      "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80",
    products: [
      {
        name: "Fraisier",
        price: 6.5,
        description:
          "Génoise moelleuse, crème mousseline à la vanille et fraises gariguettes.",
        allergens: "gluten, oeufs, lait",
        images: [
          {
            name: "Fraisier",
            url: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80",
          },
        ],
      },
      {
        name: "Opéra",
        price: 6.0,
        description:
          "Biscuit Joconde imbibé de café, ganache au chocolat et crème au beurre.",
        allergens: "gluten, oeufs, lait, fruits à coque",
        images: [
          {
            name: "Opéra",
            url: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&q=80",
          },
        ],
      },
      {
        name: "Paris-Brest",
        price: 5.5,
        description:
          "Pâte à choux garnie d'une crème pralinée aux noisettes torréfiées.",
        allergens: "gluten, oeufs, lait, fruits à coque",
        images: [
          {
            name: "Paris-Brest",
            url: "https://images.unsplash.com/photo-1612203985729-70726954388c?w=800&q=80",
          },
        ],
      },
    ],
  },
  {
    name: "Macarons",
    image:
      "https://images.unsplash.com/photo-1558326567-98ae2405596b?w=800&q=80",
    products: [
      {
        name: "Macaron vanille",
        price: 2.0,
        description:
          "Coque amande légère et ganache à la vanille de Madagascar.",
        allergens: "oeufs, lait, fruits à coque",
        images: [
          {
            name: "Macaron vanille",
            url: "https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=800&q=80",
          },
        ],
      },
      {
        name: "Macaron framboise",
        price: 2.0,
        description: "Coque amande et cœur de confit de framboise.",
        allergens: "oeufs, fruits à coque",
        images: [
          {
            name: "Macaron framboise",
            url: "https://images.unsplash.com/photo-1558326567-98ae2405596b?w=800&q=80",
          },
        ],
      },
      {
        name: "Macaron chocolat",
        price: 2.0,
        description: "Coque amande et ganache au chocolat noir 70%.",
        allergens: "oeufs, lait, soja, fruits à coque",
        images: [
          {
            name: "Macaron chocolat",
            url: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&q=80",
          },
        ],
      },
    ],
  },
];

const SEED_USER_EMAIL = "seed@automne.test";

const orderDefs = [
  {
    status: "fulfilled",
    items: [
      ["Croissant au beurre", 30],
      ["Pain au chocolat", 20],
      ["Tarte aux pommes", 10],
    ],
  },
  {
    status: "fulfilled",
    items: [
      ["Croissant au beurre", 20],
      ["Pain au chocolat", 15],
      ["Macaron vanille", 15],
      ["Tarte au citron meringuée", 10],
    ],
  },
  {
    status: "fulfilled",
    items: [["Tarte aux pommes", 10]],
  },
  {
    status: "pending",
    items: [["Fraisier", 100]],
  },
];

async function seed() {
  const [seedUser] = await databaseClient`
    INSERT INTO users (first_name, last_name, email, password)
    VALUES ('Seed', 'Customer', ${SEED_USER_EMAIL}, 'seeded-placeholder')
    ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name
    RETURNING id
  `;

  await databaseClient`
    DELETE FROM order_items
    WHERE order_id IN (SELECT id FROM orders WHERE client_id = ${seedUser.id})
  `;
  await databaseClient`DELETE FROM orders WHERE client_id = ${seedUser.id}`;
  await databaseClient`DELETE FROM images`;
  await databaseClient`DELETE FROM products`;
  await databaseClient`DELETE FROM categories`;

  let categoryCount = 0;
  let productCount = 0;
  let imageCount = 0;

  for (const category of categories) {
    const [insertedCategory] = await databaseClient`
      INSERT INTO categories (name, image)
      VALUES (${category.name}, ${category.image})
      RETURNING id
    `;
    categoryCount += 1;

    for (const product of category.products) {
      const [insertedProduct] = await databaseClient`
        INSERT INTO products (name, price, description, allergens, category_id)
        VALUES (${product.name}, ${product.price}, ${product.description}, ${product.allergens}, ${insertedCategory.id})
        RETURNING id
      `;
      productCount += 1;

      for (const image of product.images) {
        await databaseClient`
          INSERT INTO images (name, url, product_id)
          VALUES (${image.name}, ${image.url}, ${insertedProduct.id})
        `;
        imageCount += 1;
      }
    }
  }

  const allProducts =
    await databaseClient`SELECT id, name, price FROM products`;
  const productByName = new Map(allProducts.map((p) => [p.name, p]));

  let orderCount = 0;
  let orderItemCount = 0;

  for (const def of orderDefs) {
    const [order] = await databaseClient`
      INSERT INTO orders (client_id, status)
      VALUES (${seedUser.id}, ${def.status})
      RETURNING id
    `;
    orderCount += 1;

    for (const [productName, quantity] of def.items) {
      const product = productByName.get(productName);
      if (!product) {
        console.warn(`Skipping unknown seed product: ${productName}`);
        continue;
      }
      await databaseClient`
        INSERT INTO order_items (order_id, product_id, quantity, unit_price)
        VALUES (${order.id}, ${product.id}, ${quantity}, ${product.price})
      `;
      orderItemCount += 1;
    }
  }

  return {
    categoryCount,
    productCount,
    imageCount,
    orderCount,
    orderItemCount,
  };
}

seed()
  .then(
    ({
      categoryCount,
      productCount,
      imageCount,
      orderCount,
      orderItemCount,
    }) => {
      console.log(
        `Database seeded: ${categoryCount} categories, ${productCount} products, ${imageCount} images, ${orderCount} orders, ${orderItemCount} order items`,
      );
    },
  )
  .catch((error) => {
    console.error("Error during database seeding", error);
    process.exit(1);
  });
