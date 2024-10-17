'use client';

import { Expense, Income } from '../../types';
import { numberFormat } from '../../utils';
import { DateTime } from 'luxon';
import { useState } from 'react';
import { ItemAmount } from '../Settings/ItemAmount';

export function Day({
  date,
  expenses,
  incomes,
  balance,
  lowest,
  localMinima,
  highest,
  previousEmpty,
}: {
  date: number;
  expenses: Expense[];
  incomes: Income[];
  balance: number;
  lowest: boolean;
  localMinima: boolean;
  highest: boolean;
  previousEmpty: boolean;
}) {
  const [editable, setEditable] = useState<boolean>(false);

  if (expenses.length === 0 && incomes.length === 0) {
    if (previousEmpty) return <></>;
    return (
      <tr>
        <td colSpan={3}>...</td>
        <td className="balance">{numberFormat(balance)}</td>
        <td className="action-col">&nbsp;</td>
      </tr>
    );
  }

  return (
    <tr
      className={`
      ${highest ? 'highest' : ''}
      ${lowest ? 'lowest' : ''}
      ${localMinima ? 'localMinima' : ''}
      ${balance <= 0 ? 'danger' : ''}
    `.trim()}
    >
      <td className="date-col">
        {DateTime.fromSeconds(date).toFormat('LLL dd ccc')}
      </td>

      <td className="particular-cell">
        <div className="particular-list">
          {incomes
            .sort((a, b) => b.amount - a.amount)
            .map((i) => (
              <div className="particular-item" key={`${i.name}-${i.date}`}>
                <div className="particular-field">{`${i.name} `}</div>
                <div className="particular-field">
                  <ItemAmount
                    afterAdjust={() => setEditable(false)}
                    item={i}
                    editable={editable}
                    overrideDate={date}
                  ></ItemAmount>
                </div>
              </div>
            ))}
        </div>
      </td>
      <td className="particular-cell">
        <div className="particular-list">
          {expenses
            .sort((a, b) => b.amount - a.amount)
            .map((i) => (
              <div className="particular-item" key={`${i.name}-${i.date}`}>
                <div className="particular-field">{`${i.name} `}</div>
                <div className="particular-field">
                  <ItemAmount
                    afterAdjust={() => setEditable(false)}
                    item={i}
                    editable={editable}
                    overrideDate={date}
                  ></ItemAmount>
                </div>
              </div>
            ))}
        </div>
      </td>
      <td className="balance">{numberFormat(balance)}</td>
      <td className="action-col">
        <div className="action-controls">
          {!editable && <button onClick={() => setEditable(true)}>...</button>}
          {editable && (
            <button onClick={() => setEditable(false)}>Cancel</button>
          )}
        </div>
      </td>
    </tr>
  );
}
