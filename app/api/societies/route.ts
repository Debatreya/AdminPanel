import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import { NextResponse } from 'next/server';
import { SOCIETY_NAMES,YEAR_LEVELS } from '@/constants';
import Society from '@/lib/models/Society';


// NOTE: NOT NEEDED AS  GET api/convenonrs return the same response 


// GET /api/societies - Get all societies    
export async function GET(request: Request) {
  // Get societies logic will go here
}

// POST /api/societies - Create new society
export async function POST(request: Request) {
  try {
    await connectDB();

    const { societyName, logo, convenor } = await request.json();

    if (!societyName || !logo || !convenor) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // ✅ Validate against enum
    if (!Object.values(SOCIETY_NAMES).includes(societyName)) {
      return NextResponse.json(
        { message: 'Invalid society name' },
        { status: 400 }
      );
    }

    // Prevent duplicates
    const existing = await Society.findOne({ name: societyName });
    if (existing) {
      return NextResponse.json(
        { message: 'Society already exists' },
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
      {
        message: 'Society created successfully',
        societyId: society._id
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


// PUT /api/societies - Update society
export async function PUT(request: Request) {
  // Update society logic will go here
}

// PATCH /api/societies - Partial update society
export async function PATCH(request: Request) {
  // Partial update society logic will go here
}

// DELETE /api/societies - Delete society
export async function DELETE(request: Request) {
  // Delete society logic will go here
}
