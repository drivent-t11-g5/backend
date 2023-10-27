import { ApplicationError } from '@/protocols';

export function NotAcceptable(): ApplicationError {
  return {
    name: 'NotAcceptable',
    message: 'Not Acceptable for this ticket',
  };
}
