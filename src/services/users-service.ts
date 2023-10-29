import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import axios from 'axios';
import qs from 'query-string';
import { v4 as uuid } from 'uuid';
import { createSession, eventsService } from '@/services';
import { cannotEnrollBeforeStartDateError, duplicatedEmailError } from '@/errors';
import { userRepository } from '@/repositories';
import { exclude } from '@/utils/prisma-utils';

export async function createUser({ email, password }: CreateUserParams): Promise<User> {
  await canEnrollOrFail();

  await validateUniqueEmailOrFail(email);

  const hashedPassword = await bcrypt.hash(password, 12);
  return userRepository.create({
    email,
    password: hashedPassword,
  });
}

async function validateUniqueEmailOrFail(email: string) {
  const userWithSameEmail = await userRepository.findByEmail(email);
  if (userWithSameEmail) {
    throw duplicatedEmailError();
  }
}

async function canEnrollOrFail() {
  const canEnroll = await eventsService.isCurrentEventActive();
  if (!canEnroll) {
    throw cannotEnrollBeforeStartDateError();
  }
}

type GitHubParamsForAccessToken = {
  code: string;
  grant_type: string;
  redirect_uri: string;
  client_id: string;
  client_secret: string;
};

async function exchangeCodeForAccessToken(code: string) {
  const GITHUB_ACCESS_TOKEN_URL = 'https://github.com/login/oauth/access_token';
  const { REDIRECT_URL, CLIENT_ID, CLIENT_SECRET } = process.env;
  const params: GitHubParamsForAccessToken = {
    code,
    grant_type: 'authorization_code',
    redirect_uri: REDIRECT_URL,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
  };
  const { data } = await axios.post(GITHUB_ACCESS_TOKEN_URL, params, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const { access_token } = qs.parse(data);
  return Array.isArray(access_token) ? access_token.join('') : access_token;
}

export async function retrieveUserFromGitHub(token: string) {
  const GITHUB_USER_URL = 'https://api.github.com/user';
  const response = await axios.get(GITHUB_USER_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

async function loginWithGitHub(code: string) {
  const token = await exchangeCodeForAccessToken(code);
  return retrieveUserFromGitHub(token);
}

async function upsertGitHubUser(email: string) {
  let user = await userRepository.findByEmail(email, { id: true, email: true, password: true });
  if (!user) {
    const password = uuid();
    user = await createUser({ email, password });
  }
  const token = await createSession(user.id);
  return {
    user: exclude(user, 'password'),
    token,
  };
}

export type CreateUserParams = Pick<User, 'email' | 'password'>;

export const userService = {
  createUser,
  loginWithGitHub,
  upsertGitHubUser,
};
