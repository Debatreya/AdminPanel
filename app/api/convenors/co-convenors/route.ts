import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import '@/lib/models';
import { Society } from '@/lib/models';
import { convenorAuth } from '@/lib/middleware';

export async function POST(req: Request) {
  // 🔒 ADMIN or current CONVENOR
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

    // 🔹 Validation
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

    const tech = society.currentConvenor.tech;

    // 🔁 Move existing co-convenors to history
    society.currentCoConvenors.forEach((cc) => {
      society.coConvenorHistory.push({
        name: cc.name,
        imgurl: cc.imgurl,
        tech: cc.tech
      });
    });

    // 🔄 Replace current co-convenors
    society.currentCoConvenors = coConvenors.map((cc) => ({
      name: cc.name,
      imgurl: cc.imgurl,
      tech   // derived, never client-controlled
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

export async function PATCH(req: Request) {
  const auth = await convenorAuth(req);
  if (auth.error) {
    return NextResponse.json(
      { message: auth.error },
      { status: auth.status }
    );
  }

  try {
    await connectDB();

    const { societyName, coConvenorId, coConvenor } = await req.json();
    const { name, imgurl } = coConvenor || {};

    // 🔹 Validation
    if (!societyName || !name || !imgurl) {
      return NextResponse.json(
        {
          message:
            'societyName and coConvenor (name, imgurl) are required'
        },
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

    const tech = society.currentConvenor.tech;

    // ✏️ EDIT existing co-convenor
    if (coConvenorId) {
      const existing = society.currentCoConvenors.id(coConvenorId);

      if (!existing) {
        return NextResponse.json(
          { message: 'Co-convenor not found' },
          { status: 404 }
        );
      }

      existing.name = name;
      existing.imgurl = imgurl;
      existing.tech = tech;
    }
    // ➕ ADD new co-convenor
    else {
      society.currentCoConvenors.push({
        name,
        imgurl,
        tech
      });
    }

    await society.save();

    return NextResponse.json(
      {
        message: coConvenorId
          ? 'Co-convenor updated successfully'
          : 'Co-convenor added successfully',
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
