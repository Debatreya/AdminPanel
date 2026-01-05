import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

import connectDB from '@/lib/db';
import '@/lib/models';                 
import { User } from '@/lib/models';
import { SOCIETY_NAMES } from '@/constants/enums';

// CREATE USER (ADMIN / CONVENOR)
export async function POST(req: Request) {
  try {
    await connectDB();

    let body;
      try {
        body = await req.json();
      } catch {
        return NextResponse.json(
          { message: 'Invalid JSON body' },
          { status: 400 }
        );
      }

    const { name, rollno, password, role, societyName, imgurl } = body;


    //Basic validation
    if (!name || !rollno || !password || !role || !imgurl) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!['ADMIN', 'CONVENOR'].includes(role)) {
      return NextResponse.json(
        { message: 'Invalid user role' },
        { status: 400 }
      );
    }

    // Role-based rules
    if (role === 'CONVENOR') {
      if (!societyName) {
        return NextResponse.json(
          { message: 'societyName is required for convenor' },
          { status: 400 }
        );
      }

      if (!Object.values(SOCIETY_NAMES).includes(societyName)) {
        return NextResponse.json(
          { message: 'Invalid society name' },
          { status: 400 }
        );
      }
    }

    if (role === 'ADMIN' && societyName) {
      return NextResponse.json(
        { message: 'Admin cannot be associated with a society' },
        { status: 400 }
      );
    }

    //Prevent duplicate users
    const existingUser = await User.findOne({ rollno });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists with this roll number' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      rollno,
      imgurl,                              
      password: hashedPassword,
      role,
      societyName: role === 'CONVENOR' ? societyName : undefined
    });

    return NextResponse.json(
      {
        message: 'User created successfully',
        user: {
          id: user._id,
          name: user.name,
          rollno: user.rollno,
          imgurl: user.imgurl,
          role: user.role,
          societyName: user.societyName
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
