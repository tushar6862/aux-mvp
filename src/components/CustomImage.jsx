import Image from 'next/image';
import React from 'react';

/**
 * CustomImage component renders an optimized image using Next.js Image component.
 * It automatically prepends the API endpoint to the provided image path and ensures
 * that the image is only rendered if the `src` is provided.
 *
 * @param {Object} props - The properties object.
 * @param {string} props.src - The relative path to the image file provided by the backend (e.g., 'assets/imagepath').
 * @param {string} props.alt - Alternative text for the image, used for accessibility and SEO purposes.
 * @param {number} props.width - The width of the image (in pixels).
 * @param {number} props.height - The height of the image (in pixels).
 * @param {string} [props.className] - Optional CSS class names to apply custom styles to the image.
 *
 * @returns {JSX.Element|null} Returns a Next.js Image component if `src` is provided, otherwise returns div with same className.
 *
 * @note
 * The image `src` path is prefixed with the API endpoint from environment variables (`NEXT_PUBLIC_API_ENDPOINT`).
 * Ensure that the `NEXT_PUBLIC_API_ENDPOINT` is correctly set in the `.env` file.
 *
 */

const CustomImage = ({
  path,
  src,
  alt,
  width,
  height,
  className,
  unoptimized = false,
}) => {
  if (src || path)
    return (
      <Image
        src={path ? process.env.NEXT_PUBLIC_API_ENDPOINT + '/' + path : src}
        alt={alt}
        height={height}
        width={width}
        className={className}
        unoptimized={unoptimized}
      />
    );
  return <div className={className} />;
};

export default CustomImage;
