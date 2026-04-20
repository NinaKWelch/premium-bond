export const okResponse = (body: unknown = {}) =>
  Promise.resolve({ ok: true, json: () => Promise.resolve(body) } as Response);

export const errorResponse = (body: unknown, status = 400) =>
  Promise.resolve({ ok: false, status, json: () => Promise.resolve(body) } as Response);
