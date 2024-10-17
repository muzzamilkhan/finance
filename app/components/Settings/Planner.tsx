'use client';

import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';
import { Controls } from '../Timeline/Controls';
import { getOccurance } from '../Timeline/Timeline';
import { numberFormat, SECONDS_IN_DAY } from '../../utils';
import { createTrend } from 'trendline';
import { get as getItems } from "../../api/items";
import { get as getOverrides } from "../../api/overrides";
import { Expense, Income, Override } from '@/app/types';

export default function Planner() {
  const [data, setData] = useState<Expense[] | Income[]>([]);
  const [overrides, setOverrides] = useState<Override[]>([]);

  useEffect(() => {
    (async () => {
      getItems().then((i) => setData(i));
      getOverrides().then((o) => setOverrides(o));
    })();
  }, []);

  // State
  const [offsetStart, setOffsetStart] = useState(0);
  const [start, setStart] = useState(0);
  const [numberOfDays, setNumberOfDays] = useState(365);
  const [startBalance, setStartBalance] = useState(0);
  const [end, setEnd] = useState<number>(0);
  const [lowest, setLowest] = useState<{ amount: number; date: number }>({
    amount: 0,
    date: 0,
  });
  const [highest, setHighest] = useState<{ amount: number; date: number }>({
    amount: 0,
    date: 0,
  });
  const [trend, setTrend] = useState<number>(0);
  const [trendState, setTrendState] = useState<'ok' | 'problem'>('ok');

  useEffect(() => {
    setStart(
      DateTime.now().startOf('day').plus({ days: offsetStart }).toSeconds()
    );
  }, [offsetStart]);

  useEffect(() => {
    setEnd(start + numberOfDays * SECONDS_IN_DAY);
  }, [start]);

  useEffect(() => {
    let balance = startBalance;

    const _balanceData = [];

    let _lowest = {
      amount: 0,
      date: 0,
    };
    let _highest = {
      amount: 0,
      date: 0,
    };

    //Loop days
    for (
      let currentDate = start;
      currentDate < end;
      currentDate += SECONDS_IN_DAY
    ) {
      // loop particulars
      const { incomes, expenses } = getOccurance(
        data || [],
        overrides || [],
        currentDate
      );

      //Daily totals
      const sumAmount = (acc: number, curr: { amount: number }) => {
        return acc + curr.amount;
      };
      const incomeTotal = incomes.reduce(sumAmount, 0);
      const expenseTotal = expenses.reduce(sumAmount, 0);
      balance += incomeTotal - expenseTotal;

      // Accumlate totals for CSV data
      _balanceData.push({
        seconds: Math.floor(
          DateTime.fromSeconds(currentDate).diffNow('days').days
        ),
        balance: balance,
      });

      // Capture extremes
      if (_lowest.amount === null || balance < _lowest.amount) {
        _lowest = {
          amount: balance,
          date: currentDate,
        };
      }
      if (_highest.amount === null || balance > _highest.amount) {
        _highest = {
          amount: balance,
          date: currentDate,
        };
      }
    }

    const _trend = createTrend(_balanceData, 'seconds', 'balance');
    setTrend(_trend.slope);

    setLowest(_lowest);
    setHighest(_highest);
    setTrendState(
      _lowest.amount < 0 || _highest.amount < 0 || trend < 0 ? 'problem' : 'ok'
    );
  }, [start, end, data, overrides, startBalance]);

  return (
    <>
      <div className="planner">
        <h1>Planner</h1>
        <div className="planner-container">
          <Controls
            startBalance={startBalance}
            numberOfDays={numberOfDays}
            lowest={{ amount: 0, date: 0 }}
            highest={{ amount: 0, date: 0 }}
            setStartBalance={setStartBalance}
            setNumberOfDays={setNumberOfDays}
            balanceData={[]}
            setEnd={setEnd}
            setOffsetStart={setOffsetStart}
            offsetStart={offsetStart}
            start={start}
          ></Controls>
          <div className={`${trendState} trend`}>
            <div className="slope">
              <span>{trend.toFixed(2)}</span>
            </div>
            <div className="limits">
              <div className="min">
                <span className="amount">{numberFormat(lowest.amount)}</span>
                <span className="date">
                  {DateTime.fromSeconds(lowest.date || 0).toISODate()}
                </span>
              </div>
              <div className="max">
                <span className="amount">{numberFormat(highest.amount)}</span>
                <span className="date">
                  {DateTime.fromSeconds(highest.date || 0).toISODate()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
