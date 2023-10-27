import faker from '@faker-js/faker';
import {
  createEnrollmentResponse,
  createGetActivitiesResponse,
  createGetActivityResponse,
  createPostActivitiesUserResponse,
  createcheckTicketResponse,
  createcheckTicketResponseCorrect,
  createcheckTicketResponseNoIncludes,
} from '../factories/activities-factory';
import { enrollmentRepository, ticketsRepository } from '@/repositories';
import activitiesService from '@/services/activities-service';
import activitiesRepository from '@/repositories/activities-repository';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('GET /activities', () => {
  it('should return Payment required when is not paid yet', async () => {
    const checkTicketResponse = await createcheckTicketResponse();
    const enrollmentResponse = await createEnrollmentResponse();
    jest
      .spyOn(enrollmentRepository, 'findWithAddressByUserId')
      .mockImplementationOnce((): any => enrollmentResponse);
    jest
      .spyOn(ticketsRepository, 'findTicketByEnrollmentId')
      .mockImplementationOnce((): any => checkTicketResponse);

    const response = activitiesService.getActivities(faker.datatype.number());

    expect(response).rejects.toEqual({
      name: 'paymentRequired',
      message: 'The payment is required!',
    });
  });

  it('should return Payment required when has no enrollment', async () => {
    const enrollmentResponse = await createEnrollmentResponse();
    jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockImplementationOnce((): any => undefined);
    jest
      .spyOn(enrollmentRepository, 'findWithAddressByUserId')
      .mockImplementationOnce((): any => enrollmentResponse);

    const response = activitiesService.getActivities(faker.datatype.number());

    expect(response).rejects.toEqual({
      name: 'paymentRequired',
      message: 'The payment is required!',
    });
  });

  it('should return Not Acceptable when is not paid yet', async () => {
    const checkTicketResponse = await createcheckTicketResponseNoIncludes();
    jest
      .spyOn(ticketsRepository, 'findTicketByEnrollmentId')
      .mockImplementationOnce((): any => checkTicketResponse);
    const enrollmentResponse = await createEnrollmentResponse();
    jest
      .spyOn(enrollmentRepository, 'findWithAddressByUserId')
      .mockImplementationOnce((): any => enrollmentResponse);

    const response = activitiesService.getActivities(faker.datatype.number());

    expect(response).rejects.toEqual({
      name: 'NotAcceptable',
      message: 'Not Acceptable for this ticket',
    });
  });

  it('should return OK', async () => {
    const checkTicketResponse = await createcheckTicketResponseCorrect();
    const enrollmentResponse = await createEnrollmentResponse();
    jest
      .spyOn(enrollmentRepository, 'findWithAddressByUserId')
      .mockImplementationOnce((): any => enrollmentResponse);
    const activitiesResponse = await createGetActivitiesResponse();
    const occupiedSeatsResponse = [
      {
        activityId: activitiesResponse[0].id,
        _count: {
          activityId: activitiesResponse[0].availableSeats - 1,
        },
      },
      {
        activityId: activitiesResponse[1].id,
        _count: {
          activityId: activitiesResponse[1].availableSeats - 1,
        },
      },
    ];
    jest
      .spyOn(ticketsRepository, 'findTicketByEnrollmentId')
      .mockImplementationOnce((): any => checkTicketResponse);
    jest
      .spyOn(activitiesRepository, 'getActivities')
      .mockImplementationOnce((): any => activitiesResponse);
    jest
      .spyOn(activitiesRepository, 'getOccupiedSeats')
      .mockImplementationOnce((): any => occupiedSeatsResponse);

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
        updatedAt: activitiesResponse[0].updatedAt,
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
        updatedAt: activitiesResponse[1].updatedAt,
      },
    ]);
  });
});

describe('POST /activities', () => {
  it("should return Not Found when activity doesn't exist", async () => {
    jest.spyOn(activitiesRepository, "getActivity").mockImplementationOnce(():any => undefined)
    const response = activitiesService.postActivityToUser(faker.datatype.number(), faker.datatype.number());
    
    expect(response).rejects.toEqual({
      name: 'NotFoundError',
      message: 'No result for this search!',
    })
  })
  it("should return a Post on activitiesUser", async () => {
    const getActivitiyResponse = await createGetActivityResponse();
    const postActivityResponse = await createPostActivitiesUserResponse()
    jest.spyOn(activitiesRepository, "getActivity").mockImplementationOnce(():any => getActivitiyResponse)
    jest.spyOn(activitiesRepository, "createRegisterActivity").mockImplementationOnce(():any => postActivityResponse)
    const response = await activitiesService.postActivityToUser(faker.datatype.number(), faker.datatype.number());
    
    expect(response).toEqual(postActivityResponse)
  })
})