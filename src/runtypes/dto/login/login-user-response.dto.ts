import { Record, String, Static } from 'runtypes';

import { nullUser, UserRecord } from '../user.dto';

export const LoginUserResponseRecord = Record({
  user: UserRecord,
  token: String,
});

export type LoginUserResponseDTO = Static<typeof LoginUserResponseRecord>;

export const nullLoginUserResponse: LoginUserResponseDTO = {
  user: nullUser,
  token: '',
};
