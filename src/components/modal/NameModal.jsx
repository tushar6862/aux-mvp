import React, { useEffect, useRef, useState } from 'react';
import * as Yup from 'yup';
import ModalWrapper from './ModalWrapper';
import Button from '../form-component/Button';
import { useDispatch, useSelector } from 'react-redux';
import { MODAL_KEYS, setModal } from '@/redux/modal/action.modal';
import { FaCheck } from 'react-icons/fa';
import Link from 'next/link';
import CustomImage from '../CustomImage';
import { TbEdit } from 'react-icons/tb';
import AvatarList from './AvatarList';
import { TiArrowBack } from 'react-icons/ti';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { updateUserInfoAction } from '@/redux/user/action.user';
import { modalState } from '@/redux/modal/reducer.modal';
import { userState } from '@/redux/user/reducer.user';
import { DYNAMIC_IMAGE_UNOPTIMISED } from '@/utils/constant/constant.helper';

const phoneCodeOptions = [{ label: '+91', value: '+91' }];
const genederOptions = [
  { label: 'Male', value: 'MALE' },
  { label: 'Female', value: 'FEMALE' },
  { label: 'Other', value: 'OTHER' },
];
const countryOptions = [{ label: 'India', value: 'India' }];

const initialValues = {
  name: '',
  referral: '',
  avatar: '',
  isTermShow: true,
  is_verified: true,
  city: '',
  gender: genederOptions[0].value,
  email: '',
  phoneNumber: '',
  phoneCode: phoneCodeOptions[0].value,
  // terms: false,
};

const validationSchema = Yup.object({
  name: Yup.string()
    .min(3, 'Name must be 3 characters or more')
    .max(14, 'Name must be 14 characters or less')
    .required('Name is required'),
  referral: Yup.string(),
  // terms: Yup.boolean().when('isTermShow', {
  //   is: (value) => value,
  //   then: (schema) => schema.oneOf([true], 'Agree terms and condition'),
  //   otherwise: (schema) => schema.string,
  // }),
  phoneNumber: Yup.string()
    .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits')
    .test(
      'phone-or-email-required',
      'Please provide an Email or Phone',
      function (value) {
        const { email, is_verified } = this.parent;
        if (is_verified) return true;
        return !!value || !!email;
      },
    ),
  email: Yup.string()
    .email('Invalid email')
    .test(
      'email-or-phone-required',
      'Please provide an Email or Phone',
      function (value) {
        const { phoneNumber, is_verified } = this.parent;
        if (is_verified) return true;
        return !!value || !!phoneNumber;
      },
    ),
});

