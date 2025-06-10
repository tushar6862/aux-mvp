import { ErrorMessage, Field, Form, Formik } from 'formik';
import { MODAL_KEYS, setModal } from '@/redux/modal/action.modal';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../form-component/Button';
import ModalWrapper from './ModalWrapper';
import { modalState } from '@/redux/modal/reducer.modal';
import { useEffect, useState } from 'react';
import {
  generateBuyPlaysLink,
  getCurrentPlaysValues,
} from '@/redux/transcation/action.transaction';
import { transactionState } from '@/redux/transcation/reducer.transaction';
import { userState } from '@/redux/user/reducer.user';
import { CURRENCY_SYMBOLS } from '@/utils/constant/constant.helper';
import { TiArrowBack } from 'react-icons/ti';
import CustomImage from '../CustomImage';
import UpiIcons from '@/assets/images/icons/upi.svg';
import CustomCard from '../cards/CustomCard';

const initialValues = {
  amount_paid: '',
  number_of_plays: '',
};

const CURRENCY_TYPE = {
  INR: 'INR',
  USD: 'USD',
};

const BuyPlaysModal = () => {
  const { buyPlaysModal } = useSelector(modalState);
  const { amountPerPlays, buyPlaysLoading } = useSelector(transactionState);
  const { auctionHouseInfo, userInfo } = useSelector(userState);
  const [showBuyForm, setShowBuyForm] = useState(false);
  const [paymentCurrency, setPaymentCurrency] = useState(null);
  const dispatch = useDispatch();

  const submitHandler = (values) => {
    dispatch(
      generateBuyPlaysLink(
        {
          player_id: userInfo?.id,
          auction_house_id: auctionHouseInfo?.currentAuctionHouse?.id,
          amount: values.amount_paid,
          plays: +values.number_of_plays,
          currency_type: paymentCurrency || CURRENCY_TYPE.INR,
        },
        (res) => {
          window.location.href = res?.data?.payment_url;
        },
      ),
    );
  };

  useEffect(() => {
    if (buyPlaysModal) dispatch(getCurrentPlaysValues());
    else setTimeout(() => setShowBuyForm(false), 300);
  }, [buyPlaysModal]);

  return (
    <ModalWrapper
      show={buyPlaysModal}
      closeHandler={() =>
        dispatch(setModal({ key: MODAL_KEYS.BUY_PLAYS, value: false }))
      }
    >
      {showBuyForm ? (
        <>
          <div
            className="text-lg font-black  absolute top-3 left-3 rounded-full text-white bg-[#FFFFFF33] aspect-square w-8 flex justify-center items-center  cursor-pointer hover:bg-white  hover:text-[#190C3D] transition-all"
            onClick={() => setShowBuyForm(false)}
          >
            <TiArrowBack />
          </div>

          <Formik initialValues={initialValues} onSubmit={submitHandler}>
            {({ values, setFieldValue }) => (
              <Form className="w-full  h-full py-10 flex flex-col justify-center items-center gap-4">
                <h2 className="text-center font-bold text-lg">Buy PLAYs</h2>
                <p className="w-3/4 mx-auto text-center  font-semibold">
                  Buy Plays using $Aux Tokens and get 10% Free PLAYS
                </p>
                <div className="w-1/2 mx-auto relative">
                  <div className="border-[#49ffe9a6] border-2 bg-box-shadow bg-[#190C3D] rounded-lg flex">
                    <input
                      placeholder="Enter Number of PLAYS"
                      type="text"
                      name="number_of_plays"
                      value={values.number_of_plays}
                      onChange={(e) => {
                        const val = e?.target?.value || '';
                        if (val) {
                          if (/^\d+$/.test(+val)) {
                            setFieldValue('number_of_plays', val);
                            setFieldValue('amount_paid', val * amountPerPlays);
                          }
                        } else {
                          setFieldValue('number_of_plays', '');
                          setFieldValue('amount_paid', '');
                        }
                      }}
                      className="py-2 px-2 h-full bg-transparent outline-none w-full"
                    />
                  </div>

                  <ErrorMessage
                    name="number_of_plays"
                    component="div"
                    className="absolute -bottom-4 text-red-500 font-extrabold text-xs"
                  />
                </div>
                <div className="w-1/2 mx-auto relative">
                  <div className="border-[#49ffe9a6] border-2 bg-box-shadow rounded-lg flex peer">
                    <Field
                      placeholder="Amount to be Paid"
                      type="text"
                      name="amount_paid"
                      className="py-2 px-2 h-full bg-[#190C3D] outline-none w-full rounded-lg disabled:!bg-[#413A56]"
                      disabled
                    />
                  </div>
                  <div className="text-xs absolute -right-[75px] top-1">
                    <p>
                      (1 PLAY = {amountPerPlays}{' '}
                      {auctionHouseInfo?.currentAuctionHouse?.currency_type ===
                        'INR' && CURRENCY_SYMBOLS.RUPEES_SYMBOL}
                      {auctionHouseInfo?.currentAuctionHouse?.currency_type ===
                        'USD' && CURRENCY_SYMBOLS.DOLLAR_SIGN}
                      ){' '}
                    </p>
                  </div>

                  <ErrorMessage
                    name="amount_paid"
                    component="div"
                    className="absolute -bottom-4 text-red-500 font-extrabold text-xs"
                  />
                </div>

                <div className=" w-1/2 mx-auto">
                  <Button
                    className="w-full"
                    type="submit"
                    disabled={buyPlaysLoading}
                  >
                    Proceed
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </>
      ) : (
        <PaymentMethodMenu
          setShowBuyForm={setShowBuyForm}
          setPaymentCurrency={setPaymentCurrency}
        />
      )}
    </ModalWrapper>
  );
};

export default BuyPlaysModal;

const PaymentMethodMenu = ({ setShowBuyForm, setPaymentCurrency }) => {
  return (
    <div className="w-full  h-full px-7 p-10 flex flex-col justify-start items-center gap-4">
      <h2 className="text-center font-bold text-lg">Choose Payment Method</h2>
      <div className="w-full">
        <h3 className="font-semibold">Pay with Fiat</h3>
        <div className="flex flex-wrap my-3 mx-3">
          <button
            className="bg-white  rounded-md  h-11 w-14 transition-all hover:opacity-90 hover:text-[#9E63FF] cursor-pointer active:opacity-50 outline-none"
            onClick={() => {
              setShowBuyForm(true);
              setPaymentCurrency(CURRENCY_TYPE.INR);
            }}
          >
            <div className="font-bold text-sm">
              <CustomImage
                src={UpiIcons}
                alt="auctionX Logo"
                className="w-full h-full"
                height={500}
                width={500}
              />
            </div>
          </button>
        </div>
      </div>

      <div className="w-full">
        <h3 className="w-full text-start font-semibold">Pay with Crypto</h3>
        <div className="flex items-center justify-center mt-2">
          <CustomCard className=" w-fit text-xs font-bold">
            Coming soon
          </CustomCard>
        </div>
      </div>
    </div>
  );
};
