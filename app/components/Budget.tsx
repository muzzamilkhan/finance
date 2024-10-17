'use client';

import { useEffect, useState } from 'react';
import { Expense, Income } from '../types';
import { currencyFormat, numberFormat } from '../utils';
import { get as getItems } from "../api/items";

type MonthlyItem = {
  id: number;
  name: string;
  amount: number;
};

const WEEK_TO_MONTH_MULTIPLIER = 52 / 12;
const FORTNIGHT_TO_MONTH_MULTIPLIER = 26 / 12;

export function Budget() {
  const [data, setData] = useState<Expense[] | Income[]>([]);

  useEffect(() => {
    (async () => {
      getItems().then((i) => setData(i));
    })();
  }, []);

  const [monthlyIncome, setMonthlyIncome] = useState<MonthlyItem[]>([]);
  const [monthlyExpenses, setMonthlyExpenses] = useState<MonthlyItem[]>([]);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [totalBudget, setTotalBudget] = useState<number>(0);
  const [maxExpense, setMaxExpense] = useState<number>(0);

  useEffect(() => {
    if (!data) return;

    const recurringExpenses = data.filter(
      (i) => i.type === 'expense' && i.recurring
    );
    const recurringIncome = data.filter(
      (i) => i.type === 'income' && i.recurring
    );

    const mapToMonthlyItems = (
      items: Array<Income | Expense>
    ): MonthlyItem[] => {
      return items
        .map((i) => {
          switch (i.recurring) {
            case 'month':
              return i;
            case 'fortnight':
              return {
                ...i,
                amount: i.amount * FORTNIGHT_TO_MONTH_MULTIPLIER,
              };
            case 'week':
              return {
                ...i,
                amount: i.amount * WEEK_TO_MONTH_MULTIPLIER,
              };
          }
        })
        .filter(i => !!i)
        .sort((a, b) => {
          return b.amount - a.amount;
        });
    };

    const _monthlyExpenses = mapToMonthlyItems(recurringExpenses);
    const _monthlyIncome = mapToMonthlyItems(recurringIncome);
    setMonthlyExpenses(_monthlyExpenses);
    setMonthlyIncome(_monthlyIncome);

    let _maxExpense = 0;
    _monthlyExpenses.forEach((e) => {
      if (e.amount > _maxExpense) _maxExpense = e.amount;
    });

    setMaxExpense(_maxExpense);

    const _totalExpenses = _monthlyExpenses.reduce((acc, curr) => {
      return acc + curr.amount;
    }, 0);
    const _totalIncome = _monthlyIncome.reduce((acc, curr) => {
      return acc + curr.amount;
    }, 0);
    setTotalExpenses(_totalExpenses);
    setTotalIncome(_totalIncome);

    const _totalBudget = _totalIncome - _totalExpenses;
    setTotalBudget(_totalBudget);
  }, [data]);

  return (
    <>
      <h1>Montly Budget</h1>
      <table>
        <thead>
          <tr>
            <th>Particulars</th>
            <th>Income</th>
            <th>Expense</th>
            <th>Total</th>
          </tr>
          {monthlyIncome.length !== 0 &&
            monthlyIncome.map((i) => (
              <tr key={i.id}>
                <td>{i.name}</td>
                <td align="right">{numberFormat(i.amount)}</td>
                <td colSpan={2}></td>
              </tr>
            ))}
          <tr>
            <td colSpan={3}></td>
            <td align="right">{numberFormat(totalIncome)}</td>
          </tr>
          {monthlyExpenses.length !== 0 &&
            monthlyExpenses.map((i) => {
              const percentage = Math.round((i.amount / maxExpense) * 100);
              return (
                <tr key={i.id}>
                  <td>{i.name}</td>
                  <td></td>
                  <td
                    style={{
                      background: `linear-gradient(to right, red 0%, white ${percentage}%)`,
                      backgroundRepeat: 'no-repeat',
                    }}
                    align="right"
                  >
                    {numberFormat(i.amount)}
                  </td>
                  <td></td>
                </tr>
              );
            })}
          <tr>
            <td colSpan={3}></td>
            <td align="right">{numberFormat(totalExpenses)}</td>
          </tr>
          <tr>
            <td>
              <strong>Net Total</strong>
            </td>
            <td colSpan={2}></td>
            <td align="right">
              <strong>{currencyFormat(totalBudget)}</strong>
            </td>
          </tr>
        </thead>
      </table>
    </>
  );
}
