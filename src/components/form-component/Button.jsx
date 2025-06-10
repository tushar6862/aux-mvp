import React from 'react';
import AnimatedElementWrapper from './AnimatedElementWrapper';
import ButtonLoading from './ButtonLoading';

const BtnBorderClass =
  'border-2 border-[#49ffe9a6] hover:border-pink-400 active:border-pink-400 outline-none focus-visible:border-pink-400 focus:border-pink-400 disabled:hover:border-[#49ffe9a6]';

/**
 * Button component that supports customizable styling, loading state, and animation.
 *
 * @param {string} title - The title attribute for the button.
 * @param {string} id - The id attribute for the button.
 * @param {React.ReactNode} children - Content inside the button, e.g., text or icons.
 * @param {string} type - The button type, e.g., "button", "submit", etc. Defaults to "button".
 * @param {boolean} disabled - Flag to disable the button. Defaults to `false`.
 * @param {boolean} loading - Flag to indicate if the button is in a loading state. Defaults to `false`.
 * @param {function} onClick - Callback function for button click events. Defaults to an empty function.
 * @param {string} className - Additional CSS classes to style the button.
 * @param {boolean} showAnimatedBtn - Flag to show an animated border around the button. Defaults to `false`.
 *
 * @returns {JSX.Element} The rendered button component.
 */

const Button = ({
  title = '',
  id = '',
  children = '',
  type = 'button',
  disabled = false,
  loading = false,
  onClick = () => {},
  className = '',
  showAnimatedBorder = false,
}) => {
  return (
    <AnimatedElementWrapper showAnimatedBorder={showAnimatedBorder}>
      <button
        id={id}
        className={`text-white transition-all  duration-300 ease-in-out cursor-pointer bg-[#190C3D] rounded-full  bg-box-shadow  text-sm font-bold   py-2  disabled:bg-[#413A56] active:bg-[#413A56] disabled:cursor-not-allowed  relative ${
          !showAnimatedBorder ? BtnBorderClass : ''
        } ${className}`}
        title={title}
        onClick={onClick}
        disabled={disabled || loading}
        type={type}
      >
        {!loading ? children : <ButtonLoading />}
      </button>
    </AnimatedElementWrapper>
  );
};

export default Button;
