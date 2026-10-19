import { isAdmin, adminConfigured } from '@/lib/adminAuth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  return Response.json({ authenticated: await isAdmin(), configured: adminConfigured() });
}
