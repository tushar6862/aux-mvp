import {
  AUCTION_GROUP,
  LOGIN_METHOD_TYPES,
  LOW_WALLET_BALANCE,
  NOT_APPLICABLE,
} from '../constant/constant.helper';
import { hostname } from '@/provider/ApiCallProvider';

/**
 * Generates a greeting message using the player's first or last name.
 *
 * @param {string} first_name - The player's first name.
 * @param {string} last_name - The player's last name.
 * @returns {string} A greeting message with the player's name, or 'N/A' if no name is provided.
 */
export const getPlayerName = (first_name, last_name) => {
  try {
    if (first_name) return `Hii, ${first_name} `;
    else if (last_name) return `Hii, ${last_name} `;
    return NOT_APPLICABLE;
  } catch (error) {
    console.error(error);
  }
};

/**
 * Converts a date to UTC format and returns it in 'YYYY-MM-DD HH:mm:ss' format.
 *
 * @param {string | Date} createdDate - The date to be converted to UTC.
 * @returns {string} The formatted UTC date in 'YYYY-MM-DD HH:mm:ss' format, or an empty string if no date is provided.
 */
export function convertDateUTC(createdDate) {
  try {
    if (!createdDate) return '';
    // Create a new Date object
    const date = new Date(createdDate);

    // Convert to UTC
    const utcDate = new Date(date.toUTCString());

    // Format the date and time in 24-hour format
    const formattedDate = utcDate
      .toISOString()
      .replace('T', ' ')
      .substring(0, 19);
    return formattedDate;
  } catch (error) {
    console.error(error, 'Date parsing is not working');
    return '';
  }
}

/**
 * Formats a given number of seconds into a string of the format "MM:SS".
 *
 * @param {number} seconds - The total number of seconds to be converted.
 * @returns {string} A string representing the time in "MM:SS" format,
 *                  where MM is the number of minutes and SS is the number of seconds.
 *
 
 */

export const getFormatTime = (seconds) => {
  try {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  } catch (error) {
    console.error(error);
  }
};

/**
 * Builds the request body for login based on the provided login method type and data.
 *
 * Supported login methods:
 * - `PHONE_NUMBER`: Returns the raw data as is (typically phone number).
 * - `METAMASK`: Signs a message using MetaMask and returns the signature and hostname.
 * - `EMAIL`: Signs a message using MetaMask and includes the user's email in the request body.
 *
 * @param {Object} params - The login parameters.
 * @param {string} params.type - The login method type, one of the values from `LOGIN_METHOD_TYPES`.
 * @param {Object} params.data - The data needed for the login request, including the signing function and additional information (e.g., auction house name, email).
 *
 * @returns {Object} The constructed login request body based on the type.
 *
 * @throws Will throw an error if the message signing fails.
 */

export const buildLoginRequestBody = async (payload) => {
  const { type, data } = payload;
  try {
    switch (type) {
      case LOGIN_METHOD_TYPES.PHONE_NUMBER: {
        return data;
      }

      case LOGIN_METHOD_TYPES.METAMASK: {
        const { signMessageAsync, auctionHouseName } = data;
        if (typeof signMessageAsync !== 'function') {
          throw new Error(
            'signMessageAsync is not a function for METAMASK login',
          );
        }
        const signature = await signMessageAsync({
          message: `Welcome to ${auctionHouseName}. Play BiG, Win BiG!`,
        });
        return {
          signature,
          hostname: data.hostname,
        };
      }

      case LOGIN_METHOD_TYPES.EMAIL: {
        const { signMessageAsync, auctionHouseName, email, otp, otpRequestId } =
          data;
        if (typeof signMessageAsync === 'function') {
          const signature = await signMessageAsync({
            message: `Welcome to ${auctionHouseName}. Play BiG, Win BiG!`,
          });
          return {
            signature,
            hostname: data.hostname,
            googleEmail: email,
          };
        }

        // OTP login
        return {
          email,
          otp,
          otpRequestId,
          hostname: data.hostname,
        };
      }

      case LOGIN_METHOD_TYPES.TELEGRAM: {
        return {
          hostname: data.hostname,
          telegramUser: data.telegramUser,
        };
      }

      default:
        throw new Error(`Unsupported login method type: ${type}`);
    }
  } catch (error) {
    data?.disconnect?.();
    console.error(error);
  }
};

/**
 * Copies the given text to the clipboard.
 *
 * @param {string} text - The text to be copied to the clipboard.
 * @returns {Promise<void>} - A promise that resolves when the text has been successfully copied or logs an error if it fails.
 * @throws {Error} - Logs an error if the clipboard API is not available or the operation fails.
 *
 */

export async function setClipboard(text) {
  try {
    const type = 'text/plain';
    const blob = new Blob([text], { type });
    const data = [new ClipboardItem({ [type]: blob })];
    await navigator?.clipboard?.write(data);
  } catch (error) {
    console.error(error); // Logs the error if clipboard operation fails
  }
}

