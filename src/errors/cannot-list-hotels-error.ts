import { ApplicationError } from '@/protocols';
import { Ticket } from '@prisma/client';

export function cannotListHotelsError(resource : Ticket): ApplicationError {
  return {
    name: 'CannotListHotelsError',
    message: 'Cannot list hotels!',
    data: resource
  };
}
