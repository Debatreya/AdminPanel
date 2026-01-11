import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

import connectDB from '@/lib/db';
import '@/lib/models';
import { Society, User } from '@/lib/models';
import { SOCIETY_NAMES, YEAR_LEVELS } from '@/constants';

function groupByTechSorted<T extends { tech: number }>(items: T[]) {
  const grouped = items.reduce<Record<number, T[]>>((acc, item) => {
    if (!acc[item.tech]) acc[item.tech] = [];
    acc[item.tech].push(item);
    return acc;
  }, {});

  return Object.fromEntries(
    Object.entries(grouped).sort(
      ([a], [b]) => Number(b) - Number(a)
    )
  );
}



// GET /api/convenors - Get all convenors of a all societies/particular society 

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const societyName = searchParams.get('societyName');

    // ✅ history enabled by default
    const includeHistory = searchParams.get('includeHistory') !== 'false';

    // 🔹 CASE 1: ALL societies
    if (!societyName) {
      const societies = await Society.find({})
        .populate('currentConvenor.userId', 'name imgurl')
        .populate(
          includeHistory ? 'convenorHistory.userId' : '',
          'name imgurl'
        );

      return NextResponse.json(
        {
          societies: societies.map((society) => {
            const base = {
              id: society._id,
              name: society.name,
              logo: society.logo,
              currentConvenor: {
                tech: society.currentConvenor.tech,
                user: society.currentConvenor.userId
              },
              currentCoConvenors: society.currentCoConvenors
            };

            if (includeHistory) {
              return {
                ...base,
                convenorHistory: groupByTechSorted(
                  society.convenorHistory.map((c: { userId: any; tech: any; }) => ({
                    user: c.userId,
                    tech: c.tech
                  }))
                ),
                coConvenorHistory: groupByTechSorted(
                  society.coConvenorHistory
                )
              };
            }

            return base;
          })
        },
        { status: 200 }
      );
    }

    // 🔹 CASE 2: Single society
    if (!Object.values(SOCIETY_NAMES).includes(societyName as SOCIETY_NAMES)) {
      return NextResponse.json(
        { message: 'Invalid society name' },
        { status: 400 }
      );
    }

    const society = await Society.findOne({ name: societyName })
      .populate('currentConvenor.userId', 'name imgurl')
      .populate(
        includeHistory ? 'convenorHistory.userId' : '',
        'name imgurl'
      );

    if (!society) {
      return NextResponse.json(
        { message: 'Society not found' },
        { status: 404 }
      );
    }

    const response: any = {
      id: society._id,
      name: society.name,
      logo: society.logo,
      currentConvenor: {
        tech: society.currentConvenor.tech,
        user: society.currentConvenor.userId
      },
      currentCoConvenors: society.currentCoConvenors
    };

    if (includeHistory) {
      response.convenorHistory = groupByTechSorted(
        society.convenorHistory.map((c: { userId: any; tech: any; }) => ({
          user: c.userId,
          tech: c.tech
        }))
      );

      response.coConvenorHistory = groupByTechSorted(
        society.coConvenorHistory
      );
    }

    return NextResponse.json({ society: response }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}


// This route is not needed as  api/user/add is  alreading adding convenors 

// export async function POST(req: Request) {
//   try {
//     await connectDB();

//     const { societyName, logo, convenor } = await req.json();

//     if (!societyName || !logo || !convenor) {
//       return NextResponse.json(
//         { message: 'Missing required fields' },
//         { status: 400 }
//       );
//     }

//     if (!Object.values(SOCIETY_NAMES).includes(societyName)) {
//       return NextResponse.json(
//         { message: 'Invalid society name' },
//         { status: 400 }
//       );
//     }

//     if (!Object.values(YEAR_LEVELS).includes(convenor.year)) {
//       return NextResponse.json(
//         { message: 'Invalid convenor year level' },
//         { status: 400 }
//       );
//     }

//     const existing = await Society.findOne({ name: societyName });
//     if (existing) {
//       return NextResponse.json(
//         { message: 'Convenor already exists for this society' },
//         { status: 409 }
//       );
//     }

//     const hashedPassword = await bcrypt.hash(convenor.password, 10);

//     const society = await Society.create({
//       name: societyName,
//       logo,
//       convenor: {
//         ...convenor,
//         password: hashedPassword
//       },
//       coConvenors: []
//     });

//     return NextResponse.json(
//       { message: 'Convenor registered successfully', societyId: society._id },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { message: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }