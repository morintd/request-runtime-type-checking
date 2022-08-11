import { AxiosError } from 'axios';

import { api, serviceError } from './api';
import { LoginUserDTO, LoginUserResponseDTO, LoginUserResponseRecord, nullLoginUserResponse, UserToLoginDTO } from './dto';
import TransformUtils from './transform.utils';

// const configuration = { check: LoginUserResponseRecord.check, nullRawData: nullLoginUserResponse };

export function login(auth: UserToLoginDTO | string): Promise<LoginUserDTO> {
  return api
    .post<LoginUserResponseDTO>('/auth/login/', auth)
    .then((response) => {
      return TransformUtils.safeTransform(
        response.data,
        (data) => ({
          token: data.token,
          user: {
            id: data.user.id,
            email: data.user.email,
            friends: data.user.friends,
            permissions: data.user.permissions,
          },
        }),
        LoginUserResponseRecord.check,
        nullLoginUserResponse,
      );
    })
    .catch((e: AxiosError) => {
      if (e.response?.status === 401) throw new Error('app.page.login.error');
      throw e;
    })
    .catch(serviceError);
}
