'use client';
import { COOKIE_STORAGE, ROUTES } from '@/utils/constant/constant.helper';
import { log } from '@/utils/helpers/logger.helper';
import storage from '@/utils/helpers/storage.helper';
import axios from 'axios';
import Cookies from 'js-cookie';

/**
 * Creates an instance of Axios with predefined configuration.
 * This instance includes:
 *  - `baseURL`: The base path for API requests, sourced from environment variables.
 *  - `timeout`: A timeout of 5000ms for requests.
 *
 * @returns {AxiosInstance} A customized Axios instance with predefined settings.
 */

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_ENDPOINT,
  timeout: 9000,
});

/**
 * Intercepts all outgoing requests to add an Authorization header if a token exists.
 *
 * @param {Object} config - The Axios request configuration object.
 * @returns {Object} Updated config object with the Authorization header if a token is present.
 *
 * @throws Will reject the promise if an error occurs during request interception.
 */

axiosInstance.interceptors.request.use(
  (config) => {
    const userCookie = Cookies.get(COOKIE_STORAGE.USER);
    const userData = userCookie ? JSON.parse(userCookie) : {};
    if (userData?.accessToken)
      config.headers.Authorization = `Bearer ${userData?.accessToken}`;
    log('info', `HTTP REQUEST : :${JSON.stringify(config)}`);
    return config;
  },
  (error) => {
    log('warn', `HTTP REQUEST ERROR : ${JSON.stringify(error)}`);
    /* eslint-disable no-undef */
    return Promise.reject(error);
  },
);

/**
 * Intercepts all responses to extract the data and status for consistency across API calls.
 * Handles error responses by checking if a 401 error is received, which results in clearing stored credentials.
 *
 * @param {Object} response - The Axios response object.
 * @returns {Object} Returns the response data along with the status code.
 *
 * @throws Will reject the promise with an error message or response data when an error occurs.
 */

axiosInstance.interceptors.response.use(
  (response) => {
    const { data, status } = response;
    log('info', `HTTP RESPONSE : ${JSON.stringify(response)}`);
    return { ...data, status };
  },
  async (error) => {
    if (axios.isCancel(error)) {
      await log('warn', `AXIOS ERROR REJECTED : ${JSON.stringify(error)}`);
      return Promise.reject({ error });
    }
    if (error?.response) {
      await log(
        'warn',
        `AXIOS ERROR REPSONSE : ${JSON.stringify(error.response)}`,
      );
      if (error.response.data.code == 401) {
        // TODO: Clear Cookies
        Cookies.remove(COOKIE_STORAGE.USER);
        storage.clear();
        window.location.href = ROUTES.BASE;
      }

      return Promise.reject(error.response.data);
    }
    await log('warn', `AXIOS ERROR : ${JSON.stringify(error)}`);
    return Promise.reject({ message: 'Something went wrong', error });
  },
);
export default axiosInstance;
