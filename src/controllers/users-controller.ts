import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { userService } from '@/services';

export async function usersPost(req: Request, res: Response) {
  const { email, password } = req.body;

  const user = await userService.createUser({ email, password });

  return res.status(httpStatus.CREATED).json({
    id: user.id,
    email: user.email,
  });
}

export async function upsertGitHubUser(req: Request, res: Response) {
  const { code } = req.body;
  const { email } = await userService.loginWithGitHub(code);
  const result = await userService.upsertGitHubUser(email);
  return res.status(httpStatus.OK).send(result);
}
