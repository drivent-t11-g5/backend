import { AuthenticatedRequest } from "@/middlewares";
import activitiesService from "@/services/activities-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getActivities(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;

    const activities = await activitiesService.getActivities(userId);

    res.status(httpStatus.OK).send(activities);
}

export async function postActivityToUser(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    const { activityId } = req.body;

    const response = await activitiesService.postActivityToUser(userId, activityId);

    res.sendStatus(httpStatus.OK)
}