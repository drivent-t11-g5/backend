import { ApplicationError } from '@/protocols';

export function paymentRequiredError(): ApplicationError {
  return {
    name: 'paymentRequired',
    message: 'The payment is required!',
  };
}
