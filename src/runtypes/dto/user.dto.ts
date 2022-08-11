/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Record, String, Static, Array } from 'runtypes';

import { nullPermission, PermissionRecord } from './permission.dto';

export const BareUserRecord = Record({
  id: String,
  email: String,
  permissions: Array(PermissionRecord),
});

export const UserRecord = BareUserRecord.And(
  Record({
    friends: Array(BareUserRecord),
  }),
);

export type BareUserDTO = Static<typeof BareUserRecord>;

export type UserDTO = Static<typeof UserRecord>;

export const nullUser: UserDTO = {
  id: '',
  email: '',
  get friends() {
    return [this];
  },
  permissions: [nullPermission],
};
