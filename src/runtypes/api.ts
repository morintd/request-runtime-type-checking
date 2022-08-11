/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import axios from 'axios';
import { RuntypeBase } from 'runtypes/lib/runtype';

declare module 'axios' {
  export interface AxiosRequestConfig {
    check?: RuntypeBase['check'];
    nullRawData?: Record<string, unknown>;
  }
}

export const api = axios.create({
  baseURL: 'http://localhost',
});

// export const interceptors = (response: AxiosResponse): Promise<AxiosResponse> => {
//   const { check } = response.config;
//   if (check) {
//     try {
//       check(response.data);
//     } catch (e) {
//       if (response.config.nullRawData) {
//         console.log({ nullRawData: response.config.nullRawData, data: response.data });
//         // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
//         const data = TransformUtils.merge(response.config.nullRawData, response.data);
//         return Promise.resolve({ ...response, data });
//       }
//     }
//   }
//   return Promise.resolve(response);
// };

export function serviceError(error: Error): never {
  if (error?.message?.startsWith?.('app')) throw error;
  throw new Error('app.error.unknown');
}

// api.interceptors.response.use(interceptors);
