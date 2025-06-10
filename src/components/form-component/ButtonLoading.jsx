import React from 'react';

/**
 * ButtonLoading component to show a loading spinner inside the button.
 *
 * @returns {JSX.Element} The loading spinner and "Loading..." text.
 */
const ButtonLoading = () => {
  return (
    <div className="w-full flex gap-2 items-center justify-center">
      <div className="inline-block text-white min-h-4  h-full  aspect-square w-auto animate-spin rounded-full border-2 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite]" />
      Loading...
    </div>
  );
};

export default ButtonLoading;
