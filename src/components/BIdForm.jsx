'use client';
import useQueryParam from '@/hooks/useQueryParam';
import { getAuctionListByHouseAction } from '@/redux/auctions/action.auctions';
import { emitEvent, subscribeToEvent } from '@/lib/socket';
import { auctionState } from '@/redux/auctions/reducer.auctions';
import { MODAL_KEYS, setModal } from '@/redux/modal/action.modal';
import { userState } from '@/redux/user/reducer.user';
import toast from 'react-hot-toast';
import forge from 'node-forge';
import {
  AUCTION_GROUP,
  AUCTION_STATUS,
  AUCTION_TYPES,
  ROUTES,
  SOCKET_EVENTS,
} from '@/utils/constant/constant.helper';
import { Field, Form, Formik } from 'formik';
import React, { useState, useRef, useEffect } from 'react';
import { FaArrowRight } from 'react-icons/fa6';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { getPlaceholder, getRange } from '@/utils/helpers/utils.helper';
import bidSound from '@/assets/sound/popClick.mp3';

const BIdForm = ({
  onInputChange,
  inputValue,
  onSubmitFromNumpad,
  onClearInput,
}) => {
  const dispatch = useDispatch();
  const router = useQueryParam();
  const { currentAuction, isWinning } = useSelector(auctionState);
  const { userInfo, auctionHouseInfo } = useSelector(userState);
  const [showShakeEffect, setShowShakeEffect] = useState(false);
  const formikRef = useRef();

  // RSA Public Key (replace with your actual key from environment variables)
  const PUBLIC_KEY = currentAuction?.rsa_public_key;

  /**
   * Convert PEM to ArrayBuffer for Web Crypto API
   */
  function pemToArrayBuffer(pem) {
    const b64Lines = pem
      .replace(/-+BEGIN PUBLIC KEY-+/g, '')
      .replace(/-+END PUBLIC KEY-+/g, '')
      .replace(/\s/g, '');

    const binaryString = atob(b64Lines);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  /**
   * Encrypt bid value using Web Crypto API
   */
  async function encryptBid(bidValue) {
    try {
      const cleanPublicKey = PUBLIC_KEY.trim().replace(/\r\n|\r|\n/g, '\n');
      const publicKeyObj = forge.pki.publicKeyFromPem(cleanPublicKey);
      const bidString = bidValue.toString();

      // Use PKCS#1 v1.5 padding with deterministic encryption
      const encrypted = publicKeyObj.encrypt(bidString, 'RSAES-PKCS1-V1_5', {
        random: forge.util.createBuffer(), // Empty buffer → deterministic
      });

      return forge.util.encode64(encrypted);
    } catch (error) {
      console.error('Encryption error:', error);
      return bidValue.toString();
    }
  }

  // Sync inputValue with Formik only when absolutely necessary
  const lastSyncedValue = useRef(inputValue);

  useEffect(() => {
    if (inputValue !== lastSyncedValue.current && formikRef.current) {
      lastSyncedValue.current = inputValue;
      // Use requestAnimationFrame to avoid render phase issues
      requestAnimationFrame(() => {
        if (formikRef.current && inputValue !== formikRef.current.values.bid) {
          formikRef.current.setFieldValue('bid', inputValue, false);
        }
      });
    }
  }, [inputValue]);

  // Encryption utilities
  const encryptData = (data, key = 'bidSecretKey2024') => {
    try {
      const jsonString = JSON.stringify(data);
      const encrypted = btoa(unescape(encodeURIComponent(jsonString + key)));
      return encrypted;
    } catch (error) {
      return null;
    }
  };

  const decryptData = (encryptedData, key = 'bidSecretKey2024') => {
    try {
      const decrypted = decodeURIComponent(escape(atob(encryptedData)));
      const jsonString = decrypted.replace(key, '');
      return JSON.parse(jsonString);
    } catch (error) {
      return null;
    }
  };

  // Bid storage utilities
  const getBidsFromStorage = () => {
    try {
      const encryptedBids = localStorage.getItem('bids');
      if (!encryptedBids) return {};
      const allBidsData = decryptData(encryptedBids);
      return allBidsData || {};
    } catch (error) {
      return {};
    }
  };

  const saveBidsToStorage = (allBidsData) => {
    try {
      const encryptedData = encryptData(allBidsData);
      if (encryptedData) {
        localStorage.setItem('bids', encryptedData);
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const addBidToStorage = (userId, bidData) => {
    try {
      const allBidsData = getBidsFromStorage();
      const auctionId = currentAuction?.id;
      if (!allBidsData[auctionId]) {
        allBidsData[auctionId] = {};
      }
      if (!allBidsData[auctionId][userId]) {
        allBidsData[auctionId][userId] = [];
      }
      const existingBid = allBidsData[auctionId][userId].find(
        (bid) => bid.bid_price === bidData.bid_price,
      );
      if (existingBid) {
        return false;
      }
      const bidEntry = {
        ...bidData,
        auction_id: auctionId,
        timestamp: new Date().toISOString(),
        id: Date.now() + Math.random(),
      };

      allBidsData[auctionId][userId].unshift(bidEntry);
      if (allBidsData[auctionId][userId].length > 20) {
        allBidsData[auctionId][userId] = allBidsData[auctionId][userId].slice(
          0,
          20,
        );
      }

      return saveBidsToStorage(allBidsData);
    } catch (error) {
      return false;
    }
  };

  const blinkEffect = () => {
    const container = document.getElementById('BidBarSection');
    container && container.classList.add('blink-effect');
    setTimeout(() => {
      container && container.classList.remove('blink-effect');
    }, 1900);
  };

  const submitHandler = async (values, { resetForm }) => {
    if (userInfo?.accessToken) {
      const { minValue, maxValue } = getRange(
        currentAuction?.min_bid_price,
        currentAuction?.max_bid_price,
        currentAuction?.decimal_count,
      );
      const bidValue = parseFloat(values?.bid) || 0;
      const bidString = values?.bid?.toString() || '';

      if (isWinning) {
        setShowShakeEffect(true);
        setTimeout(() => {
          setShowShakeEffect(false);
        }, 200);
        resetForm();
        onClearInput && onClearInput();
        return;
      }
      // Check if first digit is decimal point or single zero when minimum is >= 1
      if (
        (bidString.includes('.') && bidString.length === 1) ||
        (bidString.includes('0') && bidString.length === 1 && minValue >= 1) ||
        (bidString === '0.' && minValue >= 1)
      ) {
        toast.error(
          `Cannot add first digits is point or start with single zero when minimum bid is ${minValue}`,
        );
        setShowShakeEffect(true);
        setTimeout(() => {
          setShowShakeEffect(false);
        }, 200);
        resetForm();
        onClearInput && onClearInput();
        return;
      }

      // Check decimal places limit
      if (bidString.includes('.')) {
        const parts = bidString.split('.');
        if (
          parts[1] &&
          parts[1].length > (currentAuction?.decimal_count || 1)
        ) {
          toast.error(
            `Cannot add more than ${currentAuction?.decimal_count || 1} digits after the decimal point`,
          );
          setShowShakeEffect(true);
          setTimeout(() => {
            setShowShakeEffect(false);
          }, 200);
          resetForm();
          onClearInput && onClearInput();
          return;
        }
      }

      // Check multiple decimal points
      const decimalCount = (bidString.match(/\./g) || []).length;
      if (decimalCount > 1) {
        toast.error('Selected Number already contains a decimal point');
        setShowShakeEffect(true);
        setTimeout(() => {
          setShowShakeEffect(false);
        }, 200);
        resetForm();
        onClearInput && onClearInput();
        return;
      }

      // Check minimum value
      if (bidValue < minValue) {
        toast.error(`Minimum bid value is ${minValue}`);
        setShowShakeEffect(true);
        setTimeout(() => {
          setShowShakeEffect(false);
        }, 200);
        resetForm();
        onClearInput && onClearInput();
        return;
      }

      // Check maximum value
      if (bidValue > maxValue) {
        toast.error(`Maximum Selected Number is ${maxValue}`);
        setShowShakeEffect(true);
        setTimeout(() => {
          setShowShakeEffect(false);
        }, 200);
        resetForm();
        onClearInput && onClearInput();
        return;
      }

      try {
        // Encrypt the bid value
        const encryptedBidPrice = await encryptBid(bidValue);
        console.log(encryptedBidPrice, 'encryptedBidPrice');
        // Prepare bid data for storage (using original bidValue for storage)
        const bidData = {
          auction_id: currentAuction?.id,
          bid_price: bidValue, // Store original value locally
          auction_title: currentAuction?.title || 'Unknown Auction',
          auction_type: currentAuction?.auctionCategory?.code,
          min_bid_price: currentAuction?.min_bid_price,
          max_bid_price: currentAuction?.max_bid_price,
          player_name:
            userInfo?.first_name ||
            userInfo?.wallet_address?.slice?.(-6)?.toString?.(),
          profile_image:
            process.env.NEXT_PUBLIC_API_ENDPOINT + '/' + userInfo?.avatar,
        };

        // Emit event with encrypted bid price
        emitEvent(SOCKET_EVENTS.EMIT.MIN_MAX_AUCTION, {
          auction_id: currentAuction?.id,
          player_id: userInfo?.id,
          bid_price: encryptedBidPrice,
          // bid_price: bidValue,
          player_name:
            userInfo?.first_name ||
            userInfo?.wallet_address?.slice?.(-6)?.toString?.(),
          profile_image:
            process.env.NEXT_PUBLIC_API_ENDPOINT + '/' + userInfo?.avatar,
        });

        // Store bid in localStorage after successful submission
        let hasStoredBid = false;

        subscribeToEvent(SOCKET_EVENTS.ON.AUCTION_MIN_MAX_PERCENTAGE, (res) => {
          if (!hasStoredBid && res?.data?.auction_id === currentAuction?.id) {
            hasStoredBid = true;
            addBidToStorage(userInfo?.id, bidData);
          }
        });

        blinkEffect();
        const bidErrorAudio = new Audio(bidSound);
        bidErrorAudio.volume = 1.0;
        bidErrorAudio.muted = false;
        bidErrorAudio.play();
        resetForm();
        onClearInput && onClearInput();
      } catch (error) {
        console.error('Error in bid submission:', error);
        // Handle encryption error - you might want to show user feedback here
        resetForm();
        onClearInput && onClearInput();
      }
    } else {
      dispatch(setModal({ key: MODAL_KEYS.LOGIN, value: true }));
    }
  };

  const fetchAuctionGridData = () => {
    try {
      dispatch(
        getAuctionListByHouseAction(
          {
            limit: 1,
            page: 0,
            state: AUCTION_STATUS.LIVE,
            auction_house_id: auctionHouseInfo?.currentAuctionHouse?.id,
          },
          (res) => {
            if (res?.data?.[0]?.id) {
              router.push(ROUTES.BASE + res?.data?.[0].id);
            } else router.push(ROUTES.COMING_SOON);
          },
        ),
      );
    } catch (error) {
      console.error(error, 'fetchAuctionGridData');
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    const isValidInput = /^[0-9]*\.?[0-9]*$/.test(value);
    if (!isValidInput) {
      return;
    }
    const decimalCount = (value.match(/\./g) || []).length;
    if (decimalCount > 1) {
      return;
    }
    onInputChange && onInputChange(value);
  };

  // Expose form submission to parent component
  React.useImperativeHandle(onSubmitFromNumpad, () => ({
    submitForm: () => {
      if (formikRef.current) {
        formikRef.current.handleSubmit();
      }
    },
  }));

  return (
    <div
      className={`animation-card mx-auto relative bg-box-shadow ${showShakeEffect ? 'shake-effect' : ''} ${currentAuction?.state === AUCTION_STATUS.LIVE ? '' : '-mt-0.5'} `}
    >
      {currentAuction?.state === AUCTION_STATUS.LIVE ? (
        <div className="w-full h-full !bg-[#190C3D] py-2 px-5 flex items-center">
          {isWinning ? (
            <p className="text-[#9ca3af]">You are WINNING</p>
          ) : (
            <Formik
              initialValues={{ bid: inputValue || '' }}
              onSubmit={submitHandler}
              enableReinitialize
              innerRef={formikRef}
            >
              <Form className="w-full h-full">
                <Field
                  type="text"
                  inputMode="decimal"
                  // placeholder={getPlaceholder(
                  //   currentAuction?.auctionCategory?.code === AUCTION_TYPES.MAX
                  //     ? AUCTION_GROUP.HIGHEST
                  //     : AUCTION_GROUP.LOWEST,
                  // )}
                  placeholder={`Enter between ${
                    getRange(
                      currentAuction?.min_bid_price,
                      currentAuction?.max_bid_price,
                      currentAuction?.decimal_count,
                    )?.rangeString
                  }`}
                  readOnly
                  className="h-full bg-transparent w-[90%] outline-none text-md placeholder:text-sm"
                  step="any"
                  // Commented Below line to enable keyboard
                  // pattern="[0-9]*"
                  name="bid"
                  value={inputValue || ''}
                  onChange={handleInputChange}
                  onWheel={(e) => e.target.blur()}
                />
                {/* <button
                  type="submit"
                  className={`absolute left-[55%] ${storedIsWebBrowser ? 'top-[7px]' : 'top-[6px]'} :left-[60%] text-xl p-1 hover:bg-[#B57FEC80] rounded-full`}
                >
                  <FaArrowRight />
                </button> */}
              </Form>
            </Formik>
          )}

          {/* <div className="absolute -bottom-5 right-4 text-[#9E63FF] text-xs font-bold ">
            Range:{' '}
            {
              getRange(
                currentAuction?.min_bid_price,
                currentAuction?.max_bid_price,
                currentAuction?.decimal_count,
              )?.rangeString
            }
          </div> */}
        </div>
      ) : (
        // TODO we change this logic for upcoming and completed auction
        <div className="w-full h-full !bg-[#190C3D] rounded-[90px] flex items-center">
          <Link
            href={ROUTES.COMING_SOON}
            className="font-bold text-md rounded-[90px] me-10 text-center w-full h-full flex justify-center items-center"
          >
            PLAY NEXT AUCTION
          </Link>
        </div>
      )}
    </div>
  );
};

export default BIdForm;
