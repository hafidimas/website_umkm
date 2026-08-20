import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seed...');

    // 1. Seed Categories
    const categoriesData = [
        {
            slug: 'leafy',
            nameId: 'Sayuran Daun',
            nameEn: 'Leafy Greens',
            descriptionId: 'Pakcoy, Selada Romaine, Bayam Horenzo, Kale Keriting, Kangkung, Sawi Pahit.',
            descriptionEn: 'Fresh crisp hydroponic leafy vegetables harvested at 05:00 AM.',
            iconName: 'fa-leaf',
            imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80',
            displayOrder: 1,
        },
        {
            slug: 'fruits',
            nameId: 'Buah & Sayur Buah',
            nameEn: 'Fruits & Veggies',
            descriptionId: 'Tomat Ceri Organik Manis, Strawberry Hidroponik, Cabai Kebun.',
            descriptionEn: 'Naturally sweet cherry tomatoes, strawberries, and garden peppers.',
            iconName: 'fa-apple-whole',
            imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80',
            displayOrder: 2,
        },
        {
            slug: 'herbs',
            nameId: 'Herbal & Rempah',
            nameEn: 'Herbs & Spices',
            descriptionId: 'Daun Mint Hydroponic, Rosemary, Thyme, Basil aromatik.',
            descriptionEn: 'Fragrant essential-oil rich hydroponic herbs and culinary spices.',
            iconName: 'fa-seedling',
            imageUrl: 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?auto=format&fit=crop&w=800&q=80',
            displayOrder: 3,
        },
        {
            slug: 'mushrooms',
            nameId: 'Microgreens & Jamur',
            nameEn: 'Microgreens & Mushrooms',
            descriptionId: 'Tunas microgreens gizi tinggi dan Jamur Tiram Organik.',
            descriptionEn: 'Superfood microgreen sprouts and clean organic oyster mushrooms.',
            iconName: 'fa-wheat-awn',
            imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
            displayOrder: 4,
        },
        {
            slug: 'kits',
            nameId: 'Starter Kit Kebun',
            nameEn: 'Garden Starter Kits',
            descriptionId: 'Paket menanam hidroponik mandiri di rumah lengkap dengan nutrisi AB Mix.',
            descriptionEn: 'Complete home hydroponic starter kits with pure AB Mix nutrients.',
            iconName: 'fa-box-open',
            imageUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80',
            displayOrder: 5,
        },
    ];

    for (const cat of categoriesData) {
        await prisma.category.upsert({
            where: { slug: cat.slug },
            update: cat,
            create: cat,
        });
    }

    console.log('✅ Categories seeded successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
