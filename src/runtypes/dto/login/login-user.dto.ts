import { UserDTO } from '../user.dto';

export type LoginUserDTO = {
  token: string;
  user: UserDTO;
};
