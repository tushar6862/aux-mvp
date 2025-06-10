import { useEffect, useState } from 'react';
import Button from '../../form-component/Button';
import OtpInput from '../../form-component/OtpInput';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { hostname } from '@/provider/ApiCallProvider';
import { userLoginAction, userSendOtpAction } from '@/redux/user/action.user';
import {
  LOGIN_BTN_KEYS,
  MODAL_KEYS,
  setLoginBtnLoading,
  setModal,
} from '@/redux/modal/action.modal';
import { useDispatch, useSelector } from 'react-redux';
import { TiArrowBack } from 'react-icons/ti';
import { LOGIN_METHOD_TYPES } from '@/utils/constant/constant.helper';
import { disconnectSocket } from '@/lib/socket';
import { userState } from '@/redux/user/reducer.user';
import { setIsSocketConnected } from '@/redux/socket/action.socket';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';
import { FaEdit } from 'react-icons/fa';
import { getFormatTime } from '@/utils/helpers/utils.helper';

const selectOptions = ['+91', '+1'];

const validationSchema = Yup.object({
  phoneNumber: Yup.string()
    .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits')
    .required('Phone number is required'),
  password: Yup.string().required('Password is required'),
});

const otpValidationSchema = Yup.object({
  phoneNumber: Yup.string().test(
    'phone-format',
    'Phone number must be exactly 10 digits',
    function (value) {
      const { email } = this.parent;
      // Only validate format if phone is filled and email is empty
      if (value && value.trim() !== '' && (!email || email.trim() === '')) {
        return /^\d{10}$/.test(value);
      }
      return true;
    },
  ),
  email: Yup.string().test(
    'email-format',
    'Invalid email format',
    function (value) {
      const { phoneNumber } = this.parent;
      // Only validate format if email is filled and phone is empty
      if (
        value &&
        value.trim() !== '' &&
        (!phoneNumber || phoneNumber.trim() === '')
      ) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      }
      return true;
    },
  ),
  otp: Yup.string().when('showOtp', {
    is: (value) => value,
    then: (schema) =>
      schema
        .matches(/^\d{4}$/, 'OTP must be 4 digits')
        .required('OTP is required'),
    otherwise: (schema) => schema.string,
  }),
}).test(
  'phone-or-email',
  'Either phone number or email is required',
  function (values) {
    const { phoneNumber, email } = values;
    const hasPhone = phoneNumber && phoneNumber.trim() !== '';
    const hasEmail = email && email.trim() !== '';

    // Only show error if both fields are empty
    if (!hasPhone && !hasEmail) {
      return this.createError({
        path: 'contactRequired',
        message: 'Either phone number or email is required',
      });
    }

    return true;
  },
);

const initialValues = {
  phoneNumber: '',
  countryCode: selectOptions[0],
  password: '',
};

const otpInitialValues = {
  phoneNumber: '',
  email: '',
  otp: '',
  countryCode: selectOptions[0],
  showOtp: false,
};

const initialSeconds = 600; // 10 minutes
const initialResetTimmerSeconds = 60; // 1 minutes

