'use client';

import { currencyFormat, SECONDS_IN_DAY } from '../../utils';
import { DateTime } from 'luxon';
import { useEffect } from 'react';
import { CsvDownload } from './CsvDownload';
import { CsvDataInput } from './Timeline';

const LOCAL_BALANCE_KEY = 'FF-BALANCE';
const LOCAL_OFFSET_START_KEY = 'FF-OFFSET-START';

export function Controls({
  startBalance,
  numberOfDays,
  lowest,
  highest,
  setStartBalance,
  setNumberOfDays,
  balanceData,
  start,
  setEnd,
  offsetStart,
  setOffsetStart,
}: {
  startBalance: number;
  numberOfDays: number;
  lowest: {
    amount: number;
    date: number;
  };
  highest: {
    amount: number;
    date: number;
  };
  setStartBalance: (n: number) => any;
  setNumberOfDays: (n: number) => any;
  setEnd: (n: number) => any;
  balanceData: CsvDataInput;
  start: number;
  offsetStart: number;
  setOffsetStart: (n: number) => any;
}) {
  useEffect(() => {
    const _bal = JSON.parse(localStorage.getItem(LOCAL_BALANCE_KEY) || '');
    if (_bal && !isNaN(parseFloat(_bal))) {
      setStartBalance(parseFloat(_bal));
    }

    const _offsetStart = JSON.parse(
      localStorage.getItem(LOCAL_OFFSET_START_KEY) || ''
    );
    if (!isNaN(parseInt(_offsetStart))) {
      setOffsetStart(parseInt(_offsetStart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_BALANCE_KEY, String(startBalance));
  }, [startBalance]);

  useEffect(() => {
    localStorage.setItem(LOCAL_OFFSET_START_KEY, String(offsetStart));
  }, [offsetStart]);

  useEffect(() => {
    setEnd(start + numberOfDays * SECONDS_IN_DAY);
  }, [start, numberOfDays]);

  return (
    <div className="controls">
      <div className="control-inputs">
        <div>
          <label>Starting balance</label>
          <input
            type="number"
            value={startBalance === 0 ? '' : startBalance}
            onChange={(e) =>
              setStartBalance(
                parseFloat(
                  isNaN(parseInt(e.target.value)) ? '0' : e.target.value
                )
              )
            }
          />
        </div>
        <div>
          <label>Days</label>
          <input
            type="number"
            value={numberOfDays === 0 ? '' : numberOfDays}
            onChange={(e) =>
              setNumberOfDays(
                parseInt(isNaN(parseInt(e.target.value)) ? '0' : e.target.value)
              )
            }
          />
        </div>
        <div>
          <label>Skip Today</label>
          <input
            type="checkbox"
            checked={offsetStart === 0 ? false : true}
            onChange={(e) => {
              setOffsetStart((e.target as any).checked ? 1 : 0);
            }}
          />
        </div>
      </div>
      <div className="control-info">
        {lowest.amount && lowest.date && (
          <div>
            <label>
              <strong>
                Lowest: {currencyFormat(lowest.amount)} on{' '}
                {DateTime.fromSeconds(lowest.date).toFormat('LLL dd')}
              </strong>
            </label>
          </div>
        )}
        {highest.amount && highest.date && (
          <div>
            <label>
              <strong>
                Highest: {currencyFormat(highest.amount)} on{' '}
                {DateTime.fromSeconds(highest.date).toFormat('LLL dd')}
              </strong>
            </label>
          </div>
        )}
        <div>
          <CsvDownload data={balanceData}></CsvDownload>
        </div>
      </div>
    </div>
  );
}
