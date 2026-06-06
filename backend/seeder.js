import 'dotenv/config';
import mongoose from 'mongoose';
import User from './models/User.js';
import Product from './models/Product.js';
import connectDB from './config/db.js';

const products = [
  // ==========================================
  // APPAREL (1-15)
  // ==========================================
  {
    name: 'Cyberpunk Cargo Hoodie',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80',
    brand: 'X-SYSTEM',
    category: 'APPAREL',
    price: 89.00,
    countInStock: 12,
    description: 'Thick-knit industrial loopback hoodie with drop-shoulder straps and asymmetrical drawstring rings. Built for survival.'
  },
  {
    name: 'Asymmetric Split Windbreaker',
    image: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?w=800&q=80',
    brand: 'Vektor',
    category: 'APPAREL',
    price: 110.00,
    countInStock: 8,
    description: 'Waterproof ripstop exterior shell featuring a high-contrast half-and-half color split pattern and matte black heavy zippers.'
  },
  {
    name: 'Distressed Acid Sweatshirt',
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80',
    brand: 'Streetwear Cartel',
    category: 'APPAREL',
    price: 65.00,
    countInStock: 15,
    description: 'Heavy stonewash texture treatment creates unique distressing on every piece. 450GSM French Terry cotton framing.'
  },
  {
    name: 'Industrial Multi-Pocket Vest',
    image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=80',
    brand: 'Utility Ops',
    category: 'APPAREL',
    price: 75.00,
    countInStock: 6,
    description: 'Tactical layer featuring 6 utility pouches, heavy-duty D-rings, and breathable mesh backing elements for structural styling.'
  },
  {
    name: 'Tactical Strapped Cargo Pants',
    image: 'https://images.unsplash.com/photo-1517423568366-8b83523034fd?w=800&q=80',
    brand: 'X-SYSTEM',
    category: 'APPAREL',
    price: 95.00,
    countInStock: 14,
    description: 'Relaxed fit canvas utility pants complete with heavy-gauge adjustable side straps and custom geometric leg tailoring.'
  },
  {
    name: 'Raw Edge Heavy Sweatpants',
    image: 'https://images.unsplash.com/photo-1551854838-212c50b4c184?w=800&q=80',
    brand: 'Muted Co',
    category: 'APPAREL',
    price: 55.00,
    countInStock: 20,
    description: 'Unapologetically thick loungewear featuring custom frayed raw edge hems and deep, unstructured utility side pockets.'
  },
  {
    name: 'Flame Mesh Basketball Jersey',
    image: 'https://images.unsplash.com/photo-1519766304817-4f37bda74a27?w=800&q=80',
    brand: 'Vektor',
    category: 'APPAREL',
    price: 48.00,
    countInStock: 10,
    description: 'High-breathability open mesh structural build featuring a wrap-around monochrome digital flame graphic block.'
  },
  {
    name: 'Geometric Heavy Knit Sweater',
    image: 'https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?w=800&q=80',
    brand: 'Streetwear Cartel',
    category: 'APPAREL',
    price: 85.00,
    countInStock: 5,
    description: 'Thick, oversized cotton weave featuring a sharp pixelated structural geometric print across the chest and cuffs.'
  },
  {
    name: 'Reflective Strip Utility Jacket',
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&q=80',
    brand: 'Utility Ops',
    category: 'APPAREL',
    price: 135.00,
    countInStock: 4,
    description: 'High-visibility industrial tracking jacket featuring wide 3M reflective structural grids across a bright safety neon background.'
  },
  {
    name: 'Bleached Denim Box Shacket',
    image: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=800&q=80',
    brand: 'Muted Co',
    category: 'APPAREL',
    price: 79.00,
    countInStock: 11,
    description: 'A heavyweight hybrid shirt-jacket cut from rigid 14oz denim with stark acid splash bleach effects.'
  },
  {
    name: 'Glitch-Print Boxy Longsleeve',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=80',
    brand: 'X-SYSTEM',
    category: 'APPAREL',
    price: 42.00,
    countInStock: 18,
    description: 'Relaxed drop-shoulder long sleeve cotton tee featuring high-density plastisol cyber-glitch typography along both sleeves.'
  },
  {
    name: 'Splatter Bleach Cargo Jeans',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80',
    brand: 'Streetwear Cartel',
    category: 'APPAREL',
    price: 115.00,
    countInStock: 7,
    description: 'Wide-leg industrial denim jeans displaying random paint splatter effects and utility hammer loops.'
  },
  {
    name: 'Industrial Heavy Knit Beanie',
    image: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=800&q=80',
    brand: 'Muted Co',
    category: 'APPAREL',
    price: 28.00,
    countInStock: 30,
    description: 'Four-stitch crown structure waffle beanie with a prominent thick canvas box-logo patch stitched dead center.'
  },
  {
    name: 'Canvas Mosh Workwear Coat',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80',
    brand: 'Utility Ops',
    category: 'APPAREL',
    price: 160.00,
    countInStock: 3,
    description: 'Ultra-tough treated duck canvas coat with reinforced triple-stitched seams and industrial metal snap enclosures.'
  },
  {
    name: 'Neon Trim Tech Runner Shorts',
    image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&q=80',
    brand: 'Vektor',
    category: 'APPAREL',
    price: 38.00,
    countInStock: 25,
    description: 'Lightweight shell utility shorts featuring hot-stamped mesh undershorts and high-saturation tracking accents.'
  },

  // ==========================================
  // SHOES (16-30)
  // ==========================================
  {
    name: 'Cyber Neon Chunky Sneaks',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
    brand: 'Kicks',
    category: 'SHOES',
    price: 145.00,
    countInStock: 8,
    description: 'Oversized multi-layered rubber midsole block equipped with high-intensity fluorescent mesh panels and hiking lace anchors.'
  },
  {
    name: 'Industrial Combat Platform Boots',
    image: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800&q=80',
    brand: 'Tough-Tread',
    category: 'SHOES',
    price: 185.00,
    countInStock: 4,
    description: 'Polished premium action leather upper sitting atop a massive 2-inch solid vulcanized rubber tread block. Acid proof.'
  },
  {
    name: 'Sleek Knit Sock Runners',
    image: 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=800&q=80',
    brand: 'Aerostream',
    category: 'SHOES',
    price: 130.00,
    countInStock: 14,
    description: 'Seamless lightweight dynamic woven wrap upper utilizing an ultra-reactive segmented impact foam sole array.'
  },
  {
    name: 'Stark Contrast Low-Tops',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80',
    brand: 'Kicks',
    category: 'SHOES',
    price: 75.00,
    countInStock: 19,
    description: 'Heavyweight canvas canvas panel build using sharp geometric monochrome stitching and a flat black vulcanized edge lip.'
  },
  {
    name: 'Translucent Sole Mid-Tops',
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80',
    brand: 'Aerostream',
    category: 'SHOES',
    price: 160.00,
    countInStock: 6,
    description: 'Futuristic ripstop matrix configuration detailing a thick, see-through ice-blue polymer impact suspension track.'
  },
  {
    name: 'Monochrome Raw Suede Skates',
    image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&q=80',
    brand: 'Kicks',
    category: 'SHOES',
    price: 85.00,
    countInStock: 12,
    description: 'Shaggy rough-cut suede skateboarding trainers featuring thick padded mesh tongues and impact absorbing insoles.'
  },
  {
    name: 'Tactical Double-Strap Sandals',
    image: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800&q=80',
    brand: 'Tough-Tread',
    category: 'SHOES',
    price: 70.00,
    countInStock: 10,
    description: 'Heavy neoprene lining held securely by thick industrial nylon webbing loops and dual plastic clip locking mechanisms.'
  },
  {
    name: 'Distressed Raw Hem Trainers',
    image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&q=80',
    brand: 'Kicks',
    category: 'SHOES',
    price: 95.00,
    countInStock: 0,
    description: 'Frayed canvas edge low cuts with pre-scuffed textured sidewalls. Unapologetic wear patterns direct from the box.'
  },
  {
    name: 'Metallic Space Cyber Boots',
    image: 'https://images.unsplash.com/photo-1605733127014-448ef5593075?w=800&q=80',
    brand: 'Aerostream',
    category: 'SHOES',
    price: 220.00,
    countInStock: 2,
    description: 'High-shine reflective chrome silver synthetic panel frame sitting on a heavy deep-lug technical trail platform.'
  },
  {
    name: 'Raw Grain Asphalt Lows',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80',
    brand: 'Tough-Tread',
    category: 'SHOES',
    price: 110.00,
    countInStock: 9,
    description: 'Unprocessed texturized full-grain leather build built to acquire scars and patina through hard urban movement.'
  },
  {
    name: 'Holographic High-Top Matrix',
    image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&q=80',
    brand: 'Aerostream',
    category: 'SHOES',
    price: 175.00,
    countInStock: 5,
    description: 'Shift-spectrum color-changing lateral geometric support layers set into a sharp matte black frame silhouette.'
  },
  {
    name: 'Bubble Cushion Air Pods',
    image: 'https://images.unsplash.com/photo-1514989940723-e8e5163ccbe8?w=800&q=80',
    brand: 'Kicks',
    category: 'SHOES',
    price: 155.00,
    countInStock: 7,
    description: 'Aggressive mesh profile featuring 360-degree pressurized atmospheric gas capsules for continuous vertical feedback.'
  },
  {
    name: 'Vintage Gum Court Trainers',
    image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&q=80',
    brand: 'Kicks',
    category: 'SHOES',
    price: 90.00,
    countInStock: 16,
    description: 'Classic retro athletic shape rebuilt with dense modern composite materials and a highly texturized amber gum outer base.'
  },
  {
    name: 'Carbon Plate Industrial Hikers',
    image: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=800&q=80',
    brand: 'Tough-Tread',
    category: 'SHOES',
    price: 195.00,
    countInStock: 3,
    description: 'Internal real carbon fiber stabilization shank layered between deep waterproof synthetic tracking membranes.'
  },
  {
    name: 'Laser Matrix Hyper Runners',
    image: 'https://images.unsplash.com/photo-1506152983158-b4a74a01c721?w=800&q=80',
    brand: 'Aerostream',
    category: 'SHOES',
    price: 140.00,
    countInStock: 11,
    description: 'Digitally tailored dynamic grid upper featuring precision geometric heat-mapped ventilation zones.'
  },

  // ==========================================
  // TECH (31-40)
  // ==========================================
  {
    name: 'Industrial Cyber Wireless Buds',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80',
    brand: 'TechCo',
    category: 'TECH',
    price: 125.00,
    countInStock: 15,
    description: 'True wireless hardware encased in a raw concrete-textured alloy charging container with visible internal structural chips.'
  },
  {
    name: 'Transparent Shell Power Stack',
    image: 'https://images.unsplash.com/photo-1622445262465-2481c4574875?w=800&q=80',
    brand: 'VoltGrid',
    category: 'TECH',
    price: 68.00,
    countInStock: 22,
    description: 'See-through crystal polycarbonate casing displaying real gold-plated circuit board arrays and 20,000mAh structural cells.'
  },
  {
    name: 'Heavy Steel Braided USB Cable',
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80',
    brand: 'VoltGrid',
    category: 'TECH',
    price: 24.00,
    countInStock: 40,
    description: 'Armored flexible stainless steel exterior mesh layout delivering fast charging and infinite crush-proof security.'
  },
  {
    name: 'RGB Mechanical Keycap Brick Pack',
    image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&q=80',
    brand: 'TechCo',
    category: 'TECH',
    price: 45.00,
    countInStock: 25,
    description: 'Ultra-thick matte PBT keycaps detailed with thick military stenciled typography blocks for maximum light refraction.'
  },
  {
    name: 'Aluminum Rugged Phone Exoskeleton',
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&q=80',
    brand: 'ArmorFit',
    category: 'TECH',
    price: 55.00,
    countInStock: 18,
    description: 'CNC-machined aircraft aluminum outer border shell anchored by real steel hex bolts for absolute structural defense.'
  },
  {
    name: 'Matte Stealth Laptop Vault',
    image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80',
    brand: 'ArmorFit',
    category: 'TECH',
    price: 60.00,
    countInStock: 12,
    description: 'Dense anti-scratch EVA hardshell carrying case utilizing double-sealed heavy security zippers.'
  },
  {
    name: 'Cyber Neon Grid Deskmat',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80',
    brand: 'TechCo',
    category: 'TECH',
    price: 35.00,
    countInStock: 30,
    description: 'Massive 900x400mm desktop workspace base detailing sharp contrast gridlines and heavy non-slip textured back lines.'
  },
  {
    name: 'Wearable HUD Smart Eyewear',
    image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&q=80',
    brand: 'TechCo',
    category: 'TECH',
    price: 249.00,
    countInStock: 4,
    description: 'Zero-blur display lenses displaying Bluetooth telemetric logs across a lightweight black wrap-around frame assembly.'
  },
  {
    name: 'Cyber-Strap Tactical Watch Base',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
    brand: 'ArmorFit',
    category: 'TECH',
    price: 39.00,
    countInStock: 17,
    description: 'Molded dense fluorocarbon rubber strap showing industrial ventilation grilles and matte steel buckles.'
  },
  {
    name: 'Block Aluminum Card Reactor',
    image: 'https://images.unsplash.com/photo-1627122765306-ba6768944924?w=800&q=80',
    brand: 'VoltGrid',
    category: 'TECH',
    price: 49.00,
    countInStock: 20,
    description: 'Solid milled metal minimalist utility wallet presenting integrated RFID signal shielding and instant mechanical pop-up switch track.'
  },

  // ==========================================
  // SPORTS (41-50)
  // ==========================================
  {
    name: 'Asphalt Grip Street Basketball',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80',
    brand: 'Decked',
    category: 'SPORTS',
    price: 65.00,
    countInStock: 14,
    description: 'Deep-grooved composite leather shell skin tailored for brutal abrasion retention on rough concrete outdoor courts.'
  },
  {
    name: 'Heavy Duty Mosh Punching Mitts',
    image: 'https://images.unsplash.com/photo-1517438476312-10d79c077509?w=800&q=80',
    brand: 'Ironclad',
    category: 'SPORTS',
    price: 58.00,
    countInStock: 8,
    description: 'High-density multi-layered dynamic foam core padding locked within a double-stitched synthetic shell split framework.'
  },
  {
    name: 'Raw Maple Street Cruiser Deck',
    image: 'https://images.unsplash.com/photo-1547447134-cd3f5c716030?w=800&q=80',
    brand: 'Decked',
    category: 'SPORTS',
    price: 79.00,
    countInStock: 11,
    description: '7-ply hard-rock Canadian maple structural cross-grain construction containing a high-contrast industrial grid graphic.'
  },
  {
    name: 'Matte Stealth Skateboard Helmet',
    image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=800&q=80',
    brand: 'Ironclad',
    category: 'SPORTS',
    price: 45.00,
    countInStock: 13,
    description: 'High-impact molded ABS exterior shield paired with a dense interior shock absorbing EPS impact barrier layout.'
  },
  {
    name: 'Industrial Heavy Resistance Loop',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80',
    brand: 'Ironclad',
    category: 'SPORTS',
    price: 25.00,
    countInStock: 35,
    description: 'Layered premium latex band array outputting up to 150lbs of linear elastic counterforce pressure.'
  },
  {
    name: 'Reflective Night Utility Run Vest',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
    brand: 'Decked',
    category: 'SPORTS',
    price: 89.00,
    countInStock: 6,
    description: 'Zero-bounce form-fitting compression vest with complete 360-degree visibility layout and secure water pouch slot tracks.'
  },
  {
    name: 'High-Contrast Concrete Soccer Ball',
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&q=80',
    brand: 'Decked',
    category: 'SPORTS',
    price: 45.00,
    countInStock: 15,
    description: 'Textured canvas outer sheets built specifically to handle concrete, wire fences, and hard street matches.'
  },
  {
    name: 'Coarse Sand Skateboard Grip Roll',
    image: 'https://images.unsplash.com/photo-1564982743470-47de0cbecb8b?w=800&q=80',
    brand: 'Decked',
    category: 'SPORTS',
    price: 18.00,
    countInStock: 50,
    description: 'Heavy silicon carbide grit layout backing an array of micro-ventilation ports for clean, bubble-free deck execution.'
  },
  {
    name: 'Tactical Industrial Gym Hauler',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
    brand: 'Ironclad',
    category: 'SPORTS',
    price: 95.00,
    countInStock: 10,
    description: '50L storage volume engineered from ballistic 1680D nylon, complete with independent waterproof shoe vaults.'
  },
  {
    name: 'Anodized Alloy Core Balance Deck',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80',
    brand: 'Ironclad',
    category: 'SPORTS',
    price: 120.00,
    countInStock: 4,
    description: 'Reinforced industrial workout deck platform sitting over a heavy matching high-density rolling structural roll track.'
  }
];

const importData = async () => {
  try {
    await connectDB();

    // Reset current collection data completely
    await Product.deleteMany();

    // Query for the authorization context administrator account
    const adminUser = await User.findOne({ role: 'admin' });
    
    if (!adminUser) {
      console.error("FATAL: Database must have at least one active administrator user framework ready to claim mapping.");
      process.exit(1);
    }

    const sampleProducts = products.map((p) => ({ ...p, user: adminUser._id }));
    await Product.insertMany(sampleProducts);

    console.log('SUCCESS: 50 Custom Neo-Brutalist System Inventory Records Injected Into Pipeline.');
    process.exit();
  } catch (error) {
    console.error(`CRITICAL FAILURE: ${error.message}`);
    process.exit(1);
  }
};

importData();