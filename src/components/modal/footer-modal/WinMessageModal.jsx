import FooterModal from './FooterModal';
import wonImage from '@/assets/images/won-image.png';
import CustomImage from '@/components/CustomImage';

const WinMessageModal = ({ show, closeModal, footerRef }) => {
  return (
    <FooterModal show={show} closeModal={closeModal} footerRef={footerRef}>
      <div className="w-3/4 h-32 mt-12 mx-auto">
        <CustomImage
          src={wonImage}
          className="w-full h-full object-contain"
          height={500}
          width={500}
          alt="logo"
        />
      </div>
      <div className="mt-4 text-center w-3/4 mx-auto">
        <h2 className="text-3xl font-extrabold"> Congratulations</h2>
        <p className="text-md mt-2">
          Fulfillment team will reach out to you on your telegram
        </p>
      </div>
    </FooterModal>
  );
};

export default WinMessageModal;
