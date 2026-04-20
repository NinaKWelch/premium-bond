const USERS_BASE = process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/bonds', '') ?? '';

type TErrorResponse = {
  error?: string;
};

const parseError = async (res: Response, fallback: string): Promise<string> => {
  try {
    const body = (await res.json()) as TErrorResponse;

    return body.error ?? fallback;
  } catch {
    return fallback;
  }
};

export const deleteAccount = async (token: string): Promise<void> => {
  const res = await fetch(`${USERS_BASE}/users/me`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error(await parseError(res, 'Failed to delete account'));
  }
};
