'use client';
import { setClipboard } from '@/utils/helpers/utils.helper';
import React, { useEffect, useState } from 'react';
import { AiFillCopy } from 'react-icons/ai';

const TableDataBox = ({ title, value, copiedValue }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let timeout;
    if (copied) {
      timeout = setTimeout(() => {
        setCopied(false);
      }, 600);
    }
    return () => timeout && clearTimeout(timeout);
  }, [copied]);
  return (
    <div className="w-1/2 text-xs border border-[#8F8F8F] p-2 text-center relative">
      <h4 className="text-[#9E63FF] font-bold ">{title}</h4>
      <button
        type="button"
        className="group flex item-center w-full  justify-center gap-1 cursor-pointer disabled:cursor-default"
        onClick={() => {
          setCopied(true);
          setClipboard(copiedValue);
        }}
        disabled={!copiedValue}
      >
        <div className="max-w-40 text-xs overflow-hidden">{value}</div>
        <AiFillCopy className={` ${copiedValue ? 'text-sm' : 'hidden'}`} />
      </button>

      <div
        className={`absolute top-0 left-0 w-full flex items-center justify-center  transition-all duration-300 ease-in-out ${copied ? '-translate-y-6 opacity-100 z-10' : 'opacity-0 -z-10'}`}
      >
        <div className="bg-white w-fit text-center rounded-lg text-xs text-black py-1 px-2">
          Copied
        </div>
      </div>
    </div>
  );
};

export default TableDataBox;
