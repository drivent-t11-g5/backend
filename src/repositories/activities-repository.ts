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

async function isUserSubscribed(userId: number, activityId: number){
  const response = await prisma.activitiesUser.findFirst({
    where: {
      userId, activityId
    }
  })
  if (!response) return false;
  return true;
}

async function getUserActivities(userId: number){
  return await prisma.activitiesUser.findMany({
    where:{userId},
    include: {Activities: true}
  });
}

const activitiesRepository = { getActivities, getOccupiedSeats, createRegisterActivity, getActivity, isUserSubscribed, getUserActivities };

export default activitiesRepository;
