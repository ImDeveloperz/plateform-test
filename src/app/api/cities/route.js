const { NextResponse } = require('next/server');
const prisma = require('@/lib/prisma');

async function GET() {
  try {
    const cities = await prisma.city.findMany({
      orderBy: { name: 'asc' }
    });
    return NextResponse.json(cities);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch cities' }, { status: 500 });
  }
}

async function POST(request) {
  try {
    const { name } = await request.json();
    const city = await prisma.city.create({
      data: { name }
    });
    return NextResponse.json(city, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create city' }, { status: 500 });
  }
}

module.exports = { GET, POST };
