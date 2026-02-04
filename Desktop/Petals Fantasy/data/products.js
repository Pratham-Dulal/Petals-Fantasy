// Simulated Database
const PRODUCTS_DB = [
    {
        id: "pf-001",
        name: "Classic Tulip Duo",
        slug: "classic-tulip-duo",
        price: 1800,
        category: "Romantic",
        tags: ["tulip", "simple", "elegant"],
        image: "images/Classic Tulip Duo bouquet.jpg.jpeg",
        description: "A timeless pairing of premium handcrafted tulips. Simple, elegant, and perfect for a subtle gesture of love.",
        rating: 4.8
    },
    {
        id: "pf-002",
        name: "Royal Red Ribbon",
        slug: "royal-red-ribbon",
        price: 2500,
        category: "Anniversary",
        tags: ["rose", "luxury", "red"],
        image: "images/Royal Red Ribbon Bouquet.jpg.jpeg",
        description: "A majestic arrangement of deep red paper roses, tied with our signature royal ribbon for a grand statement.",
        rating: 5.0
    },
    {
        id: "pf-003",
        name: "Satin Tulip Luxe",
        slug: "satin-tulip-luxe",
        price: 3200,
        category: "Premium",
        tags: ["tulip", "satin", "black-pink"],
        image: "images/Satin Tulip Bouquet (Pink & Black).jpg.jpeg",
        description: "An avant-garde mix of soft pink and satin black tulips. For those who appreciate modern, edgy aesthetics.",
        rating: 4.9
    },
    {
        id: "pf-004",
        name: "Sun Kissed Sunflower",
        slug: "sun-kissed-sunflower",
        price: 2100,
        category: "Birthday",
        tags: ["sunflower", "cheerful", "yellow"],
        image: "images/Sun kissed sunflower bouquet.jpg.jpeg",
        description: "Radiate happiness with these everlasting sunflowers. Captures the warmth of summer in a permanent bouquet.",
        rating: 4.7
    },
    {
        id: "pf-005",
        name: "Velvet Red Medallion",
        slug: "velvet-red-medallion",
        price: 3500,
        category: "Luxury",
        tags: ["rose", "velvet", "premium"],
        image: "images/Velvet Red Rose Medallion bouquet.jpg.jpeg",
        description: "Our flagship luxurious bouquet. Velvet-textured paper roses arranged in a medallion style.",
        rating: 5.0
    },
    {
        id: "pf-006",
        name: "Red Ribbon Rose",
        slug: "red-ribbon-rose",
        price: 1500,
        category: "Romantic",
        tags: ["rose", "classic", "budget"],
        image: "images/red ribbon rose bouquet.jpg.jpeg",
        description: "The classic paper rose bouquet. Affordable, beautiful, and everlasting.",
        rating: 4.5
    }
];

// In a real app, this would be a JSON file fetched via HTTP
// Here we export it for our API layer simulation
if (typeof module !== 'undefined') module.exports = PRODUCTS_DB;
