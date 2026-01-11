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
  const obj = doc?.toObject ? doc.toObject() : doc
  return {
    _id: obj._id?.toString?.() ?? obj._id,
    id: obj.id,
    name: obj.name,
    imgURL: obj.imgURL,
    year: obj.year,
    role: obj.role,
    github: obj.github,
    insta: obj.insta,
    linkedin: obj.linkedin,
    createdAt: obj.createdAt instanceof Date ? obj.createdAt.toISOString() : obj.createdAt,
    updatedAt: obj.updatedAt instanceof Date ? obj.updatedAt.toISOString() : obj.updatedAt,
  }
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
  const authResponse = await adminAuth(request)
  if (authResponse) return authResponse

  try {
    await connectDB()

    let body: CreateDeveloperRequest
    try {
      body = await request.json()
    } catch {
        return NextResponse.json<DeveloperErrorResponse>(
        { message: 'Invalid JSON body' },
        { status: 400 }
      )
    }

    const { developer } = body || {}

    if (!developer || typeof developer !== 'object') {
      return NextResponse.json<DeveloperErrorResponse>(
        { message: 'developer payload is required' },
        { status: 400 }
      )
    }

    const { id, name, imgURL, year, role, github, insta, linkedin } = developer

    if (!id || !name || !imgURL || !year || !role || !github || !insta || !linkedin) {
      return NextResponse.json<DeveloperErrorResponse>(
        { message: 'All fields (id, name, imgURL, year, role, github, insta, linkedin) are required' },
        { status: 400 }
      )
    }

    if (!VALID_YEARS.has(year)) {
      return NextResponse.json<DeveloperErrorResponse>(
        { message: 'Invalid year value' },
        { status: 400 }
      )
    }

    if (!VALID_ROLES.has(role)) {
      return NextResponse.json<DeveloperErrorResponse>(
        { message: 'Invalid role value' },
        { status: 400 }
      )
    }

    // Prevent duplicate developer IDs
    const existing = await Developer.findOne({ id })
    if (existing) {
      return NextResponse.json<DeveloperErrorResponse>(
        { message: 'Developer already exists with this id' },
        { status: 409 }
      )
    }

    const newDeveloper = await Developer.create({
      id,
      name,
      imgURL,
      year,
      role,
      github,
      insta,
      linkedin,
    })

    return NextResponse.json<CreateDeveloperResponse>(
      {
        success: true,
        message: 'Developer created successfully',
        data: formatDeveloper(newDeveloper),
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating developer:', error)
    return NextResponse.json<DeveloperErrorResponse>(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}