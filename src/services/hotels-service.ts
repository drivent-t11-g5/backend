import { TicketStatus } from '@prisma/client';
import { invalidDataError, notFoundError } from '@/errors';
import { cannotListHotelsError } from '@/errors/cannot-list-hotels-error';
import { bookingRepository, enrollmentRepository, hotelRepository, ticketsRepository } from '@/repositories';
import redis, { DEFAULT_EXP } from '@/config/redis';

async function validateUserBooking(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw notFoundError();

  const type = ticket.TicketType;

  if (ticket.status === TicketStatus.RESERVED || type.isRemote || !type.includesHotel) {
    throw cannotListHotelsError();
  }
}

async function getHotels(userId: number) {
  await validateUserBooking(userId);

  const hotelsCacheKey = `getHotelsKey/User-${userId}`;
  const hotelsCached = await redis.get(hotelsCacheKey);

  if (hotelsCached) { // se existem hoteis na cache, retorna
    return JSON.parse(hotelsCached);
  }

  const hotels = await hotelRepository.findHotels(); // senão busca do postgreSQL, insere no redis e retorna
  if (hotels.length === 0) throw notFoundError();

  const hotelsInfo = [];

  for (let i = 0; i < hotels.length; i++) {
    let availableBookings = 0;
    const acomodation: string[] = [];
    const hotelInfo = await getHotelsWithRooms(userId, hotels[i].id);
    for (let j = 0; j < hotelInfo.Rooms.length; j++) {
      availableBookings += hotelInfo.Rooms[j].availableBookings;
      if (hotelInfo.Rooms[j].capacity == 1 && !acomodation.includes('Single')) {
        acomodation.push('Single');
      } else if (hotelInfo.Rooms[j].capacity == 2 && !acomodation.includes('Double')) {
        acomodation.push('Double');
      } else if (hotelInfo.Rooms[j].capacity == 3 && !acomodation.includes('Triple')) {
        acomodation.push('Triple');
      }
    }
    hotelsInfo.push({ ...hotels[i], availableBookings, acomodation });
  }

  await redis.setEx(hotelsCacheKey, DEFAULT_EXP, JSON.stringify(hotelsInfo))

  return hotelsInfo;
}

async function getHotelsWithRooms(userId: number, hotelId: number) {
  await validateUserBooking(userId);

  const hotelsCacheKey = `getHotelsWithRoomsKey/User-${userId}Hotel-${hotelId}`;
  const hotelsCached = await redis.get(hotelsCacheKey);

  if (hotelsCached) { // se existem hoteis na cache, retorna
    return JSON.parse(hotelsCached);
  }

  if (!hotelId || isNaN(hotelId)) throw invalidDataError('hotelId');

  const hotelWithRooms = await hotelRepository.findRoomsByHotelId(hotelId);
  if (!hotelWithRooms) throw notFoundError();

  const roomsList = [];
  for (let i = 0; i < hotelWithRooms.Rooms.length; i++) {
    const room = hotelWithRooms.Rooms[i];
    const occupiedSpace = await bookingRepository.countBookingsByRoomId(room.id);
    const roomWithAvailableSpace = { ...room, availableBookings: room.capacity - occupiedSpace };
    roomsList.push(roomWithAvailableSpace);
  }

  const hotelAndRooms = { ...hotelWithRooms, Rooms: roomsList };

  await redis.setEx(hotelsCacheKey, DEFAULT_EXP, JSON.stringify(hotelAndRooms));

  return hotelAndRooms;
}

export const hotelsService = {
  getHotels,
  getHotelsWithRooms,
};
