import playLogo from '@/assets/images/play-icon.png';
import plusLogo from '@/assets/images/plus.png';
import { MODAL_KEYS, setModal } from '@/redux/modal/action.modal';
import { useDispatch } from 'react-redux';
import CustomImage from '../CustomImage';

const AnimatedFlipCard = ({
  playerName,
  walletBalance,
  firstCardClassName,
}) => {
  const dispatch = useDispatch();
  return (
    <div className="card">
      <div className="card-inner">
        <div
          className={`bg-[#B57FEC80] card-front rounded-md w-[100px] h-[45px] flex items-center justify-center gap-1 ${firstCardClassName} cursor-pointer`}
        >
          <div className="w-9 h-9">
            <CustomImage
              src={playLogo}
              className="w-full h-full"
              alt="play Logo"
              width={100}
              height={100}
            />
          </div>
          <div className="font-bold text-md mt-1">{walletBalance}</div>
          <div
            className="ml-auto bg-purple-overlay rounded-[5px] w-8 h-8 mr-1 flex items-center justify-center"
            onClick={() => {
              dispatch(setModal({ key: MODAL_KEYS.BUY_PLAYS, value: true }));
            }}
          >
            <CustomImage
              src={plusLogo}
              alt="Add Fund"
              width={16}
              height={16}
              className="w-4 h-4"
            />
          </div>
        </div>
        <div className="bg-[#B57FEC80] card-back rounded-md w-[100px] h-[45px] flex items-center justify-center gap-1">
          <div className="font-bold text-sm mt-1">{playerName}</div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedFlipCard;
