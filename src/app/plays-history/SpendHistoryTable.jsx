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

const SpendHistoryTable = () => {
  const { transactionHistoryLoader, playsTransactionHistory } =
    useSelector(playsTransferState);

  const { userInfo } = useSelector(userState);
  return (
    <>
      <Table>
        <TableRow isHeader>
          <TableCell isHeader>Auction House</TableCell>
          <TableCell isHeader>Auction Name</TableCell>
          <TableCell isHeader>PLAYs</TableCell>
        </TableRow>

        {playsTransactionHistory?.map((history, index) => (
          <TableRow key={index}>
            <TableCell>{history.auction_house_name}</TableCell>
            <TableCell>{history.auction_name}</TableCell>
            <TableCell className="text-red-500">{history.plays}</TableCell>
          </TableRow>
        ))}
      </Table>
      {transactionHistoryLoader && playsTransactionHistory?.length ? (
        <div className="w-full !flex justify-center items-center">
          <ButtonLoading />
        </div>
      ) : null}
      <NoRecordMessage
        show={!transactionHistoryLoader && playsTransactionHistory?.length <= 0}
      >
        {userInfo?.accessToken ? 'No Data Found' : <ButtonLoading />}
      </NoRecordMessage>
    </>
  );
};

export default SpendHistoryTable;