/**
 * Shortens a string by keeping a specified number of characters at the start and end,
 * and replacing the middle part with a separator if the string is too long.
 *
 * @param {string} input - The input string to be shortened.
 * @param {number} [startLength=6] - The number of characters to keep at the start of the string.
 * @param {number} [endLength=6] - The number of characters to keep at the end of the string.
 * @param {string} [separator='...'] - The string to insert in place of the omitted middle part.
 *
 * @returns {string} - The shortened string with the specified start and end lengths and the separator in between.
 *
 * @throws {Error} - Logs an error if string slicing fails.
 */

export function shortenString(
  input,
  startLength = 6,
  endLength = 6,
  separator = '...',
) {
  try {
    if (input?.length <= startLength + endLength) {
      return input; // No need to shorten if the input is already shorter than or equal to the combined lengths
    }
    const start = input.slice(0, startLength);
    const end = input.slice(-endLength);
    return `${start}${separator}${end}`;
  } catch (error) {
    console.error(error);
  }
}

/**
 * Calculates the range between two prices with decimal precision.
 * @param {number} minPrice - The minimum price.
 * @param {number} maxPrice - The maximum price.
 * @param {number} decimalCount - Number of decimal places to adjust by.
 * @returns {{ minValue, maxValue,rangeString }} The range object with adjusted min, max, and range string.
 */

export const getRange = (minPrice, maxPrice, decimalCount = 0) => {
  try {
    const decimalValue = Math.pow(10, -decimalCount);
    const minValue = minPrice + decimalValue;
    const maxValue = maxPrice - decimalValue;
    const rangeString = `${minValue} - ${maxValue}`;

    return { minValue, maxValue, rangeString };
  } catch (error) {
    console.error(error);
  }
};

/**
 * Converts a date to IST format and returns it in 'YY-MM-DD HH:mm:ss' format.
 *
 * @param {string | Date} createdDate - The date to be converted to IST.
 * @returns {string} The formatted IST date in 'YY-MM-DD HH:mm:ss' format, or an empty string if no date is provided.
 */
export function convertDateIST(createdDate, getOnlyTime = false) {
  try {
    if (!createdDate) return '';
    // Create a new Date object
    const date = new Date(createdDate);

    // Check if the date is invalid
    if (isNaN(date.getTime())) {
      console.error('Invalid date provided');
      return '';
    }

    // Convert to IST (UTC + 5:30)
    const IST_OFFSET = 5.5 * 60 * 60 * 1000; // 5 hours 30 minutes in milliseconds
    const istDate = new Date(date.getTime() + IST_OFFSET);

    // Format the date in 'YY-MM-DD HH:mm:ss' format
    const year = istDate.getUTCFullYear().toString().slice(-2); // Last two digits of the year
    const month = String(istDate.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(istDate.getUTCDate()).padStart(2, '0');
    const hours = String(istDate.getUTCHours()).padStart(2, '0');
    const minutes = String(istDate.getUTCMinutes()).padStart(2, '0');
    const seconds = String(istDate.getUTCSeconds()).padStart(2, '0');

    const formattedDate = getOnlyTime
      ? `${hours}:${minutes}:${seconds}`
      : `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return formattedDate;
  } catch (error) {
    console.error(error, 'Date parsing is not working');
    return '';
  }
}

export const getPlaceholder = (category) => {
  try {
    switch (category) {
      case AUCTION_GROUP.HIGHEST:
        return 'Enter Highest Bid...';
      case AUCTION_GROUP.LOWEST:
        return 'Enter Lowest Bid...';
      default:
        return 'Enter Your Bid...';
    }
  } catch (error) {
    console.error(error);
  }
};

export function getWalletBalanceColor(balance) {
  try {
    if (balance <= LOW_WALLET_BALANCE.RED.threshold) {
      return LOW_WALLET_BALANCE.RED.color;
    } else if (balance <= LOW_WALLET_BALANCE.YELLOW.threshold) {
      return LOW_WALLET_BALANCE.YELLOW.color;
    }
    return LOW_WALLET_BALANCE.GREEN.color;
  } catch (error) {
    console.error(error);
  }
}

/**
 * Groups data by the given date field.
 * @param data - Array of objects to group.
 * @param dateField - The field in the object containing the date.
 * @returns Record where the key is the date (YYYY-MM-DD) and the value is an array of objects for that date.
 */
export function groupByDate(data, dateField) {
  try {
    return data.reduce((acc, item) => {
      const dateValue = item[dateField];
      const date = new Date(dateValue).toISOString().split('T')[0]; // Format to YYYY-MM-DD
      if (!acc[date]) acc[date] = [];
      acc[date].push(item);
      return acc;
    }, {});
  } catch (error) {
    console.error(error);
    return {};
  }
}
