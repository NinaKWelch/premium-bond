'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const clearGuestCookie = async () => {
  const cookieStore = await cookies();

  cookieStore.delete('pb_guest');
};

export const continueAsGuest = async () => {
  const cookieStore = await cookies();

  cookieStore.set('pb_guest', 'true', {
    httpOnly: true,
    path: '/',
    maxAge: 30 * 24 * 60 * 60,
    sameSite: 'lax',
  });

  redirect('/premium-bonds/interest-tracker');
};
