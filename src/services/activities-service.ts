import { NotAcceptable, notFoundError, paymentRequiredError } from '@/errors';
import { enrollmentRepository, ticketsRepository } from '@/repositories';
import activitiesRepository from '@/repositories/activities-repository';

// Adicionei interfaces para representar os tipos dos dados envolvidos
interface OccupiedSeat {
  activityId: number;
  _count: {
    activityId: number;
  };
}

interface Activity {
  id: number;
  // Adicione outras propriedades da atividade conforme necessário
}

interface ActivityWithOccupiedSeats {
  id: number;
  // Adicione outras propriedades da atividade aqui conforme necessário
  occupiedSeats: number;
}

async function getActivities(userId: number): Promise<ActivityWithOccupiedSeats[]> {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) {
    throw paymentRequiredError();
  }
  if (ticket.status !== 'PAID') {
    throw paymentRequiredError();
  }
  if (!ticket.TicketType.includesHotel) {
    throw NotAcceptable();
  }

  const activities = await activitiesRepository.getActivities();
  const occupiedSeats = await activitiesRepository.getOccupiedSeats();

  const occupiedSeatsMap: { [activityId: number]: number } = {};
  // Adicionei um tipo explícito para o parâmetro 'item'
  occupiedSeats.forEach((item: OccupiedSeat) => {
    occupiedSeatsMap[item.activityId] = item._count.activityId;
  });

  const activitiesWithOccupiedSeats = activities.map(
    (activity: Activity): ActivityWithOccupiedSeats => ({
      ...activity,
      occupiedSeats: occupiedSeatsMap[activity.id] || 0,
    }),
  );

  return activitiesWithOccupiedSeats;
}

async function postActivityToUser(userId: number, activityId: number): Promise<any> {
  const activity = await activitiesRepository.getActivity(activityId);
  if (!activity) throw notFoundError();

  const response = await activitiesRepository.createRegisterActivity(userId, activityId);
  return response;
}

const activitiesService = { getActivities, postActivityToUser };

export default activitiesService;
