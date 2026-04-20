import { describe, it, expect, vi, beforeEach } from 'vitest';
import { deleteAccount } from '../users';
import { okResponse, errorResponse } from './apiTestHelpers';

const USERS_BASE = process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/bonds', '') ?? '';

describe('users api', () => {
  const token = 'test-token';
  const mockFetch = vi.fn();

  vi.stubGlobal('fetch', mockFetch);

  beforeEach(() => {
    mockFetch.mockReset();
  });

  describe('deleteAccount', () => {
    it('sends a DELETE request with the auth token', async () => {
      mockFetch.mockReturnValue(okResponse());

      await deleteAccount(token);

      expect(mockFetch).toHaveBeenCalledWith(`${USERS_BASE}/users/me`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
    });

    it('resolves without error on success', async () => {
      mockFetch.mockReturnValue(okResponse());

      await expect(deleteAccount(token)).resolves.toBeUndefined();
    });

    it('throws with the error message from the api on failure', async () => {
      mockFetch.mockReturnValue(errorResponse({ error: 'User not found' }));

      await expect(deleteAccount(token)).rejects.toThrow('User not found');
    });

    it('throws a fallback message when the api returns no error field', async () => {
      mockFetch.mockReturnValue(errorResponse({}));

      await expect(deleteAccount(token)).rejects.toThrow('Failed to delete account');
    });

    it('throws a fallback message when the api returns invalid json', async () => {
      mockFetch.mockReturnValue(
        Promise.resolve({
          ok: false,
          json: () => Promise.reject(new Error('invalid json')),
        } as Response),
      );

      await expect(deleteAccount(token)).rejects.toThrow('Failed to delete account');
    });
  });
});
