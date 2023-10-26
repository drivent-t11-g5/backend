import { Event } from '@prisma/client';
import dayjs from 'dayjs';
import { notFoundError } from '@/errors';
import { eventRepository } from '@/repositories';
import { exclude } from '@/utils/prisma-utils';
import redis, { DEFAULT_EXP } from '@/config/redis';

async function getFirstEvent(): Promise<GetFirstEventResult> {
  const eventCacheKey = "eventKey";
  const eventCached = await redis.get(eventCacheKey);

  if (eventCached) {
    
    const rawEvent = JSON.parse(eventCached) as Event;
    return exclude(rawEvent, 'createdAt', 'updatedAt') // se já existe um evento no cache, retorna
  }

  const event = await eventRepository.findFirst(); // senão, busca dos postgreSQL, insere no redis e retorna
  if (!event) throw notFoundError();

  await redis.setEx(eventCacheKey, DEFAULT_EXP, JSON.stringify(event));

  return exclude(event, 'createdAt', 'updatedAt');
}

export type GetFirstEventResult = Omit<Event, 'createdAt' | 'updatedAt'>;

async function isCurrentEventActive(): Promise<boolean> {
  const activeEventCacheKey = "eventKey";
  const eventCached = await redis.get(activeEventCacheKey);

  if (eventCached) { // se o evento ja existe em cache, retorna
    const event = JSON.parse(eventCached) as Event;
    const { now, eventStartsAt, eventEndsAt } = getNowAndEventLimits(event);

    return now.isAfter(eventStartsAt) && now.isBefore(eventEndsAt);
  }

  const event = await eventRepository.findFirst(); // senão, busca evento no postgreSQL, insere no redis
  if (!event) return false;

  const { now, eventStartsAt, eventEndsAt } = getNowAndEventLimits(event);

  await redis.setEx(activeEventCacheKey, DEFAULT_EXP, JSON.stringify(event));

  return now.isAfter(eventStartsAt) && now.isBefore(eventEndsAt);
}

function getNowAndEventLimits(event: Event) {
  const now = dayjs();
  const eventStartsAt = dayjs(event.startsAt);
  const eventEndsAt = dayjs(event.endsAt);

  return { now, eventStartsAt, eventEndsAt }
}

export const eventsService = {
  getFirstEvent,
  isCurrentEventActive,
};
