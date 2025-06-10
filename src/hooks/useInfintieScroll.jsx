import { useEffect, useRef } from 'react';

const useInfintieScroll = (
  totalPage = 0,
  currentPage = 0,
  fetchApiCB,
  condition = true,
) => {
  const cardRef = useRef();
  /**
   * @description this method scroll to top
   * */
  const moveToTop = () =>
    cardRef?.current?.scrollTo({ top: 0, behavior: 'smooth' });
  const handleScroll = () => {
    const container = cardRef.current;
    if (container) {
      const scrollHeight = container?.scrollHeight;
      const scrollTop = container?.scrollTop;
      // We multiply the clientHeight by 1.1 to give a bit of a buffer before reaching the bottom
      const clientHeight = container?.clientHeight * 1.1;
      if (scrollHeight - scrollTop <= clientHeight && totalPage > currentPage) {
        fetchApiCB?.();
      }
    }
  };
  useEffect(() => {
    if (cardRef.current && condition) {
      cardRef.current.addEventListener('scroll', handleScroll);
    }

    return () => {
      cardRef?.current?.removeEventListener?.('scroll', handleScroll);
    };
  }, [currentPage, totalPage, condition]);

  return { cardRef, moveToTop };
};

export default useInfintieScroll;