const LoginPhoneNo = ({ setIsNoLoginShow, isOtpShow }) => {
  const [otp, setOtp] = useState('');
  const [otpRequestId, setOtpRequestId] = useState('');
  const dispatch = useDispatch();
  const [seconds, setSeconds] = useState(0);
  const [resendOptTimmer, setResetOtpTimmer] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const { sendOtpLoader } = useSelector(userState);

  const loginCallback = (res) => {
    disconnectSocket();
    dispatch(setIsSocketConnected(false));
    dispatch(setModal({ key: MODAL_KEYS.LOGIN, value: false }));
  };

  const sendOtp = (values, { setFieldValue, setFieldTouched }) => {
    // Determine if using phone or email
    const isPhone = values.phoneNumber && values.phoneNumber.trim() !== '';
    const contact = isPhone
      ? values.countryCode + values.phoneNumber
      : values.email;

    dispatch(
      userSendOtpAction(
        { [isPhone ? 'mobile_no' : 'email']: contact },
        (res) => {
          if (res.success) {
            setOtpRequestId(res.data.otpRequestId);
            setFieldValue('showOtp', true);
            setFieldTouched('otp', false);
            setSeconds(initialSeconds);
            setResetOtpTimmer(initialResetTimmerSeconds);
          }
        },
      ),
    );
  };

  const loginWithOtp = (values) => {
    const isPhone = values.phoneNumber && values.phoneNumber.trim() !== '';

    dispatch(
      userLoginAction(
        {
          type: isPhone
            ? LOGIN_METHOD_TYPES.PHONE_NUMBER
            : LOGIN_METHOD_TYPES.EMAIL,
          data: {
            hostname,
            otp: otp.join(''),
            otpRequestId,
          },
        },
        (res) => {
          if (res.success) {
            setOtp('');
            setOtpRequestId('');
            dispatch(setModal({ key: MODAL_KEYS.LOGIN, value: false }));
          }
        },
      ),
    );
  };

  const submitHandler = (values, { resetForm }) => {
    const mobile_no = `${values?.countryCode}${values?.phoneNumber}`;
    dispatch(
      userLoginAction(
        {
          type: LOGIN_METHOD_TYPES.PHONE_NUMBER,
          data: {
            hostname,
            mobile_no,
            password: values?.password,
          },
        },
        (res) => {
          if (res.success) {
            loginCallback(res);
            resetForm();
          }
          dispatch(
            setLoginBtnLoading({ key: LOGIN_BTN_KEYS.EMAIL, value: false }),
          );
          dispatch(
            setLoginBtnLoading({ key: LOGIN_BTN_KEYS.WALLET, value: false }),
          );
        },
      ),
    );
  };

  useEffect(() => {
    let interval = null;

    if (seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
    } else if (seconds === 0) {
      clearInterval(interval);
    }

    return () => clearInterval(interval); // Cleanup on unmount or when dependencies change
  }, [seconds]);

  useEffect(() => {
    let interval = null;
    if (resendOptTimmer > 0) {
      interval = setInterval(() => {
        setResetOtpTimmer((prevSeconds) => prevSeconds - 1);
      }, 1000);
    } else if (seconds === 0) {
      clearInterval(interval);
    }

    return () => clearInterval(interval); // Cleanup on unmount or when dependencies change
  }, [resendOptTimmer]);

  return (
    <>
      {/* Back Button */}
      <div
        className="text-lg font-black  absolute top-3 left-3 rounded-full text-white bg-[#FFFFFF33] aspect-square w-8 flex justify-center items-center  cursor-pointer hover:bg-white  hover:text-[#190C3D] transition-all"
        onClick={() => setIsNoLoginShow(false)}
      >
        <TiArrowBack />
      </div>

      {/* Conditional component rendering : PASSWORD or OTP */}
      {isOtpShow ? (
        <LoginWithOtp
          sendOtpLoader={sendOtpLoader}
          seconds={seconds}
          setOtp={setOtp}
          otp={otp}
          sendOtp={sendOtp}
          loginWithOtp={loginWithOtp}
          resendOptTimmer={resendOptTimmer}
        />
      ) : (
        <LoginWithPassword
          sendOtpLoader={sendOtpLoader}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          submitHandler={submitHandler}
        />
      )}
    </>
  );
};

