import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import '@/lib/models';
import { FAQ } from '@/lib/models';
import { adminAuth } from '@/lib/middleware';
import type {
  DeleteFAQResponse,
  ErrorResponse,
  GetSingleFAQResponse,
  UpdateFAQRequest,
  UpdateFAQResponse
} from '@/types/dto/faq';

// GET /api/faq/[id] - Get specific FAQ item
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const faq = await FAQ.findById(params.id);

    if (!faq) {
      return NextResponse.json(
        { message: 'FAQ not found' },
        { status: 404 }
      );
    }

    return NextResponse.json<GetSingleFAQResponse>(
      {
        success: true,
        data: faq
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching FAQ:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/faq/[id] - Delete FAQ item
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  // 🔒 Admin protection
  const authResponse = await adminAuth(request);
  if (authResponse) return authResponse;

  try {
    await connectDB();

    const faq = await FAQ.findByIdAndDelete(params.id);

    if (!faq) {
      return NextResponse.json<ErrorResponse>(
        { message: 'FAQ not found' },
        { status: 404 }
      );
    }

    return NextResponse.json<DeleteFAQResponse>(
      {
        success: true,
        message: 'FAQ deleted successfully'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    return NextResponse.json<ErrorResponse>(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/faq/[id] - Update FAQ item
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  // 🔒 Admin protection
  const authResponse = await adminAuth(request);
  if (authResponse) return authResponse;

  try {
    await connectDB();

    const { faq }: UpdateFAQRequest = await request.json();

    // 🔹 Validation
    if (!faq || typeof faq !== 'string' || faq.trim() === '') {
      return NextResponse.json(
        { message: 'FAQ content is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    const updatedFAQ = await FAQ.findByIdAndUpdate(
      params.id,
      { faq: faq.trim() },
      { new: true, runValidators: true }
    );

    if (!updatedFAQ) {
      return NextResponse.json<ErrorResponse>(
        { message: 'FAQ not found' },
        { status: 404 }
      );
    }

    return NextResponse.json<UpdateFAQResponse>(
      {
        success: true,
        message: 'FAQ updated successfully',
        data: updatedFAQ
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating FAQ:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}