import React, { useEffect, useState, useRef } from 'react';
import Button from '../form-component/Button';
import { useDispatch, useSelector } from 'react-redux';
import { MODAL_KEYS, setModal } from '@/redux/modal/action.modal';
import {
  getAvatarListAction,
  uploadAvatarAction,
} from '@/redux/user/action.user';
import CustomImage from '../CustomImage';
import ButtonLoading from '../form-component/ButtonLoading';
import { DYNAMIC_IMAGE_UNOPTIMISED } from '@/utils/constant/constant.helper';

const AvatarList = ({ selectAvatar, modelClose = {} }) => {
  const { avatarList, userInfo, formLoader } = useSelector(
    (state) => state.user,
  );
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [error, setError] = useState('');
  const [uploadingCustomImage, setUploadingCustomImage] = useState(false);
  const [customImageFile, setCustomImageFile] = useState(null);
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const clickHandler = () => {
    if (customImageFile) {
      dispatch(
        uploadAvatarAction(customImageFile, (response) => {
          if (response.success || response.status === 'success') {
            const avatarUrl =
              response.url ||
              response.data?.url ||
              response.avatar ||
              response.image_url ||
              response.file_url ||
              response.path ||
              response.data?.avatar ||
              response.data?.image_url ||
              response.data?.path ||
              response.result?.url ||
              response.result?.path;
            if (avatarUrl) {
              selectAvatar(avatarUrl);
              setSelectedAvatar(avatarUrl);
              setCustomImageFile(null);
              setError('');
            } else {
              setError('No avatar URL received from server');
            }
            setCustomImageFile(null);
          } else {
            setError(response.message || response.error || 'Upload failed');
          }
        }),
      );
    } else if (selectedAvatar) {
      selectAvatar(selectedAvatar);
      setSelectedAvatar('');
    } else {
      setError('Please select an avatar first');
    }
  };

  const uploadCustomImage = async (file) => {
    try {
      setUploadingCustomImage(true);
      setError('');
      const formData = new FormData();
      formData.append('media', file, 'file');
      // Replace this URL with your actual upload endpoint
      const response = await fetch('/api/upload-avatar', {
        method: 'POST',
        body: formData,
        headers: {
          // Add any required headers like authorization
          // 'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();

      // Assuming the API returns the uploaded image URL in result.url or result.data.url
      const uploadedImageUrl = result.url || result.data?.url;

      if (uploadedImageUrl) {
        setSelectedAvatar(uploadedImageUrl);
        selectAvatar(uploadedImageUrl);
      } else {
        throw new Error('No image URL returned from server');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setError('Failed to upload image. Please try again.');
    } finally {
      setUploadingCustomImage(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        setError('Image size must be less than 1MB');
        return;
      }

      // Store the file for potential upload
      setCustomImageFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target.result;
        setSelectedAvatar(imageData);
        setError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCustomImageSelect = () => {
    if (customImageFile) {
      uploadCustomImage(customImageFile);
    } else if (selectedAvatar && selectedAvatar.startsWith('data:image')) {
      // If somehow we have base64 data without file, show error
      setError('Please select a new image to upload');
    } else {
      // Regular avatar selection
      selectAvatar(selectedAvatar);
      setSelectedAvatar('');
    }
  };

  const removeCustomImage = () => {
    selectAvatar('');
    setSelectedAvatar('');
    setCustomImageFile(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    modelClose();
  };

  useEffect(() => {
    dispatch(getAvatarListAction());
  }, []);
  return (
    <div className="w-full  h-full flex flex-col justify-center items-center gap-3 py-10">
      <h2 className="text-center font-bold text-2xl ">Profile Avatar</h2>
      <div className="flex flex-wrap items-center justify-center gap-2 w-4/5 mx-auto overflow-auto relative">
        {avatarList?.length ? (
          <div className="grid grid-cols-4 gap-3 sm:gap-4 mb-6">
            {avatarList.map((avatar, index) => (
              <div
                key={index}
                className={`border-2 ${selectedAvatar === avatar ? 'border-pink-400' : 'border-[#49ffe9a6]'}  rounded-full w-10 h-10 bg-transparent overflow-hidden hover:border-pink-400 ${userInfo?.avatar === avatar ? '!border-gray-400 grayscale cursor-not-allowed' : 'cursor-pointer'}`}
                onClick={() => {
                  if (userInfo?.avatar !== avatar) {
                    setSelectedAvatar(avatar);
                    setCustomImageFile(null); // Clear file
                    if (fileInputRef.current) {
                      fileInputRef.current.value = ''; // Clear input field name
                    }
                  }
                }}
              >
                <CustomImage
                  path={avatar}
                  alt="Avatar"
                  className="w-full h-full"
                  height={500}
                  width={500}
                  unoptimized={DYNAMIC_IMAGE_UNOPTIMISED}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center w-full min-h-[160px]">
            <p className="text-center text-gray-500 text-lg font-medium">
              No Avatar Found
            </p>
          </div>
        )}
        <div className="w-3/4 flex flex-col items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full cursor-pointer"
            disabled={formLoader}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {selectedAvatar && selectedAvatar.startsWith('data:image') && (
            <div className="relative">
              <div className="border-2 border-pink-400 rounded-full w-16 h-16 overflow-hidden">
                <img
                  src={selectedAvatar}
                  alt="Custom Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                onClick={removeCustomImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                disabled={formLoader}
              >
                ×
              </button>
            </div>
          )}
        </div>
      </div>
      <Button
        className="capitalize w-3/4 mx-auto min-w-20"
        type="button"
        onClick={clickHandler}
        loading={formLoader}
        disabled={formLoader || (!selectedAvatar && !customImageFile)}
      >
        {customImageFile ? 'Upload & Select' : 'Select'}
      </Button>
    </div>
  );
};

export default AvatarList;
