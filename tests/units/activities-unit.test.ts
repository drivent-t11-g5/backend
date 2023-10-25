import { ticketsRepository } from '@/repositories';
import activitiesService from '@/services/activities-service';
import faker from '@faker-js/faker';
import { Ticket, TicketType } from '@prisma/client';
import {
  createGetActivitiesResponse,
  createcheckTicketResponse,
  createcheckTicketResponseCorrect,
  createcheckTicketResponseNoIncludes,
} from '../factories/activities-factory';
import activitiesRepository from '@/repositories/activities-repository';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('GET /activities', () => {
  it('should return Payment required when is not paid yet', async () => {
    const checkTicketResponse = await createcheckTicketResponse();
    const mock = jest.spyOn(ticketsRepository, 'findTicketById').mockImplementationOnce((): any => checkTicketResponse);

    const response = activitiesService.getActivities(faker.datatype.number());

    expect(response).rejects.toEqual({
      name: 'paymentRequired',
      message: 'The payment is required!',
    });
    expect(mock).toBeCalledTimes(1);
  });

  it('should return Payment required when has no enrollment', async () => {
    const mock = jest.spyOn(ticketsRepository, 'findTicketById').mockImplementationOnce((): any => undefined);

    const response = activitiesService.getActivities(faker.datatype.number());

    expect(response).rejects.toEqual({
      name: 'paymentRequired',
      message: 'The payment is required!',
    });
    expect(mock).toBeCalledTimes(1);
  });

  it('should return Payment required when is not paid yet', async () => {
    const checkTicketResponse = await createcheckTicketResponseNoIncludes();
    const mock = jest.spyOn(ticketsRepository, 'findTicketById').mockImplementationOnce((): any => checkTicketResponse);

    const response = activitiesService.getActivities(faker.datatype.number());

    expect(response).rejects.toEqual({
      name: 'NotAcceptable',
      message: 'Not Acceptable for this ticket',
    });
    expect(mock).toBeCalledTimes(1);
  });

  it('should return OK', async () => {
    const checkTicketResponse = await createcheckTicketResponseCorrect();
    const activitiesResponse = await createGetActivitiesResponse();
    const occupiedSeatsResponse = [
        {
            activityId: activitiesResponse[0].id,
            _count: {
              activityId: activitiesResponse[0].availableSeats -1
            }
          },
          {
            activityId: activitiesResponse[1].id,
            _count: {
              activityId: activitiesResponse[1].availableSeats -1
            }
          },
    ];
    const mock = jest.spyOn(ticketsRepository, 'findTicketById').mockImplementationOnce((): any => checkTicketResponse);
    const mock2 = jest
      .spyOn(activitiesRepository, 'getActivities')
      .mockImplementationOnce((): any => activitiesResponse);
    const mock3 = jest.spyOn(activitiesRepository, "getOccupiedSeats").mockImplementationOnce(():any => occupiedSeatsResponse);

    const response = await activitiesService.getActivities(faker.datatype.number());

    expect(response).toEqual([
        {
            occupiedSeats: occupiedSeatsResponse[0]._count.activityId,
            id: activitiesResponse[0].id,
            location: activitiesResponse[0].location,
            startTime: activitiesResponse[0].startTime,
            endTime: activitiesResponse[0].endTime,
            title: activitiesResponse[0].title,
            availableSeats: activitiesResponse[0].availableSeats,
            createdAt: activitiesResponse[0].createdAt,
            updatedAt: activitiesResponse[0].updatedAt
        },
        {
            occupiedSeats: occupiedSeatsResponse[1]._count.activityId,
            id: activitiesResponse[1].id,
            location: activitiesResponse[1].location,
            startTime: activitiesResponse[1].startTime,
            endTime: activitiesResponse[1].endTime,
            title: activitiesResponse[1].title,
            availableSeats: activitiesResponse[1].availableSeats,
            createdAt: activitiesResponse[1].createdAt,
            updatedAt: activitiesResponse[1].updatedAt
        }
    ]);
    expect(mock).toBeCalledTimes(1);
    expect(mock2).toBeCalledTimes(1);
    expect(mock3).toBeCalledTimes(1);
  });
});
