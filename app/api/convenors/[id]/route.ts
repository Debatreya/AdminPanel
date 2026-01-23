import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import '@/lib/models';
import { Society,User } from '@/lib/models';
import { convenorAuth } from '@/lib/middleware';
import bcrypt from 'bcryptjs';
import type {
  GetSingleConvenorResponse,
  ConvenorActionResponse,
  ConvenorErrorResponse,
} from '@/types/dto/convenor';
import {
  formatSocietyConvenors
} from '@/lib/formatters/convenor';

/**
 * GET /api/convenors/[id]
 * Public – fetch specific convenor details
 */
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    await connectDB();

    const convenor = await User.findById(id).select(
      'name rollno imgurl role societyName'
    );

    if (!convenor || convenor.role !== 'CONVENOR') {
      return NextResponse.json<ConvenorErrorResponse>(
        { message: 'Convenor not found' },
        { status: 404 }
      );
    }
     const society = await Society.findOne({ name: convenor.societyName })
      .populate('currentConvenor.userId', 'name imgurl')
      .populate('convenorHistory.userId', 'name imgurl');

    if (!society) {
      return NextResponse.json<ConvenorErrorResponse>(
        { message: 'Society not found' },
        { status: 404 }
      );
    }

    // 3️⃣ Format via shared formatter
    const data = formatSocietyConvenors(
      society,
      society.currentConvenor.userId,
      true
    );

      return NextResponse.json<GetSingleConvenorResponse>(
      {
        success: true,
        data,
      },
      { status: 200 }
    );
  } catch (error) {
  console.error('GET /api/convenors/[id] error:', error);
    return NextResponse.json<ConvenorErrorResponse>(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/convenors/[id]
 * ADMIN or same CONVENOR – update convenor profile
 */
export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await convenorAuth(request);
  if (auth.error) {
    return NextResponse.json(
      { message: auth.error },
      { status: auth.status }
    );
  }

  const { id } = await context.params; // ✅ FIX

  // 🔐 Only ADMIN or same CONVENOR
  if (auth.role !== 'ADMIN' && auth.userId !== id) {
    return NextResponse.json(
      { message: 'Forbidden' },
      { status: 403 }
    );
  }

  try {
    await connectDB();

    const { name, imgurl, password } = await request.json();

    const convenor = await User.findById(id);

    if (!convenor || convenor.role !== 'CONVENOR') {
      return NextResponse.json(
        { message: 'Convenor not found' },
        { status: 404 }
      );
    }

    if (name) convenor.name = name;
    if (imgurl) convenor.imgurl = imgurl;

    if (password) {
      convenor.password = await bcrypt.hash(password, 10);
    }

    await convenor.save();

    return NextResponse.json(
      {
        message: 'Convenor updated successfully',
        convenor: {
          id: convenor._id,
          name: convenor.name,
          imgurl: convenor.imgurl,
          societyName: convenor.societyName
        }
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

/**
 * DELETE /api/convenors/[id]
 * ADMIN only – remove convenor role (preserves history)
 */
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await convenorAuth(request);
  if (auth.error) {
    return NextResponse.json(
      { message: auth.error },
      { status: auth.status }
    );
  }

  if (auth.role !== 'ADMIN') {
    return NextResponse.json(
      { message: 'Only admin can delete convenors' },
      { status: 403 }
    );
  }

  try {
    const { id } = await context.params; // ✅ FIX

    await connectDB();

    const convenor = await User.findById(id);

    if (!convenor || convenor.role !== 'CONVENOR') {
      return NextResponse.json(
        { message: 'Convenor not found' },
        { status: 404 }
      );
    }

    // ❗ Preserve history – only remove user
    await User.findByIdAndDelete(id);

    return NextResponse.json(
      { message: 'Convenor deleted successfully' },
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
