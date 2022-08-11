import { Record, String, Static, Number } from 'runtypes';

export const PermissionRecord = Record({
  name: String,
  level: Number,
});

export type PermissionDTO = Static<typeof PermissionRecord>;

export const nullPermission: PermissionDTO = { name: '', level: 0 };
