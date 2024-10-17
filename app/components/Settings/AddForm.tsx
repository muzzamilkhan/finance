'use client';

import { DateTime } from 'luxon';
import { useState } from 'react';
import { Recurring } from '../../types';
import { create } from '../../api/items';

export function AddForm({ type }: { type: 'income' | 'expense' }) {
  const [name, setName] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [recurring, setRecurring] = useState<string>('');
  const [amount, setAmount] = useState<string>('');

  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (
      !name ||
      name.trim().length === 0 ||
      !date ||
      !amount ||
      isNaN(parseFloat(amount))
    )
      return;

    const dateTime = DateTime.fromISO(date).toSeconds();
    if (type === 'expense') {
      create({
        name,
        amount: parseFloat(amount),
        date: dateTime,
        recurring: recurring as Recurring,
        type: 'expense',
      });
    } else {
      create({
        name,
        amount: parseFloat(amount),
        date: dateTime,
        recurring: recurring as Recurring,
        type: 'income',
      });
    }
    handleClear();
  };

  const handleClear = (e?: any) => {
    if (e) e.preventDefault();

    setName('');
    setDate('');
    setRecurring('');
    setAmount('');
  };

  return (
    <div className="form-container">
      <form>
        <h3>Add {type === 'expense' ? 'Expense' : 'Income'}</h3>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></input>
        </div>
        <div>
          <label>Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          ></input>
        </div>
        <div>
          <label>Recurring:</label>
          <select
            value={recurring}
            onChange={(e) => setRecurring(e.target.value)}
          >
            <option value={undefined}>None</option>
            <option value={'week'}>Week</option>
            <option value={'fortnight'}>Fortnight</option>
            <option value={'month'}>Month</option>
          </select>
        </div>
        <div>
          <label>Amount:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          ></input>
        </div>
        <div className="actions">
          <button onClick={handleSubmit}>Add</button>
          <button onClick={handleClear}>Clear</button>
        </div>
      </form>
    </div>
  );
}
