import { NotAcceptable, notFoundError, paymentRequiredError } from '@/errors';
import { ticketsRepository } from '@/repositories';
import activitiesRepository from '@/repositories/activities-repository';
import httpStatus from 'http-status';

async function getActivities(userId: number) {
  const ticket = await ticketsRepository.findTicketById(userId);
  if (ticket.status === 'RESERVED') throw paymentRequiredError();
  if (!ticket.TicketType.includesHotel) throw NotAcceptable();

  const activities = await activitiesRepository.getActivities();
  const occupiedSeats = await activitiesRepository.getOccupiedSeats();

  const occupiedSeatsMap: { [activityId: number]: number } = {};
  occupiedSeats.forEach((item) => {
    occupiedSeatsMap[item.activityId] = item._count.activityId;
  });

  const activitiesWithOccupiedSeats = activities.map((activity) => ({
    ...activity,
    occupiedSeats: occupiedSeatsMap[activity.id] || 0,
  }));

  return activitiesWithOccupiedSeats;
}

async function postActivityToUser(userId:number, activityId: number){
  const activity = await activitiesRepository.getActivity(activityId);
  if(!activity) throw notFoundError();

  const response = await activitiesRepository.createRegisterActivity(userId, activityId);
  return response;
}

const activitiesService = { getActivities, postActivityToUser };

export default activitiesService;