const NameModal = () => {
  const dispatch = useDispatch();
  const { userInfoModal } = useSelector(modalState);
  const { userInfo, formLoader } = useSelector(userState);
  const [showAvatarList, setShowAvatarList] = useState(false);
  const [formData, setFormData] = useState(initialValues);
  const formRef = useRef(null);

  const closeHandler = () => {
    dispatch(setModal({ key: MODAL_KEYS.USER_INFO, value: false }));
    setShowAvatarList(false);
    setTimeout(() => formRef.current?.resetForm(), 500);
  };

  useEffect(() => {
    if (userInfoModal) {
      if (userInfo?.accessToken) {
        setFormData((prevData) => ({
          ...prevData,
          name: userInfo?.first_name || '',
          avatar: userInfo?.avatar || '',
          is_verified: userInfo?.is_verified || false,
          city: userInfo?.city || '',
          email: userInfo?.email || '',
          gender:
            genederOptions.find((e) => e.value === userInfo?.gender)?.value ||
            genederOptions[0]?.value,
          phoneCode: phoneCodeOptions[0]?.value,
          phoneNumber: userInfo?.mobile_no?.replace?.('+91', '') || '',
        }));
      } else setFormData(initialValues);
    }
  }, [userInfoModal]);

  const submitHandler = (values) => {
    const data = {
      first_name: values.name,
      last_name: '',
      avatar: values?.avatar,
      country: countryOptions[0]?.value,
      city: values?.city,
      gender: values?.gender,
    };
    if (values?.is_verified) {
      data.mobile_no = values?.phoneNumber
        ? values?.phoneCode + values?.phoneNumber
        : '';
      data.email = values?.email || '';
    }
    dispatch(
      updateUserInfoAction(data, (res) => {
        if (res.success) {
          closeHandler();
        }
      }),
    );
  };

  return (
    <Formik
      initialValues={formData}
      validationSchema={validationSchema}
      onSubmit={submitHandler}
      enableReinitialize
      innerRef={formRef}
    >
      {({ values, setFieldValue }) => (
        <Form>
          <ModalWrapper
            show={userInfoModal}
            closeHandler={values.is_verified ? closeHandler : null}
            className="h-[35rem]"
          >
            {showAvatarList ? (
              <>
                <div
                  className="text-lg font-black  absolute top-3 left-3 rounded-full text-white bg-[#FFFFFF33] aspect-square w-8 flex justify-center items-center  cursor-pointer hover:bg-white  hover:text-[#190C3D] transition-all"
                  onClick={() => setShowAvatarList(false)}
                >
                  <TiArrowBack />
                </div>
                <AvatarList
                  selectAvatar={(avatar) => {
                    if (avatar && typeof avatar === 'string') {
                      setShowAvatarList(false);
                      setFieldValue('avatar', avatar);

                      setTimeout(() => {}, 100);
                    }
                  }}
                  modelClose={() => setShowAvatarList(false)}
                />
              </>
            ) : (
              <div className="w-full  h-full flex flex-col justify-center items-center gap-3 py-10 overflow-y-auto">
                <h2 className="text-center font-bold text-2xl ">
                  {!values.is_verified ? 'Welcome!' : 'Profile'}
                </h2>
                <div className="flex flex-1 flex-col items-center justify-center gap-3 w-3/4 mx-auto">
                  <div className="border-custom-gradient p-[2px] bg-box-shadow  rounded-full">
                    <div
                      className="w-20 h-20 group rounded-full relative text-4xl flex items-center justify-center bg-[#190C3D] cursor-pointer"
                      onClick={() => setShowAvatarList(true)}
                    >
                      {values?.avatar ? (
                        <>
                          {/* <CustomImage
                            path={values?.avatar}
                            height={1000}
                            width={1000}
                            alt="profile"
                            className="w-full h-full rounded-full"
                            unoptimized={DYNAMIC_IMAGE_UNOPTIMISED}
                          /> */}
                          {values.avatar.startsWith('data:image') ? (
                            <img
                              src={values.avatar}
                              alt="profile"
                              className="w-full h-full rounded-full"
                            />
                          ) : (
                            <CustomImage
                              path={values.avatar}
                              height={1000}
                              width={1000}
                              alt="profile"
                              className="w-full h-full rounded-full"
                              unoptimized={DYNAMIC_IMAGE_UNOPTIMISED}
                            />
                          )}
                          <div className="group transition-all bg-[#B57FEC80] p-1 duration-300 ease-in-out absolute bottom-0 hover:backdrop-blur-sm  rounded-full -left-2">
                            <TbEdit className="aspect-square w-5 h-auto transition-all duration-300 ease-in-out group-hover:w-7" />
                          </div>
                        </>
                      ) : (
                        <div className="bg-black h-full w-full rounded-full" />
                      )}
                    </div>
                  </div>
                  <div className="border-custom-gradient p-[2px] h-9 bg-box-shadow rounded-lg flex relative w-full mb-2">
                    <Field
                      placeholder="What should we call you?"
                      type="text"
                      name="name"
                      className="py-2 px-3 h-full bg-[#190C3D] rounded-lg outline-none w-full "
                    />
                    <div className="text-xs text-red-600 top-9 absolute font-bold">
                      <ErrorMessage name="name" />
                    </div>
                  </div>

                  {values?.is_verified ? (
                    <>
                      <div className="border-custom-gradient p-[2px] h-9 bg-box-shadow rounded-lg flex relative w-full mb-2">
                        <Field
                          placeholder="Email"
                          type="text"
                          name="email"
                          className="py-2 px-3 h-full bg-[#190C3D] rounded-lg outline-none w-full"
                        />

                        <div className="text-xs text-red-600 top-9 absolute font-bold">
                          <ErrorMessage name="email" />
                        </div>
                      </div>

                      <div className="border-custom-gradient p-[2px] h-9 bg-box-shadow  rounded-lg flex relative w-full mb-2">
                        <div className="px-2 bg-box-shadow bg-[#190C3D] rounded-lg flex w-full">
                          <Field
                            as="select"
                            name="countryCode"
                            className="bg-transparent w-1/4 min-w-14 max-w-14 outline-none"
                            onChange={(e) => {
                              // setFieldValue('showOtp', false);
                              setFieldValue('countryCode', e.target.value);
                            }}
                          >
                            {phoneCodeOptions.map((opt) => (
                              <option
                                value={opt.value}
                                key={opt.value}
                                className="text-black"
                              >
                                {opt.label}
                              </option>
                            ))}
                          </Field>
                          <Field
                            placeholder="Enter your Number"
                            type="text"
                            name="phoneNumber"
                            className="py-2 px-2 h-full bg-transparent outline-none w-full"
                            // className="py-2 px-2 h-full bg-transparent outline-none w-[187px]"
                            // onChange={(e) => {
                            // setFieldValue('showOtp', false);
                            // setFieldValue('phoneNumber', e.target.value);
                            // }}
                          />
                        </div>

                        <ErrorMessage
                          name="phoneNumber"
                          component="div"
                          className="absolute top-9 text-red-600 font-extrabold text-xs"
                        />
                      </div>
                    </>
                  ) : null}

                  <div className="border-custom-gradient p-[2px] h-9 bg-box-shadow  rounded-lg flex relative w-full mb-2">
                    <Field
                      as="select"
                      name="gender"
                      className="py-2 px-3 h-full bg-[#190C3D] rounded-lg outline-none w-full"
                      onChange={(e) => {
                        setFieldValue('gender', e.target.value);
                      }}
                    >
                      {genederOptions.map((opt) => (
                        <option value={opt.value} key={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </Field>

                    <div className="text-xs text-red-600 top-9 absolute font-bold">
                      <ErrorMessage name="gender" />
                    </div>
                  </div>
                  <div className="border-custom-gradient p-[2px] h-9 bg-box-shadow  rounded-lg flex relative w-full mb-2">
                    <Field
                      as="select"
                      name="country"
                      className="py-2 px-3 h-full bg-[#190C3D] rounded-lg outline-none w-full"
                      onChange={(e) => {
                        setFieldValue('country', e.target.value);
                      }}
                    >
                      {countryOptions.map((opt) => (
                        <option value={opt.value} key={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </Field>

                    <div className="text-xs text-red-600 top-9 absolute font-bold">
                      <ErrorMessage name="country" />
                    </div>
                  </div>

                  <div className=" border-custom-gradient p-[2px] h-9 bg-box-shadow  rounded-lg flex relative w-full mb-2">
                    <Field
                      placeholder="City"
                      type="text"
                      name="city"
                      className="py-2 px-3 h-full bg-[#190C3D] rounded-lg outline-none w-full"
                    />

                    <div className="text-xs text-red-600 top-9 absolute font-bold">
                      <ErrorMessage name="city" />
                    </div>
                  </div>

                  {!values?.is_verified ? (
                    <div className="border-custom-gradient p-[2px] h-9 bg-box-shadow  rounded-lg flex relative w-full mb-2">
                      <Field
                        placeholder="Referral Code (optional)"
                        type="text"
                        name="referral"
                        className="py-2 px-3 h-full bg-[#190C3D] rounded-lg outline-none w-full"
                      />

                      <div className="text-xs text-red-600 top-9 absolute font-bold">
                        <ErrorMessage name="referral" />
                      </div>
                    </div>
                  ) : null}
                </div>

                <div className="w-3/4 mx-auto">
                  {!values?.is_verified ? (
                    <>
                      {/* Terms and condition code commented */}
                      {/* <label 
                        htmlFor="terms"
                        className="text-xs flex items-center justify-center gap-1 mb-4 font-bold relative"
                      >
                        <Field
                          type="checkbox"
                          name="terms"
                          id="terms"
                          className="w-0 h-0 opacity-0 peer"
                        />
                        <div className="w-3 h-3 border border-[#B57FEC] rounded-[4px] peer-checked:bg-[#B57FEC]   flex items-center justify-center">
                          <FaCheck className="text-[#190C3D]  w-2 h-2  check-icon" />
                        </div>
                        <div>
                          I agree with{' '}
                          <Link
                            // TODO:we change this url in future
                            href={'https://auxm.auctionx.live'}
                            target="_blank"
                            className="text-[#B57FEC] cursor-pointer hover:opacity-85 "
                          >
                            Terms & Conditions
                          </Link>
                        </div>
                        <div className="text-xs text-red-600 top-4 absolute font-bold">
                          <ErrorMessage name="terms" />
                        </div>
                      </label>*/}

                      <div className="mx-auto w-3/4">
                        <Button
                          className="w-full capitalize"
                          type="submit"
                          loading={formLoader}
                        >
                          Finish log in
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="mx-auto w-3/4">
                      <Button
                        className="w-full capitalize"
                        type="submit"
                        loading={formLoader}
                      >
                        Submit
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </ModalWrapper>
        </Form>
      )}
    </Formik>
  );
};

export default NameModal;
