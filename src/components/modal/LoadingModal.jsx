import ModalWrapper from './ModalWrapper';

const LoadingModal = ({ show, setShowWinnerModal }) => {
  /**
   * @description this function will close the modal but close btn will show only when error is message will show
   * */
  const closeHandler = () => {
    if (show?.error) setShowWinnerModal({ loading: false, error: false });
  };
  return (
    <ModalWrapper
      show={show?.loading || show?.error}
      className={'!h-60'}
      closeHandler={closeHandler}
      hideCloseBtn
    >
      <div className="flex items-center justify-center flex-col w-full h-full">
        {show?.loading ? (
          <>
            <div className="new-loader"></div>
            <h3 className="text-center text-2xl font-bold">
              Fetching winner please wait...
            </h3>
          </>
        ) : null}
        {show?.error ? (
          <>
            <h3 className="text-center text-sm font-bold">
              We have encountered an issue with data loading.
            </h3>
            <p className="text-center text-sm font-bold">
              Please wait while we fix it.
            </p>
            <p className="text-center text-sm font-bold">
              Thank you for your patience!
            </p>
          </>
        ) : null}
      </div>
    </ModalWrapper>
  );
};

export default LoadingModal;
