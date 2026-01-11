import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import '@/lib/models';
import { FAQ } from '@/lib/models';
import { adminAuth } from '@/lib/middleware';
import type {
  CreateFAQRequest,
  CreateFAQResponse,
  ErrorResponse,
  GetAllFAQsResponse
} from '@/types/dto/faq';

// GET /api/faq - Get all FAQ items
export async function GET(request: Request) {
  try {
    await connectDB();

    const faqs = await FAQ.find({}).sort({ createdAt: -1 });

    return NextResponse.json<GetAllFAQsResponse>(
      {
        success: true,
        data: faqs
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/faq - Create new FAQ item
export async function POST(request: Request) {
  // 🔒 Admin protection
  const authResponse = await adminAuth(request);
  if (authResponse) return authResponse;

  try {
    await connectDB();

    const { faq }: CreateFAQRequest = await request.json();

    // 🔹 Validation
    if (!faq || typeof faq !== 'string' || faq.trim() === '') {
      return NextResponse.json(
        { message: 'FAQ content is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    // Create new FAQ
    const newFAQ = await FAQ.create({
      faq: faq.trim()
    });

    return NextResponse.json<CreateFAQResponse>(
      {
        success: true,
        message: 'FAQ created successfully',
        data: newFAQ
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating FAQ:', error);
    return NextResponse.json<ErrorResponse>(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}