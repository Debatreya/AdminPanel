import { NextResponse } from 'next/server'

import { DEVELOPER_ROLES, YEAR_LEVELS } from '@/constants/enums'
import connectDB from '@/lib/db'
import '@/lib/models'
import { Developer } from '@/lib/models'
import { adminAuth } from '@/lib/middleware'
import type {
  CreateDeveloperRequest,
  CreateDeveloperResponse,
  DeveloperResponse,
  DeveloperErrorResponse,
  GetAllDevelopersResponse,
} from '@/types/dto/developer'

const VALID_YEARS = new Set<string>(Object.values(YEAR_LEVELS))
const VALID_ROLES = new Set<string>(Object.values(DEVELOPER_ROLES))

function formatDeveloper(doc: any): DeveloperResponse {
  const obj = doc?.toObject ? doc.toObject() : doc;

  return {
    id: obj._id?.toString?.() ?? obj._id, // ✅ alias
    name: obj.name,
    imgURL: obj.imgURL,
    year: obj.year,
    role: obj.role,
    github: obj.github,
    insta: obj.insta,
    linkedin: obj.linkedin,
    createdAt:
      obj.createdAt instanceof Date
        ? obj.createdAt.toISOString()
        : obj.createdAt,
    updatedAt:
      obj.updatedAt instanceof Date
        ? obj.updatedAt.toISOString()
        : obj.updatedAt
  };
}

// GET /api/developers - Get all developers
export async function GET(_request: Request) {
  try {
    await connectDB()

    const developers = await Developer.find({}).sort({ createdAt: -1 })
    const data = developers.map(formatDeveloper)

    return NextResponse.json<GetAllDevelopersResponse>(
      {
        success: true,
        data,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching developers:', error)
    return NextResponse.json<DeveloperErrorResponse>(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/developers - Create new developer
export async function POST(request: Request) {
  // 🔒 Admin protection
  const authResponse = await adminAuth(request);
  if (authResponse) return authResponse;

  try {
    await connectDB();

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { message: 'Invalid JSON body' },
        { status: 400 }
      );
    }

    const { developer } = body || {};

    if (!developer || typeof developer !== 'object') {
      return NextResponse.json(
        { message: 'developer payload is required' },
        { status: 400 }
      );
    }

    const { name, imgURL, year, role, github, insta, linkedin } = developer;

    // 🔹 Validation
    if (!name || !imgURL || !year || !role || !github || !insta || !linkedin) {
      return NextResponse.json(
        {
          message:
            'All fields (name, imgURL, year, role, github, insta, linkedin) are required'
        },
        { status: 400 }
      );
    }

    if (!Object.values(YEAR_LEVELS).includes(year)) {
      return NextResponse.json(
        { message: 'Invalid year value' },
        { status: 400 }
      );
    }

    if (!Object.values(DEVELOPER_ROLES).includes(role)) {
      return NextResponse.json(
        { message: 'Invalid role value' },
        { status: 400 }
      );
    }

    const newDeveloper = await Developer.create({
      name,
      imgURL,
      year,
      role,
      github,
      insta,
      linkedin
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Developer created successfully',
        data: formatDeveloper(newDeveloper)
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating developer:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
