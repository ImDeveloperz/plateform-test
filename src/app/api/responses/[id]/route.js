const { NextResponse } = require('next/server');
const prisma = require('@/lib/prisma');

async function GET(request, { params }) {
  try {
    const response = await prisma.response.findUnique({
      where: { id: params.id },
      include: { city: true }
    });

    if (!response) {
      return NextResponse.json({ error: 'Response not found' }, { status: 404 });
    }

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch response' }, { status: 500 });
  }
}

async function DELETE(request, { params }) {
  try {
    await prisma.response.delete({ where: { id: params.id } });
    return NextResponse.json({ message: 'Response deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete response' }, { status: 500 });
  }
}

module.exports = { GET, DELETE };
