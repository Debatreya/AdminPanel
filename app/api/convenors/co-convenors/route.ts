import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import '@/lib/models';
import { Society } from '@/lib/models';
import { convenorAuth } from '@/lib/middleware/convenorAuth';

export async function POST(req: Request) {
  // ADMIN or current CONVENOR only
  const auth = await convenorAuth(req);
  if (auth.error) {
    return NextResponse.json(
      { message: auth.error },
      { status: auth.status }
    );
  }

  try {
    await connectDB();

    const body = await req.json();
    const { societyName, coConvenor } = body;

    const { name, imgurl } = coConvenor || {};

    //Validation
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

    //Tech is always derived from current convenor
    const tech = society.currentConvenor.tech;

    // Add co-convenor 
    society.currentCoConvenors.push({
      name,
      imgurl,
      tech
    });

    await society.save();

    return NextResponse.json(
      {
        message: 'Co-convenor added successfully',
        society: society.name,
        tech,
        coConvenor: {
          name,
          imgurl
        }
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
