import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

import connectDB from '@/lib/db';
import Society from '@/lib/models/Society';
import { SOCIETY_NAMES,YEAR_LEVELS } from '@/constants';

// GET /api/convenors - Get all convenors
export async function GET(request: Request) {
  // Get convenors logic will go here
}


export async function POST(req: Request) {
  try {
    await connectDB();

    const { societyName, logo, convenor } = await req.json();

    if (!societyName || !logo || !convenor) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!Object.values(SOCIETY_NAMES).includes(societyName)) {
      return NextResponse.json(
        { message: 'Invalid society name' },
        { status: 400 }
      );
    }

    if (!Object.values(YEAR_LEVELS).includes(convenor.year)) {
      return NextResponse.json(
        { message: 'Invalid convenor year level' },
        { status: 400 }
      );
    }

    const existing = await Society.findOne({ name: societyName });
    if (existing) {
      return NextResponse.json(
        { message: 'Convenor already exists for this society' },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(convenor.password, 10);

    const society = await Society.create({
      name: societyName,
      logo,
      convenor: {
        ...convenor,
        password: hashedPassword
      },
      coConvenors: []
    });

    return NextResponse.json(
      { message: 'Convenor registered successfully', societyId: society._id },
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