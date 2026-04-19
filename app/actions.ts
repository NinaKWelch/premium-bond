'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function continueAsGuest() {
  const cookieStore = await cookies();

  cookieStore.set('pb_guest', 'true', {
    httpOnly: true,
    path: '/',
    maxAge: 30 * 24 * 60 * 60,
    sameSite: 'lax',
  });

  redirect('/dashboard');
}
