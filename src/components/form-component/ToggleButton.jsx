import React from 'react';

const ToggleButton = ({ id, name, value, onClick, children }) => {
  return (
    <div className="relative inline-flex items-center gap-2 select-none">
      <div className="w-11 h-5">
        <input
          id={id}
          type="checkbox"
          name={name}
          checked={value}
          onClick={onClick}
          className="peer appearance-none w-full h-full bg-slate-100 rounded-full checked:bg-fuchsia-600 cursor-pointer transition-colors duration-300"
        />

        <label
          htmlFor={id}
          className="absolute top-0 left-0 h-5 w-5 cursor-pointer rounded-full border border-fuchsia-400 bg-fuchsia-700 shadow-sm transition-all duration-300 before:absolute before:top-2/4 before:left-2/4 before:block before:h-10 before:w-10 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-fuchsia-500 before:opacity-0 before:transition-opacity hover:before:opacity-10 peer-checked:translate-x-6 peer-checked:border-fuchsia-300 peer-checked:bg-white"
        >
          <div
            className="top-2/4 left-2/4 inline-block -translate-x-2/4 -translate-y-2/4 rounded-full p-5"
            data-ripple-dark="true"
          ></div>
        </label>
      </div>
      <label htmlFor={id}>{children}</label>
    </div>
  );
};

export default ToggleButton;
