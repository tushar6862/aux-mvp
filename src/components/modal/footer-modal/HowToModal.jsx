import { YOUTUBE_EMBEDDED } from '@/utils/constant/constant.helper';
import FooterModal from './FooterModal';

const HowToModal = ({ show, closeModal, footerRef }) => {
  return (
    <FooterModal show={show} closeModal={closeModal} footerRef={footerRef}>
      <div className="mt-4 text-center w-3/4 mx-auto">
        <h2 className="text-xl font-extrabold">
          Learn How to Play Highest Unique Auction
        </h2>
        <p className="mt-4 w-full aspect-video mx-auto bg-black">
          {show ? (
            <iframe
              src={YOUTUBE_EMBEDDED.HOW_TO.SRC}
              title={YOUTUBE_EMBEDDED.HOW_TO.TITLE}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen={false}
              loading="lazy"
              className="w-full h-full"
            ></iframe>
          ) : null}
        </p>
      </div>
    </FooterModal>
  );
};

export default HowToModal;
