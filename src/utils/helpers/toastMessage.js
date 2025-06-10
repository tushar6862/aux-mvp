import { toast } from 'react-toastify';
import { TOAST_CONFIG } from '../constant/constant.helper';

export const toastMessage = ({
  message,
  toastId,
  type,
  pauseOnHover = true,
  duration = 5000,
  position = TOAST_CONFIG.POSITION.TOP_RIGHT,
  pauseOnFocusLoss = true,
  delay = 0,
  draggable = true,
}) => {
  !toast.isActive(toastId) &&
    message &&
    toast[type](message, {
      toastId: toastId,
      autoClose: duration,
      pauseOnHover,
      position,
      pauseOnFocusLoss,
      delay,
      draggable,
    });
};
