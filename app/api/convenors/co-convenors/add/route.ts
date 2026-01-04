import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Society from '@/lib/models/Society';
import { convenorAuth } from '@/lib/middleware/convenorAuth';

export async function POST(req: Request) {
  const auth = await convenorAuth(req);
  if (auth.error) {
    return NextResponse.json(
      { message: auth.error },
      { status: auth.status }
    );
  }

  try {
    await connectDB();

    const { societyName, name, imgurl } = await req.json();

    if (!societyName || !name || !imgurl) {
      return NextResponse.json(
        { message: 'societyName, name and imgurl are required' },
        { status: 400 }
      );
    }

    const society = await Society.findOne({ name: societyName });

    if (!society) {
      return NextResponse.json(
        { message: 'Society not found' },
        { status: 404 }
      );
    }

    // 🔐 Ensure current convenor
    if (!society.currentConvenor.userId.equals(auth.userId)) {
      return NextResponse.json(
        { message: 'Forbidden: Not current convenor' },
        { status: 403 }
      );
    }

    // ❌ Prevent duplicates
    const exists = society.currentCoConvenors.some(
      (cc: { name: any; }) => cc.name === name
    );

    if (exists) {
      return NextResponse.json(
        { message: 'Co-convenor already exists' },
        { status: 409 }
      );
    }

    society.currentCoConvenors.push({
      name,
      imgurl,
      tech: society.currentConvenor.tech
    });

    await society.save();

    return NextResponse.json(
      {
        message: 'Co-convenor added successfully',
        coConvenors: society.currentCoConvenors
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
