export const Table = ({ children, className = '' }) => (
  <div
    className={`table w-full text-center font-semibold text-sm ${className}`}
  >
    {children}
  </div>
);

export const TableRow = ({ isHeader, children, className = '' }) => (
  <div
    className={`table-row my-[2px] ${isHeader ? 'text-[#B57FEC] sticky top-0 bg-[#190C3D]' : ''} ${className} `}
  >
    {children}
  </div>
);

export const TableCell = ({ isHeader, children, className = '' }) => (
  <div
    className={`table-cell p-[2px] min-w-24 px-2 ${isHeader ? 'border border-[#B57FEC]' : ''} ${className}`}
  >
    {children}
  </div>
);

export const NoRecordMessage = ({ children, show }) => {
  if (show) {
    return (
      <div className="font-semibold w-full mt-10 text-center ">
        <div className="bg-[#190C3D] px-3 py-1 rounded-md border border-[#8F8F8F] w-fit mx-auto">
          {children}
        </div>
      </div>
    );
  }
};
