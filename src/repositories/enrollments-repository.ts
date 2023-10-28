import { Address, Enrollment, PrismaClient, PrismaPromise } from '@prisma/client';
import { prisma } from '@/config';

async function findWithAddressByUserId(userId: number) {
  return prisma.enrollment.findFirst({
    where: { userId },
    include: {
      Address: true,
    },
  });
}

async function upsert(
  userId: number,
  createdEnrollment: CreateEnrollmentParams,
  updatedEnrollment: UpdateEnrollmentParams,
) {
  return prisma.enrollment.upsert({
    where: {
      userId,
    },
    create: createdEnrollment,
    update: updatedEnrollment,
  });
}

async function upsertEnrollmentandAdress(
  userId: number,
  createdEnrollment: CreateEnrollmentParams,
  updatedEnrollment: UpdateEnrollmentParams,
  createdAddress: CreateAddressParams, 
  updatedAddress: UpdateAddressParams
) {
  return prisma.$transaction((async (tx: PrismaClient) => {
      const newEnrollment = await tx.enrollment.upsert({
        where: {
          userId,
        },
        create: createdEnrollment,
        update: updatedEnrollment,
      });

      tx.address.upsert({
        where: {
          enrollmentId: newEnrollment.id,
        },
        create: {
          ...createdAddress,
          Enrollment: { connect: { id: newEnrollment.id } },
        },
        update: updatedAddress,
      });
    }) as unknown as PrismaPromise<any>[]);
}

export type CreateEnrollmentParams = Omit<Enrollment, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateEnrollmentParams = Omit<CreateEnrollmentParams, 'userId'>;
export type CreateAddressParams = Omit<Address, 'id' | 'createdAt' | 'updatedAt' | 'enrollmentId'>;
export type UpdateAddressParams = CreateAddressParams;

export const enrollmentRepository = {
  findWithAddressByUserId,
  upsert,
  upsertEnrollmentandAdress,
};
