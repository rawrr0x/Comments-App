import { Response } from 'express';

export const setTokenToCookies = (
  res: Response,
  name: string,
  token: string,
  maxAge: number,
) => {
  return res.cookie(name, token, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge,
  });
};
