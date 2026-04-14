require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

const seedData = async () => {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || ''
    });

    console.log('Connected to MySQL');

    await connection.query(`CREATE DATABASE IF NOT EXISTS komodo_sailing`);
    await connection.query(`USE komodo_sailing`);

    await connection.query(`DROP TABLE IF EXISTS reviews`);
    await connection.query(`DROP TABLE IF EXISTS bookings`);
    await connection.query(`DROP TABLE IF EXISTS gallery`);
    await connection.query(`DROP TABLE IF EXISTS blog_posts`);
    await connection.query(`DROP TABLE IF EXISTS packages`);
    await connection.query(`DROP TABLE IF EXISTS settings`);
    await connection.query(`DROP TABLE IF EXISTS admins`);

    await connection.query(`
      CREATE TABLE admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) DEFAULT 'Admin',
        role ENUM('admin', 'superadmin') DEFAULT 'admin',
        last_login DATETIME,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await connection.query(`
      CREATE TABLE packages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE,
        price VARCHAR(100) NOT NULL,
        duration VARCHAR(50) NOT NULL,
        location VARCHAR(255) NOT NULL,
        description TEXT,
        itinerary JSON,
        image TEXT,
        gallery JSON,
        featured BOOLEAN DEFAULT FALSE,
        status ENUM('active', 'inactive') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await connection.query(`
      CREATE TABLE bookings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        customer_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        whatsapp VARCHAR(50) NOT NULL,
        package_id INT,
        package_name VARCHAR(255) NOT NULL,
        travel_date DATE NOT NULL,
        number_of_guests INT DEFAULT 1,
        notes TEXT,
        status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await connection.query(`
      CREATE TABLE reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        rating INT NOT NULL,
        comment TEXT NOT NULL,
        package_id INT,
        package_name VARCHAR(255),
        status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await connection.query(`
      CREATE TABLE gallery (
        id INT AUTO_INCREMENT PRIMARY KEY,
        url TEXT NOT NULL,
        caption VARCHAR(255),
        alt VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await connection.query(`
      CREATE TABLE blog_posts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE,
        excerpt TEXT,
        content TEXT,
        image TEXT,
        category VARCHAR(100) DEFAULT 'Uncategorized',
        status ENUM('draft', 'published') DEFAULT 'draft',
        read_time INT DEFAULT 5,
        author VARCHAR(100) DEFAULT 'Admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await connection.query(`
      CREATE TABLE settings (
        id INT PRIMARY KEY DEFAULT 1,
        site_name VARCHAR(255),
        site_description TEXT,
        logo TEXT,
        hero_image TEXT,
        contact_email VARCHAR(255),
        contact_phone VARCHAR(50),
        whatsapp VARCHAR(50),
        address TEXT,
        social_media JSON,
        seo JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Tables created');

    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'komodo123', 12);
    await connection.query(
      'INSERT INTO admins (email, password, name, role) VALUES (?, ?, ?, ?)',
      [process.env.ADMIN_EMAIL || 'admin@komodosailing.com', hashedPassword, 'Admin', 'superadmin']
    );
    console.log('Admin created');

    const packages = [
      {
        title: 'Lombok to Flores 4D3N Backpacker Standard',
        slug: 'lombok-flores-4d3n-backpacker',
        price: 'IDR 2,500,000',
        duration: '4D3N',
        location: 'Lombok → Flores',
        description: 'Budget-friendly Komodo boat trip from Lombok to Flores. Experience the magical journey aboard a comfortable backpacker boat. Visit Kenawa Island, swim with whale sharks in Saleh Bay, explore Komodo National Park, trek Padar Island, and enjoy Pink Beach.',
        itinerary: JSON.stringify([
          { day: 1, title: 'Meeting Point & Kenawa Island', activities: ['Free pickup from Mataram, Senggigi, Gili Islands', 'Transfer to Kayangan Harbor', 'Depart to Kenawa Island', 'Sunset trekking at Kenawa Hill'] },
          { day: 2, title: 'Whale Shark Adventure & Tambora Sea', activities: ['Early morning at Saleh Bay', 'Swim with whale sharks', 'Tambora Sea sunset', 'Night sailing to Flores Sea'] },
          { day: 3, title: 'Komodo National Park & Pink Beach', activities: ['Visit Komodo Island', 'See the ancient Komodo dragons', 'Trek Padar Island for sunset', 'Snorkeling at Pink Beach'] },
          { day: 4, title: 'Manjarite Beach, Kelor Island & Labuan Bajo', activities: ['Snorkeling at Manjarite Island', 'Play with baby sharks at Kelor Island', 'Arrive Labuan Bajo Harbor'] }
        ]),
        image: 'https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?w=800',
        gallery: JSON.stringify(['https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=600', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600']),
        featured: true,
        status: 'active'
      },
      {
        title: 'Lombok to Flores 4D3N Deluxe & Luxury',
        slug: 'lombok-flores-4d3n-deluxe',
        price: 'IDR 4,800,000 - 9,600,000',
        duration: '4D3N',
        location: 'Lombok → Flores',
        description: 'Premium luxury liveaboard experience with comfortable cabins, gourmet meals, fewer passengers, and exclusive access to remote destinations. Choose from various boats including Makkadina Cruise, Athira Cruise, Sehat Elona Cruise, and New Sultan Cruise.',
        itinerary: JSON.stringify([
          { day: 1, title: 'Pickup & Kenawa Island', activities: ['Free pickup from Lombok hotels (8 AM)', 'Transfer to Kayangan Harbor', 'Sail to Kanawa Island, Sumbawa', 'Sunset from Kanawa Hill'] },
          { day: 2, title: 'Whale Sharks & Tambora Sea', activities: ['Arrival at Saleh Bay (7 AM)', 'Swim with whale sharks (2 hours)', 'Tambora Sea sunset', 'Overnight sailing'] },
          { day: 3, title: 'Komodo Island, Padar & Pink Beach', activities: ['Visit Komodo Island', 'Licensed guide for dragon spotting', 'Pink Beach snorkeling', 'Padar Island sunset trek'] },
          { day: 4, title: 'Manjarite Beach, Kelor Island & Drop-off', activities: ['Manjarite Island snorkeling', 'Coral gardens & turtles', 'Kelor Island beach & baby sharks', 'Arrive Labuan Bajo (2-3 PM)'] }
        ]),
        image: 'https://images.unsplash.com/photo-1537956965359-7573183d1f57?w=800',
        gallery: JSON.stringify(['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600']),
        featured: true,
        status: 'active'
      },
      {
        title: 'Flores to Lombok 5D4N Adventure',
        slug: 'flores-lombok-5d4n-adventure',
        price: 'IDR 5,500,000',
        duration: '5D4N',
        location: 'Flores → Lombok',
        description: 'Extraordinary journey from Flores/Labuan Bajo to Lombok. Explore Komodo National Park, swim with manta rays, visit Rinca Island, trek Padar Island, and enjoy beautiful beaches before arriving in Lombok.',
        itinerary: JSON.stringify([
          { day: 1, title: 'Labuan Bajo & Kelor Island', activities: ['Hotel pickup (8 AM)', 'Kelor Island trekking', 'Manjarite snorkeling', 'Kalong Island sunset'] },
          { day: 2, title: 'Padar Island & Pink Beach', activities: ['Padar Island sunrise trek', 'Long Pink Beach', 'Komodo Island & dragons', 'Taka Makassar & Manta Point'] },
          { day: 3, title: 'Sebayur & Sebayur Small', activities: ['Crystal Bay snorkeling', 'Sebayur Island', 'Moor at anchor'] },
          { day: 4, title: 'Rinca Island & Komodo', activities: ['Rinca Island exploration', 'More dragon spotting', 'Pink Beach relaxation'] },
          { day: 5, title: 'Gili Islands & Lombok', activities: ['Gili Air & Gili Trawangan', 'Beach party on boat', 'Arrive Lombok Harbor (9 PM)'] }
        ]),
        image: 'https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=800',
        gallery: JSON.stringify(['https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=600']),
        featured: false,
        status: 'active'
      },
      {
        title: 'Labuan Bajo 3D2N Komodo Island Tour',
        slug: 'labuan-bajo-3d2n-komodo',
        price: 'IDR 2,500,000',
        duration: '3D2N',
        location: 'Labuan Bajo',
        description: 'Most popular choice for exploring Komodo National Park. 3 days 2 nights sailing from Labuan Bajo visiting Kelor Island, Manjarite, Padar Island, Pink Beach, Komodo Island, Taka Makassar, and Manta Point.',
        itinerary: JSON.stringify([
          { day: 1, title: 'Labuan Bajo - Kelor - Manjarite - Kalong', activities: ['Hotel pickup (8 AM)', 'Kelor Island hiking & views', 'Manjarite snorkeling', 'Kalong Island sunset'] },
          { day: 2, title: 'Padar Island - Pink Beach - Komodo', activities: ['Padar Island sunrise trek', 'Long Pink Beach snorkeling', 'Komodo Island & dragons', 'Taka Makassar sandbar', 'Manta Point'] },
          { day: 3, title: 'Siaba Island & Return', activities: ['Siaba Island turtle sanctuary', 'Final snorkeling', 'Return to Labuan Bajo'] }
        ]),
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
        gallery: JSON.stringify(['https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?w=600', 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=600']),
        featured: true,
        status: 'active'
      },
      {
        title: 'Labuan Bajo 2D1N Komodo Island Tour',
        slug: 'labuan-bajo-2d1n-komodo',
        price: 'IDR 1,800,000',
        duration: '2D1N',
        location: 'Labuan Bajo',
        description: 'Perfect for travelers with limited time. Experience the highlights of Komodo National Park in an exciting 2-day 1-night adventure. Visit Padar Island, Pink Beach, Komodo Island, and more.',
        itinerary: JSON.stringify([
          { day: 1, title: 'Padar Island & Pink Beach', activities: ['Morning departure', 'Padar Island trek for views', 'Pink Beach snorkeling', 'Komodo Island & dragons', 'Overnight on boat'] },
          { day: 2, title: 'Manta Point & Return', activities: ['Morning at Manta Point', 'Snorkeling with mantas', 'Return to Labuan Bajo'] }
        ]),
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
        gallery: JSON.stringify(['https://images.unsplash.com/photo-1544551763-92ab472cad5d?w=600']),
        featured: false,
        status: 'active'
      },
      {
        title: 'One Day Komodo Island Boat Tour',
        slug: 'one-day-komodo-speedboat',
        price: 'IDR 1,450,000',
        duration: '1 Day',
        location: 'Labuan Bajo',
        description: 'Fast-paced day trip to explore Komodo National Park highlights in one day. Perfect for travelers with limited time. Visit Komodo Island, Padar Island, Pink Beach, Taka Makassar, Manta Point, and Siaba Island.',
        itinerary: JSON.stringify([
          { day: 1, title: 'Full Day Komodo Adventure', activities: ['Hotel pickup (6 AM)', 'Siaba Island - turtle point', 'Manta Point', 'Taka Makassar sandbar', 'Komodo Island & dragons', 'Pink Beach', 'Padar Island', 'Return by 5 PM'] }
        ]),
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
        gallery: JSON.stringify(['https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=600']),
        featured: true,
        status: 'active'
      },
      {
        title: 'Private Charter Komodo Boat',
        slug: 'private-charter-komodo',
        price: 'IDR 11,000,000 - 17,500,000',
        duration: '1-3 Days',
        location: 'Labuan Bajo',
        description: 'Exclusive private boat charter for a more private, exclusive, and memorable Komodo experience. Choose from Dregs Speedboat or Voyages Luxury Wooden Boat. Perfect for families and groups.',
        itinerary: JSON.stringify([
          { day: 1, title: 'Custom Itinerary', activities: ['Flexible departure time', 'Choose your destinations', 'Private captain & crew', 'Snorkeling, trekking, beach time', 'Customized to your preferences'] }
        ]),
        image: 'https://images.unsplash.com/photo-1544551763-92ab472cad5d?w=800',
        gallery: JSON.stringify([]),
        featured: false,
        status: 'active'
      },
      {
        title: 'Shared Trip 3D2N Budget Komodo',
        slug: 'shared-trip-3d2n-budget',
        price: 'IDR 1,800,000',
        duration: '3D2N',
        location: 'Lombok → Flores',
        description: 'Budget-friendly shared boat trip from Lombok to Komodo. Perfect for backpackers and solo travelers. Meet new friends while exploring the beauty of eastern Indonesia.',
        itinerary: JSON.stringify([
          { day: 1, title: 'Meeting Point & Departure', activities: ['Hotel pickup', 'Kayangan Harbor', 'Snorkeling spots', 'Overnight on boat'] },
          { day: 2, title: 'Komodo National Park', activities: ['Padar Island', 'Pink Beach', 'Komodo Island', 'More snorkeling'] },
          { day: 3, title: 'Return & Arrival', activities: ['Morning activities', 'Arrival at destination'] }
        ]),
        image: 'https://images.unsplash.com/photo-1537956965359-7573183d1f57?w=800',
        gallery: JSON.stringify([]),
        featured: false,
        status: 'active'
      },
      {
        title: 'Rinjani Trekking 3D2N to Crater Rim & Summit',
        slug: 'rinjani-trekking-3d2n',
        price: 'IDR 3,150,000',
        duration: '3D2N',
        location: 'Mount Rinjani, Lombok',
        description: 'Epic 3-day 2-night trekking adventure to Mount Rinjani summit and crater rim. Experience stunning sunrise from 3,726m peak, explore Segara Anak crater lake, and enjoy the majestic views of Lombok from above.',
        itinerary: JSON.stringify([
          { day: 1, title: 'Sembalun - Plawangan', activities: ['Free pickup from Mataram, Senggigi, Bangsal', 'Arrive at Sembalun (11 AM)', 'Registration & briefing', 'Trek to Plawangan campsite', 'Camp dinner & rest'] },
          { day: 2, title: 'Summit Attempt', activities: ['Wake up at 2 AM', 'Summit push to Rinjani peak (3,726m)', 'Sunrise over caldera & Lake Segara Anak', 'Return to campsite', 'Descend to Senaru'] },
          { day: 3, title: 'Senaru - Return', activities: ['Breakfast at crater rim', 'Explore Lake Segara Anak', 'Hot springs', 'Descend to Senaru village', 'Free drop-off'] }
        ]),
        image: 'https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=800',
        gallery: JSON.stringify(['https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?w=600']),
        featured: true,
        status: 'active'
      },
      {
        title: 'Rinjani Trekking 2D1N to Summit',
        slug: 'rinjani-trekking-2d1n',
        price: 'IDR 2,600,000',
        duration: '2D1N',
        location: 'Mount Rinjani, Lombok',
        description: 'Quick but rewarding trek to Mount Rinjani summit. Wake up at 2 AM for the challenging ascent to witness breathtaking sunrise from the peak. Free accommodation included on first night.',
        itinerary: JSON.stringify([
          { day: 1, title: 'Sembalun & Start Trekking', activities: ['Free pickup from Lombok hotels', 'Arrive Sembalun', 'Trek to campsite (Plawangan)', 'Dinner & rest'] },
          { day: 2, title: 'Summit & Return', activities: ['Wake up at 2 AM', 'Summit push (3,726m)', 'Sunrise at peak', 'Descend to Sembalun', 'Return to Lombok'] }
        ]),
        image: 'https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=800',
        gallery: JSON.stringify([]),
        featured: true,
        status: 'active'
      },
      {
        title: 'Snorkeling Gili Islands Tour',
        slug: 'snorkeling-gili-islands',
        price: 'IDR 180,000 - 870,000',
        duration: '1 Day',
        location: 'Gili Islands, Lombok',
        description: 'Explore the crystal clear waters of the famous Gili Islands. Snorkel with sea turtles, discover colorful coral reefs, visit underwater statues, and enjoy beautiful white sandy beaches. Shared or private tours available.',
        itinerary: JSON.stringify([
          { day: 1, title: 'Gili Islands Snorkeling Adventure', activities: ['Hotel pickup or meet at harbor', 'Blue Coral Garden', 'Underwater statues', 'Turtle Point', 'Fish Garden', 'Gili Meno exploration', 'Lunch at beach (private tour)'] }
        ]),
        image: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=800',
        gallery: JSON.stringify(['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600']),
        featured: true,
        status: 'active'
      }
    ];

    for (const pkg of packages) {
      await connection.query(
        'INSERT INTO packages (title, slug, price, duration, location, description, itinerary, image, gallery, featured, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [pkg.title, pkg.slug, pkg.price, pkg.duration, pkg.location, pkg.description, pkg.itinerary, pkg.image, pkg.gallery, pkg.featured, pkg.status]
      );
    }
    console.log(`Created ${packages.length} packages`);

    const galleryImages = [
      { url: 'https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?w=800', caption: 'Padar Island Viewpoint' },
      { url: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800', caption: 'Pink Beach' },
      { url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800', caption: 'Komodo Dragon' },
      { url: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=800', caption: 'Snorkeling Paradise' },
      { url: 'https://images.unsplash.com/photo-1537956965359-7573183d1f57?w=800', caption: 'Sunset Sailing' },
      { url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800', caption: 'Crystal Clear Waters' },
      { url: 'https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=800', caption: 'Whale Shark Encounter' },
      { url: 'https://images.unsplash.com/photo-1544551763-92ab472cad5d?w=800', caption: 'Boat Adventure' },
    ];

    for (const img of galleryImages) {
      await connection.query('INSERT INTO gallery (url, caption) VALUES (?, ?)', [img.url, img.caption]);
    }
    console.log(`Created ${galleryImages.length} gallery images`);

    const blogPosts = [
      {
        title: 'Best Time to Visit Komodo National Park',
        slug: 'best-time-visit-komodo',
        excerpt: 'Discover the optimal seasons and months for your Komodo adventure. Learn about weather patterns, crowd levels, and what each season offers.',
        content: '<p>Planning a trip to Komodo National Park? The best time to visit is during the dry season from April to October.</p><h2>Dry Season (April - October)</h2><p>Sunny weather, calm seas, and excellent visibility for snorkeling make this the peak season.</p><h2>Wet Season (November - March)</h2><p>Fewer tourists, lower prices, and lush green landscapes. Rain typically comes in short bursts.</p>',
        image: 'https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?w=800',
        category: 'Travel Tips',
        status: 'published',
        read_time: 5
      },
      {
        title: 'What to Pack for Your Liveaboard Trip',
        slug: 'what-to-pack-liveaboard',
        excerpt: 'Essential packing list for your Komodo cruise adventure. From waterproof bags to reef-safe sunscreen.',
        content: '<p>Preparing for a liveaboard trip? Here is your essential packing list:</p><ul><li>Waterproof bags</li><li>Reef-safe sunscreen</li><li>Comfortable hiking shoes</li><li>Light clothing</li><li>Underwater camera</li></ul>',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
        category: 'Travel Tips',
        status: 'published',
        read_time: 4
      },
      {
        title: 'Swimming with Whale Sharks in Komodo',
        slug: 'swimming-whale-sharks-komodo',
        excerpt: 'Everything you need to know about swimming with the gentle giants of the sea.',
        content: '<p>Komodo offers incredible opportunities to swim with whale sharks!</p><h2>Best Spots</h2><p>The waters near Satonda Island and Sangiang Island are prime locations for whale shark encounters.</p><h2>Safety Tips</h2><p>Always maintain a safe distance and follow your guide instructions.</p>',
        image: 'https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=800',
        category: 'Wildlife',
        status: 'published',
        read_time: 6
      },
      {
        title: 'A Complete Guide to Padar Island',
        slug: 'guide-padar-island',
        excerpt: 'Hiking tips, best viewpoints, and photography spots on Padar Island.',
        content: '<p>Padar Island offers one of the most iconic viewpoints in Indonesia.</p><h2>Hiking Tips</h2><p>Start early to catch the sunrise. The hike takes about 30-45 minutes.</p><h2>Best Viewpoints</h2><p>The main viewpoint offers panoramic views of three different beaches.</p>',
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
        category: 'Destinations',
        status: 'published',
        read_time: 7
      },
    ];

    for (const post of blogPosts) {
      await connection.query(
        'INSERT INTO blog_posts (title, slug, excerpt, content, image, category, status, read_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [post.title, post.slug, post.excerpt, post.content, post.image, post.category, post.status, post.read_time]
      );
    }
    console.log(`Created ${blogPosts.length} blog posts`);

    const [insertedPackages] = await connection.query('SELECT id, title FROM packages');
    const pkg1 = insertedPackages[0];
    const pkg2 = insertedPackages[1];
    const pkg3 = insertedPackages[2];

    const bookings = [
      { customer_name: 'Sarah Johnson', email: 'sarah.j@email.com', whatsapp: '+6281234567890', package_id: pkg1.id, package_name: pkg1.title, travel_date: '2026-05-15', number_of_guests: 2, notes: 'Honeymoon trip', status: 'confirmed' },
      { customer_name: 'Michael Chen', email: 'm.chen@email.com', whatsapp: '+6289876543210', package_id: pkg2.id, package_name: pkg2.title, travel_date: '2026-06-01', number_of_guests: 4, notes: 'Family vacation', status: 'pending' },
      { customer_name: 'Emma Wilson', email: 'emma.w@email.com', whatsapp: '+6281111222233', package_id: pkg3.id, package_name: pkg3.title, travel_date: '2026-04-20', number_of_guests: 1, notes: '', status: 'completed' }
    ];

    for (const booking of bookings) {
      await connection.query(
        'INSERT INTO bookings (customer_name, email, whatsapp, package_id, package_name, travel_date, number_of_guests, notes, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [booking.customer_name, booking.email, booking.whatsapp, booking.package_id, booking.package_name, booking.travel_date, booking.number_of_guests, booking.notes, booking.status]
      );
    }
    console.log(`Created ${bookings.length} bookings`);

    const reviews = [
      { name: 'James Brown', email: 'james.b@email.com', rating: 5, comment: 'Amazing experience! The crew was professional and the views were breathtaking.', package_id: pkg1.id, package_name: pkg1.title, status: 'approved' },
      { name: 'Lisa Anderson', email: 'lisa.a@email.com', rating: 4, comment: 'Great trip overall. The snorkeling spots were incredible.', package_id: pkg2.id, package_name: pkg2.title, status: 'approved' },
      { name: 'David Kim', rating: 5, comment: 'Best vacation ever! The Komodo dragons were amazing.', status: 'pending' }
    ];

    for (const review of reviews) {
      await connection.query(
        'INSERT INTO reviews (name, email, rating, comment, package_id, package_name, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [review.name, review.email || null, review.rating, review.comment, review.package_id || null, review.package_name || null, review.status]
      );
    }
    console.log(`Created ${reviews.length} reviews`);

    console.log('\n✅ Seed data created successfully!');
    console.log('\n📧 Admin Login Credentials:');
    console.log('   Email:', process.env.ADMIN_EMAIL || 'admin@komodosailing.com');
    console.log('   Password:', process.env.ADMIN_PASSWORD || 'komodo123');
    
    process.exit();
  } catch (error) {
    console.error('Seed error:', error);
    if (connection) connection.end();
    process.exit(1);
  }
};

seedData();
