import { NextResponse } from 'next/server'

import { DEVELOPER_ROLES, YEAR_LEVELS } from '@/constants/enums'
import connectDB from '@/lib/db'
import '@/lib/models'
import { Developer } from '@/lib/models'
import { adminAuth } from '@/lib/middleware'
import type {
  DeleteDeveloperResponse,
  DeveloperResponse,
  DeveloperErrorResponse,
  GetDeveloperResponse,
  UpdateDeveloperRequest,
  UpdateDeveloperResponse,
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

async function findDeveloper(id: string) {
  const byCustomId = await Developer.findOne({ id })
  if (byCustomId) return byCustomId
  return Developer.findById(id)
}

// GET /api/developers/[id] - Get specific developer
export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()

    const developer = await findDeveloper(params.id)

    if (!developer) {
      return NextResponse.json<DeveloperErrorResponse>(
        { message: 'Developer not found' },
        { status: 404 }
      )
    }

    return NextResponse.json<GetDeveloperResponse>(
      {
        success: true,
        data: formatDeveloper(developer),
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching developer:', error)
    return NextResponse.json<DeveloperErrorResponse>(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/developers/[id] - Delete developer
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  // 🔒 Admin protection
  const authResponse = await adminAuth(request)
  if (authResponse) return authResponse

  try {
    await connectDB()

    const deleted = await Developer.findOneAndDelete({ id: params.id }) || await Developer.findByIdAndDelete(params.id)

    if (!deleted) {
      return NextResponse.json<DeveloperErrorResponse>(
        { message: 'Developer not found' },
        { status: 404 }
      )
    }

    return NextResponse.json<DeleteDeveloperResponse>(
      {
        success: true,
        message: 'Developer deleted successfully',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting developer:', error)
    return NextResponse.json<DeveloperErrorResponse>(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH /api/developers/[id] - Update developer
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  // 🔒 Admin protection
  const authResponse = await adminAuth(request)
  if (authResponse) return authResponse

  try {
    await connectDB()

    let body: UpdateDeveloperRequest
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

    const updates: Record<string, unknown> = {}

    if (developer.name) updates.name = developer.name
    if (developer.imgURL) updates.imgURL = developer.imgURL
    if (developer.github) updates.github = developer.github
    if (developer.insta) updates.insta = developer.insta
    if (developer.linkedin) updates.linkedin = developer.linkedin

    if (developer.year) {
      if (!VALID_YEARS.has(developer.year)) {
        return NextResponse.json<DeveloperErrorResponse>(
          { message: 'Invalid year value' },
          { status: 400 }
        )
      }
      updates.year = developer.year
    }

    if (developer.role) {
      if (!VALID_ROLES.has(developer.role)) {
        return NextResponse.json<DeveloperErrorResponse>(
          { message: 'Invalid role value' },
          { status: 400 }
        )
      }
      updates.role = developer.role
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json<DeveloperErrorResponse>(
        { message: 'At least one updatable field is required' },
        { status: 400 }
      )
    }

    const updated = await Developer.findOneAndUpdate(
      { id: params.id },
      { $set: updates },
      { new: true }
    ) || await Developer.findByIdAndUpdate(
      params.id,
      { $set: updates },
      { new: true }
    )

    if (!updated) {
      return NextResponse.json<DeveloperErrorResponse>(
        { message: 'Developer not found' },
        { status: 404 }
      )
    }

    return NextResponse.json<UpdateDeveloperResponse>(
      {
        success: true,
        message: 'Developer updated successfully',
        data: formatDeveloper(updated),
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error updating developer:', error)
    return NextResponse.json<DeveloperErrorResponse>(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}