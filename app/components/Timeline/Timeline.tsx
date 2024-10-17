"use client";

import { DateTime } from "luxon";
import { useState, useEffect } from "react";
import { get as useItems } from "../../api/items";
import { get as useOverrides } from "../../api/overrides";

import { Expense, Income, Override } from "../../types";
import { numberFormat, SECONDS_IN_DAY } from "../../utils";
import { Controls } from "./Controls";
import { Day } from "./Day";

type DailySummary = {
  expenses?: Expense[];
  incomes?: Income[];
  balance: number;
};

export type CsvDataInput = Array<{ date: string; balance: number }>;

export function Timeline() {
  const [data, setData] = useState([]);
  const [overrides, setOverrides] = useState([]);

  useEffect(() => {
    (async () => {
      await useItems().then((i) => setData(i));
      await useOverrides().then((o) => setOverrides(o));
    })();
  }, []);

  // State
  const [offsetStart, setOffsetStart] = useState(0);
  const [start, setStart] = useState(0);
  const [numberOfDays, setNumberOfDays] = useState(120);
  const [startBalance, setStartBalance] = useState(0);
  const [end, setEnd] = useState<number>(0);
  const [days, setDays] = useState<Map<number, DailySummary>>();
  const [lowest, setLowest] = useState<{
    amount: number | null;
    date: number | null;
  }>({
    amount: null,
    date: null,
  });
  const [localMinima, setLocalMinima] = useState<number[]>([]);

  const [highest, setHighest] = useState<{
    amount: number | null;
    date: number | null;
  }>({
    amount: null,
    date: null,
  });
  const [balanceData, setBalanceData] = useState<CsvDataInput>([]);

  useEffect(() => {
    setStart(
      DateTime.now().startOf("day").plus({ days: offsetStart }).toSeconds(),
    );
  }, [offsetStart]);

  useEffect(() => {
    setEnd(start + numberOfDays * SECONDS_IN_DAY);
  }, [start]);

  useEffect(() => {
    const newDays = new Map<number, DailySummary>();
    let balance = startBalance;

    const _balanceData = [];

    let _lowest = {
      amount: null,
      date: null,
    };
    let _highest = {
      amount: null,
      date: null,
    };

    let _localMinima: number[] = [];
    let _last = {
      amount: null,
      date: null,
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
        currentDate,
      );

      //Daily totals
      const sumAmount = (acc: number, curr: { amount: number }) => {
        return acc + curr.amount;
      };
      const incomeTotal = incomes.reduce(sumAmount, 0);
      const expenseTotal = expenses.reduce(sumAmount, 0);
      balance += incomeTotal - expenseTotal;

      if (_last.amount != null && balance > _last.amount) {
        _localMinima.push(_last.date);
      }

      if (balance != _last.amount && expenses.length > 0) {
        _last = { amount: balance, date: currentDate };
      }

      newDays.set(currentDate, { expenses, incomes, balance });
      // Accumlate totals for CSV data
      _balanceData.push({
        date: DateTime.fromSeconds(currentDate).toISODate(),
        balance: numberFormat(balance),
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

    setDays(newDays);
    setLowest(_lowest);
    setHighest(_highest);
    setBalanceData(_balanceData);
    setLocalMinima(_localMinima);
  }, [start, end, data, overrides, startBalance]);

  return (
    <div>
      <Controls
        startBalance={startBalance}
        numberOfDays={numberOfDays}
        lowest={lowest}
        highest={highest}
        setStartBalance={setStartBalance}
        setNumberOfDays={setNumberOfDays}
        balanceData={balanceData}
        setEnd={setEnd}
        setOffsetStart={setOffsetStart}
        offsetStart={offsetStart}
        start={start}
      ></Controls>
      <table>
        <thead>
          <tr>
            <th className="date-col">Date</th>
            <th>Income</th>
            <th>Expense</th>
            <th className="balance">Balance</th>
            <th className="action-col">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={3}>Starting balance</td>
            <td className="balance">{numberFormat(startBalance)}</td>
            <td className="action-col">&nbsp;</td>
          </tr>
          {days &&
            Array.from(days.keys()).map((curr) => (
              <Day
                previousEmpty={
                  days.has(curr - SECONDS_IN_DAY) &&
                  days.get(curr - SECONDS_IN_DAY).expenses.length === 0 &&
                  days.get(curr - SECONDS_IN_DAY).incomes.length === 0
                }
                lowest={lowest.date === curr}
                localMinima={localMinima.includes(curr)}
                highest={highest.date === curr}
                key={curr}
                date={curr}
                expenses={days.get(curr).expenses}
                incomes={days.get(curr).incomes}
                balance={days.get(curr).balance}
              ></Day>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export const getOccurance = (
  items: Array<Expense | Income>,
  overrides: Override[],
  ofDateSeconds: number,
) => {
  const expenseOccurances = new Map<string, Expense>();
  const incomeOccurances = new Map<string, Income>();
  const ofDateTime = DateTime.fromSeconds(ofDateSeconds);
  const ofISODate = ofDateTime.toISODate();

  // Exclude future date particulars
  const _items = items.filter((i) => i.date <= ofDateSeconds);
  const _overrides = overrides.filter((i) => i.date <= ofDateSeconds);

  const setOccurance = (i: Expense | Income) => {
    if (i.type === "expense") {
      expenseOccurances.set(`${ofISODate}-${i.name}`, i);
    } else {
      incomeOccurances.set(`${ofISODate}-${i.name}`, i);
    }
  };

  _items
    .filter(
      (i) =>
        i.recurring === "month" &&
        DateTime.fromSeconds(i.date).day === ofDateTime.day,
    )
    .forEach(setOccurance);

  _items
    .filter(
      (i) =>
        i.recurring === "fortnight" &&
        Math.floor(DateTime.fromSeconds(i.date).diff(ofDateTime).as("days")) %
          14 ===
          0,
    )
    .forEach(setOccurance);

  _items
    .filter(
      (i) =>
        i.recurring === "week" &&
        DateTime.fromSeconds(i.date).weekday === ofDateTime.weekday,
    )
    .forEach(setOccurance);

  _items
    .filter(
      (i) =>
        !i.recurring && DateTime.fromSeconds(i.date).hasSame(ofDateTime, "day"),
    )
    .forEach(setOccurance);

  _overrides
    .filter((i) => DateTime.fromSeconds(i.date).hasSame(ofDateTime, "day"))
    .map((i) => ({
      ...i.particular,
      amount: i.amount,
    }))
    .forEach(setOccurance);

  return {
    expenses: Array.from(expenseOccurances.values()),
    incomes: Array.from(incomeOccurances.values()),
  };
};
