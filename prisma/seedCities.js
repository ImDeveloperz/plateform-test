import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const cities = [
        { name: 'Tinghir (promo1)' },
        { name: 'Tinghir (promo2)' },
        { name: 'Témara' },
        { name: 'Essaouira' },
        { name: 'Sidi kacem' },
        { name: 'Tata' },
        { name: 'Tantan' },
        { name: 'Laayoune' },
        { name: 'Es-semara' },
        { name: 'Tchad' },
        { name: 'Borondi' },
    ];

    for (const city of cities) {
        try {
            await prisma.city.create({
                data: city,
            });
        } catch (error) {
            console.error(`Erreur lors de l'ajout de la ville ${city.name}:`, error);
        }
    }
}

main()
    .then(() => {
        console.log('✅ Cities added successfully');
        return prisma.$disconnect();
    })
    .catch((e) => {
        console.error(e);
        return prisma.$disconnect();
    });
