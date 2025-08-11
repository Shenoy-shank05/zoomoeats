import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Create restaurants
  const r1 = await prisma.restaurant.create({ 
    data: { 
      name: 'I Love Pizza, Jourian', 
      area: 'Main Market', 
      cuisine: 'Italian, Pizza',
      rating: 4.5,
      deliveryFee: 49,
      minOrder: 199,
      imgUrl: '/ilovepizzapic.jpg'
    } 
  })
  
  const r2 = await prisma.restaurant.create({ 
    data: { 
      name: 'Sharma Fast Food', 
      area: 'Food Street', 
      cuisine: 'Street Food, Chinese',
      rating: 4.2,
      deliveryFee: 39,
      minOrder: 150,
      imgUrl: '/2023-10-18.webp'
    } 
  })

  const r3 = await prisma.restaurant.create({ 
    data: { 
      name: 'Coffee Express', 
      area: 'Central Plaza', 
      cuisine: 'Café, Beverages',
      rating: 4.7,
      deliveryFee: 29,
      minOrder: 100,
      imgUrl: '/tips-to-recognize-good-quality-coffee-424970.webp'
    } 
  })

  const r4 = await prisma.restaurant.create({ 
    data: { 
      name: 'Taste of Punjab', 
      area: 'Punjab Street', 
      cuisine: 'North Indian',
      rating: 4.6,
      deliveryFee: 59,
      minOrder: 250,
      imgUrl: '/tandoori-pasta-featured.jpg'
    } 
  })

  const r5 = await prisma.restaurant.create({ 
    data: { 
      name: 'Moonlight Cafe', 
      area: 'Moonlight Street', 
      cuisine: 'Cafe, Desserts',
      rating: 4.4,
      deliveryFee: 35,
      minOrder: 180,
      imgUrl: '/moonlight.jpg'
    } 
  })

  // Create dishes for I Love Pizza
  await prisma.dish.createMany({ 
    data: [
      { restaurantId: r1.id, name: 'Margherita Pizza', category: 'Pizza', price: 299, isVeg: true, imgUrl: '/cheese-pizza.webp', description: 'Classic margherita with fresh basil and mozzarella' },
      { restaurantId: r1.id, name: 'Pepperoni Pizza', category: 'Pizza', price: 349, isVeg: false, imgUrl: '/cheese_burstpizza.png', description: 'Loaded with pepperoni and cheese' },
      { restaurantId: r1.id, name: 'Farmhouse Pizza', category: 'Pizza', price: 399, isVeg: true, imgUrl: '/farmhouse_pizza.jpg', description: 'Fresh vegetables and herbs' },
      { restaurantId: r1.id, name: 'Chicken Tandoori Pizza', category: 'Pizza', price: 449, isVeg: false, imgUrl: '/chicken-tandoori-pizza.jpg', description: 'Tandoori chicken with Indian spices' },
      
      // Sharma Fast Food dishes
      { restaurantId: r2.id, name: 'Aloo Tikki Burger', category: 'Burgers', price: 149, isVeg: true, imgUrl: '/aloo-tikki-burger-recipe-9.jpg', description: 'Crispy potato patty burger' },
      { restaurantId: r2.id, name: 'Mexican Street Corn Burger', category: 'Burgers', price: 199, isVeg: true, imgUrl: '/mexican-street-corn-burger-recipe-11-1067x1600.jpg', description: 'Spicy corn burger with Mexican flavors' },
      { restaurantId: r2.id, name: 'Peri Peri Fries', category: 'Sides', price: 99, isVeg: true, imgUrl: '/image-of-baked-crispy-peri-peri-fries-recipe-2.jpg', description: 'Crispy fries with peri peri seasoning' },
      { restaurantId: r2.id, name: 'Spicy Macaroni Salad', category: 'Salads', price: 129, isVeg: true, imgUrl: '/Spicy-Macaroni-Salad-feature-800x556.jpg', description: 'Tangy and spicy pasta salad' },

      // Coffee Express dishes
      { restaurantId: r3.id, name: 'Cappuccino', category: 'Beverages', price: 89, isVeg: true, imgUrl: '/NESCAFÉ Cappuccino.jpg.webp', description: 'Rich and creamy cappuccino' },
      { restaurantId: r3.id, name: 'Masala Chai', category: 'Beverages', price: 49, isVeg: true, imgUrl: '/Masala-Chai-Tea-Recipe-Card.jpg', description: 'Traditional Indian spiced tea' },
      { restaurantId: r3.id, name: 'Chocolate Milkshake', category: 'Beverages', price: 129, isVeg: true, imgUrl: '/Chocolate-Milkshake-Recipe-11.jpg', description: 'Rich chocolate milkshake' },
      { restaurantId: r3.id, name: 'Blueberry Smoothie', category: 'Beverages', price: 149, isVeg: true, imgUrl: '/Blueberry-Smoothie-main.webp', description: 'Fresh blueberry smoothie' },
      { restaurantId: r3.id, name: 'Lava Cake', category: 'Desserts', price: 179, isVeg: true, imgUrl: '/updated-lava-cakes7.webp', description: 'Warm chocolate lava cake' },

      // Taste of Punjab dishes
      { restaurantId: r4.id, name: 'Paneer Tikka', category: 'Starters', price: 249, isVeg: true, imgUrl: '/paneer-pizza-recipe-1-2.jpg', description: 'Grilled cottage cheese with spices' },
      { restaurantId: r4.id, name: 'Butter Chicken', category: 'Mains', price: 399, isVeg: false, description: 'Creamy tomato-based chicken curry' },
      { restaurantId: r4.id, name: 'Tandoori Pasta', category: 'Fusion', price: 299, isVeg: true, imgUrl: '/tandoori-pasta-featured.jpg', description: 'Indian-style spiced pasta' },
      { restaurantId: r4.id, name: 'Paneer Sandwich', category: 'Sandwiches', price: 179, isVeg: true, imgUrl: '/Paneer-Sandwinch-FQ-9-2.jpg', description: 'Grilled paneer sandwich' },

      // Moonlight Cafe dishes
      { restaurantId: r5.id, name: 'Grilled Cheese Sandwich', category: 'Sandwiches', price: 149, isVeg: true, imgUrl: '/the-best-grilled-cheese-sandwich-wp-square-photo.jpg', description: 'Classic grilled cheese' },
      { restaurantId: r5.id, name: 'Strawberry Milkshake', category: 'Beverages', price: 139, isVeg: true, imgUrl: '/Strawberry-milkshake-frappuccino-featured.jpg', description: 'Fresh strawberry milkshake' },
      { restaurantId: r5.id, name: 'Kit Kat Milkshake', category: 'Beverages', price: 159, isVeg: true, imgUrl: '/Kit-Kat-Milkshake-14.jpg', description: 'Chocolate Kit Kat milkshake' },
      { restaurantId: r5.id, name: 'Watermelon Mojito', category: 'Beverages', price: 119, isVeg: true, imgUrl: '/watermelon-mojito-3.jpg', description: 'Refreshing watermelon mojito' }
    ]
  })

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
