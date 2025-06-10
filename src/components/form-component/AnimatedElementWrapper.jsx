/**
 * AnimatedElementWrapper component that conditionally wraps the buttons and input with an animated border.
 *
 * @param {React.ReactNode} children - The button element to be wrapped.
 * @param {boolean} showAnimatedBorder - Flag to determine whether to show the animated border.
 *
 * @returns {JSX.Element} The button with or without an animated border.
 */
const AnimatedElementWrapper = ({ children, showAnimatedBorder }) => {
  if (showAnimatedBorder)
    return (
      <div className="animated-border-custom-gradient p-[2px] rounded-full bg-box-shadow ">
        {children}
      </div>
    );
  return children;
};

export default AnimatedElementWrapper;
