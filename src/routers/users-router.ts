import { Router } from 'express';

import { createUserSchema } from '@/schemas';
import { validateBody } from '@/middlewares';
import { upsertGitHubUser, usersPost } from '@/controllers';

const usersRouter = Router();

usersRouter.post('/', validateBody(createUserSchema), usersPost);
usersRouter.post('/github', upsertGitHubUser);

export { usersRouter };
