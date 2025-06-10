'use client';
import { shortenString } from '@/utils/helpers/utils.helper';
import TableDataBox from './TableDataBox';

const TableData = ({
  referralCode,
  walletAddress,
  playerId,
  walletBallance,
}) => {
  return (
    <>
      <div className="flex w-full font-semibold">
        <TableDataBox
          title="Wallet Address"
          value={shortenString(walletAddress || '-')}
          copiedValue={walletAddress}
        />
        <TableDataBox
          title={'PLAYs'}
          value={walletBallance || 0}
          copiedValue={walletBallance}
        />
      </div>
      <div className="flex w-full font-semibold">
        <TableDataBox
          title="Referral Code"
          value={referralCode || '-'}
          copiedValue={referralCode}
        />
        <TableDataBox
          title={'Player ID'}
          value={shortenString(playerId || '-')}
          copiedValue={playerId}
        />
      </div>
    </>
  );
};

export default TableData;
