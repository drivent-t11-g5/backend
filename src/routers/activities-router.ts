import { getActivities, postActivityToUser } from '@/controllers/activities-controller';
import { authenticateToken, validateBody } from '@/middlewares';
import userActivitySchema from '@/schemas/insert-activity-user-schema';
import { Router } from 'express';

const activityRouter = Router();

activityRouter
    .all('/*', authenticateToken)
    .get('/', getActivities)
    .post('/', validateBody(userActivitySchema), postActivityToUser)

export { activityRouter };
