import { NextResponse } from 'next/server';

import connectDB from '@/lib/db';
import Society from '@/lib/models/Society';
import { convenorAuth } from '@/lib/middleware';

export async function POST(req: Request) {
  // 🔒 Only current convenor allowed
  const auth = await convenorAuth(req);
  if (auth.error) {
    return NextResponse.json(
      { message: auth.error },
      { status: auth.status }
    );
  }

  try {
    await connectDB();

    const { societyName, coConvenors = [] } = await req.json();

    if (!societyName) {
      return NextResponse.json(
        { message: 'societyName is required' },
        { status: 400 }
      );
    }

    if (!Array.isArray(coConvenors)) {
      return NextResponse.json(
        { message: 'coConvenors must be an array' },
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

    // 🔐 Final authority check
    if (!society.currentConvenor.userId.equals(auth.userId)) {
      return NextResponse.json(
        { message: 'Forbidden: Not current convenor' },
        { status: 403 }
      );
    }

    const tech = society.currentConvenor.tech;

    // 🔁 Move existing co-convenors to history
    society.currentCoConvenors.forEach((cc: { name: any; imgurl: any; tech: any; }) => {
      society.coConvenorHistory.push({
        name: cc.name,
        imgurl: cc.imgurl,
        tech: cc.tech
      });
    });

    // 👥 Set new co-convenors
    society.currentCoConvenors = coConvenors.map((cc) => ({
      name: cc.name,
      imgurl: cc.imgurl,
      tech
    }));

    await society.save();

    return NextResponse.json(
      {
        message: 'Co-convenors updated successfully',
        society: society.name,
        tech,
        coConvenors: society.currentCoConvenors
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
