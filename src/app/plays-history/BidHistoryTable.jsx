import ButtonLoading from '@/components/form-component/ButtonLoading';
import {
  NoRecordMessage,
  Table,
  TableCell,
  TableRow,
} from '@/components/Table/CustomTable';
import { playsTransferState } from '@/redux/playsTransfer/reducer.playsTransfer';
import { userState } from '@/redux/user/reducer.user';
import React from 'react';
import { useSelector } from 'react-redux';

const BidHistoryTable = () => {
  const { transactionHistoryLoader, playsTransactionHistory } =
    useSelector(playsTransferState);
  const { userInfo } = useSelector(userState);
  return (
    <>
      <Table>
        <TableRow isHeader>
          <TableCell isHeader className="min-w-24">
            Date
          </TableCell>
          <TableCell isHeader className="min-w-24">
            PLAYs
          </TableCell>
          <TableCell isHeader>Remark</TableCell>
        </TableRow>

        {playsTransactionHistory?.map((history, index) => (
          <TableRow key={index}>
            <TableCell>
              {history?.created_at ? history?.created_at.split('T')?.[0] : ''}
            </TableCell>
            <TableCell className="text-green-400">{history?.plays}</TableCell>
            <TableCell>{history?.spend_on}</TableCell>
          </TableRow>
        ))}

        {transactionHistoryLoader && playsTransactionHistory?.length ? (
          <div className="w-full !flex justify-center items-center">
            <ButtonLoading />
          </div>
        ) : null}
      </Table>
      <NoRecordMessage
        show={!transactionHistoryLoader && playsTransactionHistory?.length <= 0}
      >
        {userInfo?.accessToken ? 'No Data Found' : <ButtonLoading />}
      </NoRecordMessage>
    </>
  );
};

export default BidHistoryTable;
