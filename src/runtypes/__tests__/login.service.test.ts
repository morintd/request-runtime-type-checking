import nock from 'nock';

import { LoginUserResponseDTO, PermissionDTO, UserDTO } from '../dto';
import { login } from '../login.service';

const user3: Omit<UserDTO, 'friends'> = {
  id: '3',
  email: 'user3@company.com',
  permissions: [{ name: 'CREATE_ARTICLE', level: 1 }],
};

const user2: Omit<UserDTO, 'email'> = {
  id: '2',
  friends: [user3],
  permissions: [{ name: 'CREATE_ARTICLE' } as PermissionDTO],
};

describe('Login', () => {
  const response: LoginUserResponseDTO = {
    token: 'access-token',
    user: {
      id: 'id',
      email: 'user@user.com',
      friends: [user2 as UserDTO],
      permissions: [{ name: 'CREATE_ARTICLE', level: 1 }],
    },
  };

  test('Should format response', async () => {
    nock('http://localhost')
      .defaultReplyHeaders({ 'Access-Control-Allow-Origin': '*' })
      .post('/auth/login/')
      .reply(201, response);

    const { token, user } = await login({
      email: 'user@user.com',
      password: 'password',
    });

    expect(token).toBe('access-token');
    expect(user).toEqual({
      id: 'id',
      email: 'user@user.com',
      friends: [
        {
          id: '2',
          email: '',
          friends: [
            { id: '3', email: 'user3@company.com', friends: [], permissions: [{ name: 'CREATE_ARTICLE', level: 1 }] },
          ],
          permissions: [{ name: 'CREATE_ARTICLE', level: 0 }],
        },
      ],
      permissions: [{ name: 'CREATE_ARTICLE', level: 1 }],
    });
  });
});
