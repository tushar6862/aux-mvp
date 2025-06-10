'use client';
import cracker from '@/assets/images/gif/celebration.gif';
import CustomImage from '../CustomImage';
import './circularProgressBar.css';

const getStrokeDashoffset = (isSmallDevice, percentage, isClaimShow) => {
  if (isSmallDevice) return 472 - (isClaimShow ? 100 : percentage) * 1.89;
  return 472 - (isClaimShow ? 100 : percentage) * 2.21;
};

const CircularProgressBar = ({
  percentage,
  id,
  isClaimShow,
  claimImageClick,
}) => {
  return (
    <div className="w-[100px] h-[100px] max-mobile:w-[100px] max-mobile:h-[100px] max-small-mobile:h-[86px] max-small-mobile:w-[86px]  bg-white  flex justify-center items-center rounded-[50%] border border-[#939598] absolute top-[-55px] right-[12px] bottom-0   m-auto   z-10">
      <div className="w-[90px] h-[90px] skill max-mobile:w-[90px] max-mobile:h-[90px] max-small-mobile:h-[80px] max-small-mobile:w-[80px] relative z-10">
        <div className="progress-bar-outer">
          <div className="progress-bar-inner">
            <div id="number" className="font-bold text-sm  text-[#162459]">
              {isClaimShow ? 'CLAIM' : <>{percentage ?? 0}%</>}
            </div>
          </div>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          width="100px"
          height="100px"
          style={{ zIndex: 1 }}
          className="absolute top-[-5px] left-[-5px]"
        >
          <defs>
            <linearGradient id="gradient">
              <stop offset="0%" style={{ stopColor: ' #FF11FA' }} />
              <stop offset="100%" style={{ stopColor: '#2C1572' }} />
            </linearGradient>
          </defs>
          <circle
            cx={window?.innerWidth <= 400 ? '55' : '50'}
            cy={window?.innerWidth <= 400 ? '45' : '50'}
            r={window?.innerWidth <= 400 ? '30' : '35'}
            style={{
              animation: `${
                id ? 'progress-bar-anim-' + [id] : 'progress-bar-anim'
              } 1s linear forwards`,
              transition: 'stroke-dashoffset 1s linear ease-in-out',
            }}
            stroke="url(#gradient)"
          />
          <style>
            {`
          @keyframes ${id ? 'progress-bar-anim-' + [id] : 'progress-bar-anim'} {
            100% {
              stroke-dashoffset: ${getStrokeDashoffset(
                window?.innerWidth <= 400,
                percentage,
                isClaimShow,
              )};  
            }            
          }
          `}
          </style>
        </svg>
        <div
          className={`absolute top-0 left-0 w-[90px] h-[90px] max-mobile:w-[90px] max-mobile:h-[90px] max-small-mobile:h-[80px] max-small-mobile:w-[80px] z-50 cursor-pointer rounded-full ${isClaimShow ? 'block' : 'hidden'}`}
          onClick={() => claimImageClick?.()}
        >
          <CustomImage
            src={cracker}
            className="w-full h-full rounded-full"
            alt="cracker"
            height={500}
            width={500}
          />
        </div>
      </div>
    </div>
  );
};

export default CircularProgressBar;
