// TODO Review pending after reveiw remove todo
import { useRef } from 'react';

const testValidInput = (value) => /^[0-9]$/.test(value);

const OtpInput = ({ className, inputNumber, onChange, otp, setOTP }) => {
  const inputRefs = useRef([]);
  const handleInputChange = (event, index) => {
    if (event.nativeEvent.data && !testValidInput(event.nativeEvent.data))
      inputRefs.current[index].blur();

    const newOTP = [...otp];
    const newValue = event.nativeEvent.data;
    if (testValidInput(newValue)) {
      newOTP[index] = newValue;
      setOTP(newOTP);
      onChange(newOTP.join(''));
      if (index < inputNumber - 1) inputRefs.current[index + 1].focus();
      else inputRefs.current[index].blur();
    }
  };

  const handleInputKeyDown = (event, index) => {
    if (
      event.key === '.' ||
      event.key === '+' ||
      event.key === '-' ||
      event.key === 'e'
    ) {
      event.preventDefault();
      return false;
    }
    if (event.key === 'ArrowLeft') {
      if (index) inputRefs.current[index - 1].focus();
      // else inputRefs.current[index].blur();
    }
    if (event.key === 'ArrowRight') {
      if (index !== inputNumber - 1) inputRefs.current[index + 1].focus();
      // else inputRefs.current[index].blur();
    }
    if (event.key === 'Backspace' || event.key === 'Delete') {
      const newOTP = [...otp];
      newOTP[index] = '';
      setOTP(newOTP);

      if (index > 0) inputRefs.current[index - 1].focus();
      // else inputRefs.current[index].blur();
      onChange(newOTP.join(''));
    }
  };

  const handlePaste = (event, index) => {
    const pasteData = event.clipboardData.getData('text/plain');

    if (/^\d+$/.test(pasteData)) {
      const newOTP = pasteData.split('');
      if (newOTP.length < inputNumber)
        for (let i = 0; i < inputNumber - pasteData.split('').length; i++)
          newOTP.push('');

      setOTP(newOTP);
      onChange(newOTP.join(''));
      if (pasteData.length >= inputNumber) inputRefs.current[0].blur();
      else inputRefs.current[pasteData.length].focus();
    } else inputRefs.current[index].blur();
  };

  const renderInputs = (inputNumber) => {
    const inputs = [];

    for (let i = 0; i < inputNumber; i++) {
      inputs.push(
        <input
          key={i}
          ref={(ref) => (inputRefs.current[i] = ref)}
          type="number"
          maxLength={1}
          className="w-[35px] h-[30px] py-0 px-2 rounded border-2 border-[#49ffe9a6] hover:border-pink-400 focus:border-pink-400 outline-none text-xl m-0 bg-[#190C3D]"
          value={otp[i]}
          onChange={(event) => handleInputChange(event, i)}
          onKeyDown={(event) => handleInputKeyDown(event, i)}
          onWheel={(e) => e.target.blur()}
          onPaste={(event) => handlePaste(event, i)}
        />,
      );
    }

    return inputs;
  };
  return (
    <div className={`flex gap-2 justify-center items-center ${className}`}>
      {renderInputs(inputNumber)}
    </div>
  );
};

export default OtpInput;