const LoginWithOtp = ({
  sendOtpLoader,
  seconds,
  setOtp,
  otp,
  sendOtp,
  loginWithOtp,
  resendOptTimmer,
}) => {
  const cleanPhoneNumber = (value) => {
    if (!value) return '';

    // Remove all spaces first
    let cleaned = value.replace(/\s/g, '');

    // Remove leading +91, 91, or 0
    if (cleaned.startsWith('+91')) {
      cleaned = cleaned.substring(3);
    } else if (cleaned.startsWith('91') && cleaned.length > 10) {
      cleaned = cleaned.substring(2);
    } else if (cleaned.startsWith('0')) {
      cleaned = cleaned.substring(1);
    }

    // Keep only digits and limit to 10 characters
    cleaned = cleaned.replace(/\D/g, '').substring(0, 10);

    return cleaned;
  };
  return (
    <Formik
      validationSchema={otpValidationSchema}
      initialValues={otpInitialValues}
      onSubmit={(v, a) => {
        if (!v.showOtp) {
          sendOtp(v, a);
        } else {
          loginWithOtp(v, a);
        }
      }}
    >
      {({ values, setFieldValue, setFieldTouched, errors, touched }) => {
        // Determine if phone or email is being used
        const isPhoneFilled =
          values.phoneNumber && values.phoneNumber.trim() !== '';
        const isEmailFilled = values.email && values.email.trim() !== '';

        return (
          <Form className="w-full h-full py-10 flex flex-col justify-center items-center gap-5">
            <h2 className="text-center font-bold text-xl">LogIn With OTP</h2>

            {values.showOtp ? (
              <div className="text-xs">
                Enter the code sent to{' '}
                <button
                  className="text-[#00FFD1] hover:text-pink-400"
                  onClick={() => setFieldValue('showOtp', false)}
                >
                  {isPhoneFilled
                    ? `${values.countryCode} ${values.phoneNumber}`
                    : values.email}{' '}
                  <FaEdit className="inline-block text-sm mb-1" />
                </button>
              </div>
            ) : null}

            {values.showOtp ? (
              <div>
                <div className="relative">
                  <OtpInput
                    inputNumber={4}
                    otp={otp}
                    setOTP={setOtp}
                    onChange={(otp) => setFieldValue('otp', otp)}
                  />
                  <ErrorMessage
                    name="otp"
                    component="div"
                    className="absolute -bottom-5 text-red-500 w-full text-center font-extrabold text-xs"
                  />
                </div>

                <p
                  className={`text-sm text-center mt-7 font-extrabold transition-all ${
                    seconds > 10 ? 'text-[#9E63FF]' : 'text-red-500'
                  }`}
                >
                  {getFormatTime(seconds)} Left
                </p>
              </div>
            ) : (
              <div className="w-3/4 mx-auto space-y-4">
                {/* Phone Number Field */}
                <div className="relative mb-2">
                  <div
                    className={`border-[#49ffe9a6] px-2 border-2 bg-box-shadow bg-[#190C3D] rounded-lg flex ${isEmailFilled ? 'opacity-50' : ''}`}
                  >
                    <Field
                      as="select"
                      name="countryCode"
                      className="bg-transparent w-1/4 min-w-14 max-w-14 outline-none"
                      disabled={isEmailFilled}
                      onChange={(e) => {
                        setFieldValue('showOtp', false);
                        setFieldValue('countryCode', e.target.value);
                      }}
                    >
                      {selectOptions.map((val) => (
                        <option value={val} key={val} className="text-black">
                          {val}
                        </option>
                      ))}
                    </Field>
                    <Field
                      placeholder="Enter your Number"
                      type="text"
                      name="phoneNumber"
                      disabled={isEmailFilled}
                      className={`py-2 px-2 h-full bg-transparent outline-none w-3/4 ${isEmailFilled ? 'cursor-not-allowed' : ''}`}
                      onChange={(e) => {
                        const cleanedValue = cleanPhoneNumber(e.target.value);
                        setFieldValue('showOtp', false);
                        setFieldValue('phoneNumber', cleanedValue);
                        // Clear email when phone is being entered
                        if (cleanedValue.trim() !== '') {
                          setFieldValue('email', '');
                        }
                      }}
                      onFocus={() => {
                        setFieldTouched('phoneNumber', false);
                        if (errors.phoneNumber) {
                          setFieldValue('phoneNumber', values.phoneNumber);
                        }
                      }}
                    />
                  </div>
                  <ErrorMessage
                    name="phoneNumber"
                    component="div"
                    className="absolute top-10 text-red-500 font-extrabold text-xs"
                  />
                </div>

                {/* OR Separator */}
                <div className="flex items-center justify-center my-4">
                  <div className="flex-grow h-px bg-gray-400"></div>
                  <span className="px-3 text-gray-400 text-sm">OR</span>
                  <div className="flex-grow h-px bg-gray-400"></div>
                </div>

                {/* Email Field */}
                <div className="relative mb-2">
                  <div
                    className={`border-[#49ffe9a6] px-2 border-2 bg-box-shadow bg-[#190C3D] rounded-lg ${isPhoneFilled ? 'opacity-50' : ''}`}
                  >
                    <Field
                      placeholder="Enter your Email"
                      type="email"
                      name="email"
                      disabled={isPhoneFilled}
                      className={`py-2 px-2 h-full bg-transparent outline-none w-full ${isPhoneFilled ? 'cursor-not-allowed' : ''}`}
                      onChange={(e) => {
                        setFieldValue('showOtp', false);
                        setFieldValue('email', e.target.value);
                        // Clear phone when email is being entered
                        if (e.target.value.trim() !== '') {
                          setFieldValue('phoneNumber', '');
                        }
                      }}
                      onFocus={() => {
                        setFieldTouched('email', false);
                        if (errors.email || errors.phoneNumber) {
                          setFieldValue('email', values.email);
                        }
                      }}
                    />
                  </div>
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="absolute top-10 text-red-500 font-extrabold text-xs"
                  />
                </div>

                {/* Global validation error */}
                {!isPhoneFilled && !isEmailFilled && errors.contactRequired && (
                  <div className="text-red-500 font-extrabold text-xs text-center">
                    Either phone number or email is required
                  </div>
                )}
              </div>
            )}
            <div className="w-3/4 mx-auto">
              <Button className="w-full" type="submit" loading={sendOtpLoader}>
                {values.showOtp ? 'Login' : 'Send OTP'}
              </Button>
              {values.showOtp ? (
                <p className="text-sm text-center mt-3">
                  Did not get the OTP?{' '}
                  {resendOptTimmer === 0 ? (
                    <button
                      className="text-[#00FFD1] hover:text-pink-400 disabled:text-gray-500 disabled:cursor-not-allowed"
                      onClick={() =>
                        sendOtp(values, {
                          setFieldTouched,
                          setFieldValue,
                        })
                      }
                      disabled={sendOtpLoader}
                    >
                      Resend
                    </button>
                  ) : (
                    <>Resend in {getFormatTime(resendOptTimmer)}</>
                  )}
                </p>
              ) : null}
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

const LoginWithPassword = ({
  submitHandler,
  showPassword,
  setShowPassword,
  sendOtpLoader,
}) => {
  const cleanPhoneNumber = (value) => {
    if (!value) return '';

    // Remove all spaces first
    let cleaned = value.replace(/\s/g, '');

    // Remove leading +91, 91, or 0
    if (cleaned.startsWith('+91')) {
      cleaned = cleaned.substring(3);
    } else if (cleaned.startsWith('91') && cleaned.length > 10) {
      cleaned = cleaned.substring(2);
    } else if (cleaned.startsWith('0')) {
      cleaned = cleaned.substring(1);
    }

    // Keep only digits and limit to 10 characters
    cleaned = cleaned.replace(/\D/g, '').substring(0, 10);

    return cleaned;
  };
  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={initialValues}
      onSubmit={submitHandler}
    >
      {({ setFieldValue }) => (
        <Form className="w-full  h-full py-10  flex flex-col justify-center items-center gap-5">
          <h2 className="text-center font-bold text-xl">
            LogIn With Phone No.
          </h2>
          <div className="w-3/4 mx-auto relative mb-2">
            <div className=" border-[#49ffe9a6] px-2 border-2 bg-box-shadow bg-[#190C3D] rounded-lg flex ">
              <Field
                as="select"
                name="countryCode"
                className="bg-transparent w-1/4 min-w-14 max-w-14 outline-none"
                onChange={(e) => {
                  setFieldValue('showOtp', false);
                  setFieldValue('countryCode', e.target.value);
                }}
              >
                {selectOptions.map((val) => (
                  <option value={val} key={val} className="text-black">
                    {val}
                  </option>
                ))}
              </Field>
              <Field
                placeholder="Enter your Number"
                type="text"
                name="phoneNumber"
                className="py-2 px-2 h-full bg-transparent outline-none w-3/4"
                onChange={(e) => {
                  const cleanedValue = cleanPhoneNumber(e.target.value);
                  setFieldValue('showOtp', false);
                  setFieldValue('phoneNumber', cleanedValue);
                }}
              />
            </div>

            <ErrorMessage
              name="phoneNumber"
              component="div"
              className="absolute top-10 text-red-500 font-extrabold text-xs"
            />
          </div>

          <div className=" w-3/4 mx-auto relative mb-4">
            <div className=" border-[#49ffe9a6] px-2 border-2 bg-box-shadow bg-[#190C3D] rounded-lg flex ">
              <Field
                placeholder="Password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                className="py-2 px-2 h-full bg-transparent outline-none w-3/4"
              />
              <div
                className="absolute right-2 cursor-pointer top-2"
                onClick={() => {
                  setShowPassword(!showPassword);
                }}
              >
                {showPassword ? (
                  <IoMdEye size={16} color="#49ffe9a6" />
                ) : (
                  <IoMdEyeOff size={16} color="#49ffe9a6" />
                )}
              </div>
            </div>

            <ErrorMessage
              name="password"
              component="div"
              className="absolute top-10 text-red-500 font-extrabold text-xs"
            />
          </div>

          <div className=" w-3/4 mx-auto">
            <Button className="w-full" type="submit" loading={sendOtpLoader}>
              Login
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default LoginPhoneNo;
