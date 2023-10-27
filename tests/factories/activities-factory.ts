import { prisma } from '@/config';
import faker from '@faker-js/faker';
import { Activities, ActivitiesUser, Address, Enrollment, Ticket, TicketType } from '@prisma/client';

export async function createEnrollmentResponse(): Promise<
  Enrollment & {
    Address: Address[];
  }
> {
  return {
    id: faker.datatype.number(),
    name: faker.datatype.string(),
    cpf: faker.datatype.string(),
    birthday: new Date(),
    phone: faker.datatype.string(),
    userId: faker.datatype.number(),
    createdAt: new Date(),
    updatedAt: new Date(),
    Address: [
      {
        id: faker.datatype.number(),
        cep: faker.datatype.string(),
        street: faker.datatype.string(),
        city: faker.datatype.string(),
        state: faker.datatype.string(),
        number: faker.datatype.string(),
        neighborhood: faker.datatype.string(),
        addressDetail: faker.datatype.string(),
        enrollmentId: faker.datatype.number(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  };
}

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

export async function createGetActivityResponse() :Promise<Activities> {
  return {
    id: faker.datatype.number(),
    location: faker.address.state(),
    startTime: new Date(),
    endTime: new Date(),
    title: faker.company.catchPhrase(),
    availableSeats: faker.datatype.number(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

export async function createPostActivitiesUserResponse() :Promise<ActivitiesUser>{
  return {
    id: faker.datatype.number(),
  userId: faker.datatype.number(),
  activityId: faker.datatype.number(),
  createdAt: new Date(),
  updatedAt: new Date(),
  }
}

export async function createActivity(){
  return await prisma.activities.create({
    data: {
      location: faker.address.state(),
      startTime: new Date(),
      endTime: new Date(),
      title: faker.company.catchPhrase(),
      availableSeats: faker.datatype.number(),
    }
  })
}