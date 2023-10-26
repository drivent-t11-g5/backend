import faker from '@faker-js/faker';
import { Activities, Ticket, TicketType } from '@prisma/client';

export async function createcheckTicketResponse(): Promise<Ticket & { TicketType: TicketType }> {
  return {
    id: faker.datatype.number(),
    ticketTypeId: faker.datatype.number(),
    enrollmentId: faker.datatype.number(),
    status: 'RESERVED',
    createdAt: new Date(),
    updatedAt: new Date(),
    TicketType: {
      id: faker.datatype.number(),
      name: faker.company.companyName(),
      price: faker.datatype.number(),
      isRemote: false,
      includesHotel: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  };
}

export async function createcheckTicketResponseNoIncludes(): Promise<Ticket & { TicketType: TicketType }> {
  return {
    id: faker.datatype.number(),
    ticketTypeId: faker.datatype.number(),
    enrollmentId: faker.datatype.number(),
    status: 'PAID',
    createdAt: new Date(),
    updatedAt: new Date(),
    TicketType: {
      id: faker.datatype.number(),
      name: faker.company.companyName(),
      price: faker.datatype.number(),
      isRemote: false,
      includesHotel: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  };
}

export async function createcheckTicketResponseCorrect(): Promise<Ticket & { TicketType: TicketType }> {
  return {
    id: faker.datatype.number(),
    ticketTypeId: faker.datatype.number(),
    enrollmentId: faker.datatype.number(),
    status: 'PAID',
    createdAt: new Date(),
    updatedAt: new Date(),
    TicketType: {
      id: faker.datatype.number(),
      name: faker.company.companyName(),
      price: faker.datatype.number(),
      isRemote: false,
      includesHotel: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  };
}

export async function createGetActivitiesResponse(): Promise<Activities[]> {
  return [
    {
      id: faker.datatype.number(),
      location: faker.address.state(),
      startTime: new Date(),
      endTime: new Date(),
      title: faker.company.catchPhrase(),
      availableSeats: faker.datatype.number(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: faker.datatype.number(),
      location: faker.address.state(),
      startTime: new Date(),
      endTime: new Date(),
      title: faker.company.catchPhrase(),
      availableSeats: faker.datatype.number(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
}
