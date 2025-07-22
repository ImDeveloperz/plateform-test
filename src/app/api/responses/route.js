const { NextResponse } = require('next/server');
const prisma = require('@/lib/prisma');

const englishAnswersMap = {
  q1: 'am',
  q2: 'are',
  q3: 'hot',
  q4: 'plays',
  q5: 'I visited London last year.',
  q6: 'She visits museums or goes hiking.',
  q7: 'since',
  q8: 'happens',
  q9: "mustn't",
  q10: "She doesn't like remote work.",
  q11: 'went',
};

const logicAnswersMap = {
  q12: '48',
  q13: '112',
  q14: '13',
  q15: 'O',
  q16: 'Pas forcément',
  q17: 'Non',
  q18: 'Non',
  q19: 'Pas forcément',
  q20: 'Triangle',
  q21: "Si je demandais à l'autre gardien quelle porte mène à la sortie, que me dirait-il ?",
};

function calculateScores(formData) {
  let englishScore = 0;
  for (const [key, correct] of Object.entries(englishAnswersMap)) {
    if ((formData[key] || '').trim().toLowerCase() === correct.toLowerCase()) englishScore++;
  }

  const englishLevel = englishScore <= 5 ? 'A1' : englishScore <= 9 ? 'A2' : 'B1';
  const englishPercent = Math.round((englishScore / Object.keys(englishAnswersMap).length) * 100);

  let logicScore = 0;
  for (const [key, correct] of Object.entries(logicAnswersMap)) {
    if ((formData[key] || '').trim().toLowerCase() === correct.toLowerCase()) logicScore++;
  }

  let logicLevel = 'Débutant';
  if (logicScore > 4 && logicScore <= 8) logicLevel = 'Intermédiaire';
  else if (logicScore > 8 && logicScore <= 10) logicLevel = 'Avancé';
  else if (logicScore > 10) logicLevel = 'Expert';

  const logicPercent = Math.round((logicScore / Object.keys(logicAnswersMap).length) * 100);

  return { englishScore, englishLevel, englishPercent, logicScore, logicLevel, logicPercent };
}

async function POST(request) {
  try {
    const formData = await request.json();
    const scores = calculateScores(formData);

    const response = await prisma.response.create({
      data: {
        email: formData.email,
        fullName: formData.fullName,
        position: formData.position,
        company: formData.company,
        objective: formData.objective,
        cityId: formData.cityId,
        ...Object.fromEntries(
          [...Object.keys(englishAnswersMap), ...Object.keys(logicAnswersMap)].map((key) => [key, formData[key]])
        ),
        ...scores,
      }
    });

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error creating response:', error);
    return NextResponse.json({ error: 'Failed to create response' }, { status: 500 });
  }
}

async function GET() {
  try {
    const responses = await prisma.response.findMany({
      include: { city: true },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(responses);
  } catch (error) {
    console.error('Error fetching responses:', error);
    return NextResponse.json({ error: 'Failed to fetch responses' }, { status: 500 });
  }
}

module.exports = { GET, POST };
