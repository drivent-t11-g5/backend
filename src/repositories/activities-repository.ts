import { prisma } from '@/config';

async function getActivities() {
  return await prisma.activities.findMany({});
}

async function getOccupiedSeats() {
  return await prisma.activitiesUser.groupBy({
    by: ['activityId'],
    _count: {
      activityId: true,
    },
  });
}

async function getActivity(activityId: number) {
  return await prisma.activities.findUnique({
    where: { id: activityId },
  });
}

async function createRegisterActivity(userId: number, activityId: number) {
  return await prisma.activitiesUser.create({
    data: {
      userId,
      activityId,
    },
  });
}

const activitiesRepository = { getActivities, getOccupiedSeats, createRegisterActivity, getActivity };

export default activitiesRepository;
