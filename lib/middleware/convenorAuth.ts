import jwt from 'jsonwebtoken';
import Society from '@/lib/models/Society';
import connectDB from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET!;

interface AuthResult {
  userId?: string;
  role?: 'ADMIN' | 'CONVENOR';
  error?: string;
  status?: number;
}

export async function convenorAuth(
  req: Request
): Promise<AuthResult> {
  try {
    await connectDB();

    const authHeader = req.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        error: 'Unauthorized',
        status: 401
      };
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      role: 'ADMIN' | 'CONVENOR';
    };

    // ✅ ADMIN → always allowed
    if (decoded.role === 'ADMIN') {
      return {
        userId: decoded.userId,
        role: decoded.role
      };
    }

    // 🔹 For convenors, societyName must be provided
    const body = await req.clone().json().catch(() => null);
    const societyName =
      body?.societyName ||
      new URL(req.url).searchParams.get('societyName');

    if (!societyName) {
      return {
        error: 'societyName is required',
        status: 400
      };
    }

    const society = await Society.findOne({ name: societyName });

    if (!society) {
      return {
        error: 'Society not found',
        status: 404
      };
    }

    // 🔐 Check if current convenor
    if (!society.currentConvenor.userId.equals(decoded.userId)) {
      return {
        error: 'Forbidden: Not current convenor',
        status: 403
      };
    }

    // ✅ Authorized convenor
    return {
      userId: decoded.userId,
      role: decoded.role
    };
  } catch (error) {
    console.error('convenorAuth error:', error);
    return {
      error: 'Invalid or expired token',
      status: 401
    };
  }
}
