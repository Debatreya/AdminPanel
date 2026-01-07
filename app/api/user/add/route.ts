import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import '@/lib/models';
import { Society, User } from '@/lib/models';
import { SOCIETY_NAMES } from '@/constants/enums';
import { adminAuth } from '@/lib/middleware/adminAuth';

export async function POST(req: Request) {
  // 🔒 Admin protection
  const authResponse = await adminAuth(req);
  if (authResponse) return authResponse;

  try {
    await connectDB();

    const {
      name,
      rollno,
      password,
      imgurl,
      societyName,
      tech,
      coConvenors = []
    } = await req.json();

    // 🔹 Validation
    if (!name || !rollno || !societyName || !tech || !imgurl) {
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

    const safeCoConvenors = Array.isArray(coConvenors)
      ? coConvenors
      : [];

    // 1️⃣ Find or create USER
    let user = await User.findOne({ rollno });

    if (!user) {
      if (!password) {
        return NextResponse.json(
          { message: 'Password required to create new user' },
          { status: 400 }
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      user = await User.create({
        name,
        rollno,
        imgurl,
        password: hashedPassword,
        role: 'CONVENOR',
        societyName
      });
    } else {
      // keep profile image fresh
      user.imgurl = imgurl;
      await user.save();
    }

    // 2️⃣ Find society
    let society = await Society.findOne({ name: societyName });

    // 3️⃣ Society DOES NOT exist → create
    if (!society) {
      society = await Society.create({
        name: societyName,
        logo: 'default',

        currentConvenor: {
          userId: user._id,
          tech
        },

        currentCoConvenors: safeCoConvenors.map((cc) => ({
          name: cc.name,
          imgurl: cc.imgurl,
          tech
        })),

        convenorHistory: [],
        coConvenorHistory: []
      });

      return NextResponse.json(
        {
          message: 'Society created and convenor assigned',
          society: society.name,
          convenor: {
            name: user.name,
            imgurl: user.imgurl
          },
          tech
        },
        { status: 201 }
      );
    }

    // 4️⃣ Society EXISTS → rotate convenor

    if (society.currentConvenor) {
      const oldUser = await User.findById(
        society.currentConvenor.userId
      );

      society.convenorHistory.push({
        userId: society.currentConvenor.userId,
        name: oldUser?.name || 'Unknown',
        imgurl: oldUser?.imgurl || '', // ✅ FIX
        tech: society.currentConvenor.tech
      });
    }

    // move old co-convenors to history
    society.currentCoConvenors.forEach((cc: { name: any; imgurl: any; tech: any; }) => {
      society.coConvenorHistory.push({
        name: cc.name,
        imgurl: cc.imgurl,
        tech: cc.tech
      });
    });

    // assign new convenor
    society.currentConvenor = {
      userId: user._id,
      tech
    };

    // assign new co-convenors
    society.currentCoConvenors = safeCoConvenors.map((cc) => ({
      name: cc.name,
      imgurl: cc.imgurl,
      tech
    }));

    await society.save();

    return NextResponse.json(
      {
        message: 'Convenor rotated successfully',
        society: society.name,
        convenor: {
          name: user.name,
          imgurl: user.imgurl
        },
        tech
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
