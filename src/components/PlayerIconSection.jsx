import tempImage from '@/assets/images/temp.png';
import CustomImage from './CustomImage';
import { useEffect, useState } from 'react';
import { RxCross2 } from 'react-icons/rx';
import { DYNAMIC_IMAGE_UNOPTIMISED } from '@/utils/constant/constant.helper';

const PlayerIconSection = ({ profiles }) => {
  const [showPlayerName, setShowPlayerName] = useState({
    show: false,
    data: null,
  });

  useEffect(() => {
    let timeout;
    if (showPlayerName?.show) {
      timeout = setTimeout(
        () => setShowPlayerName((prev) => ({ ...prev, show: false })),
        2000,
      );
    }

    return () => {
      timeout && clearTimeout(timeout);
    };
  }, [showPlayerName?.show, showPlayerName?.data?.player_id]);

  return (
    <section className="mt-4 px-4 font-bold relative add-card-padding">
      <div
        className={`absolute  -top-5 left-0 w-full flex items-center justify-center  transition-all duration-500 ease-in-out ${showPlayerName?.show ? 'opacity-100 z-10' : 'opacity-0 -z-10'}`}
      >
        <div className="bg-white w-fit flex gap-1 text-center rounded-lg text-xs text-black py-1 px-2">
          <CustomImage
            src={showPlayerName?.data?.profile_image}
            className="w-4 h-4 rounded-full"
            height={100}
            width={100}
            alt="profile image"
            unoptimized={DYNAMIC_IMAGE_UNOPTIMISED}
          />
          {showPlayerName?.data?.player_name}
          <button
            className="text-sm text-black cursor-pointer"
            onClick={() =>
              setShowPlayerName((prev) => ({ ...prev, show: false }))
            }
          >
            <RxCross2 />
          </button>
        </div>
      </div>
      <div className="text-sm">Bidders</div>
      <div className="mt-2 flex flex-wrap gap-1">
        {profiles?.length ? (
          profiles?.map?.((profile, index) => {
            return (
              <button
                className="w-7 h-7 relative"
                key={index}
                onClick={() => setShowPlayerName({ show: true, data: profile })}
              >
                <CustomImage
                  src={
                    profile?.profile_image ? profile?.profile_image : tempImage
                  }
                  className="w-full h-full"
                  height={100}
                  width={100}
                  alt="profile image"
                  unoptimized={DYNAMIC_IMAGE_UNOPTIMISED}
                />
              </button>
            );
          })
        ) : (
          <div className="text-xs ">No Bidders found</div>
        )}
      </div>
    </section>
  );
};

export default PlayerIconSection;
