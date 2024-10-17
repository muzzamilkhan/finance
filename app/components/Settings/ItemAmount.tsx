'use client';

import { useState } from 'react';
import { Expense, Income } from '../../types';
import { numberFormat } from '../../utils';
import { create as createOverride } from '../../api/overrides';
import { update as updateItem } from '../../api/items';

export function ItemAmount({
  editable,
  afterAdjust,
  item,
  overrideDate,
}: {
  editable: boolean;
  afterAdjust: () => any;
  item: Expense | Income;
  overrideDate?: number;
}) {
  const [amount, setAmount] = useState<string>(numberFormat(item.amount));

  const onSave = (e: any) => {
    e.preventDefault();

    let newAmount = 0;

    if (amount.trim() !== '' && isNaN(parseFloat(amount))) {
      setAmount(numberFormat(item.amount));
      return;
    }

    if (amount.trim() !== '') {
      newAmount = parseFloat(amount.trim());
    }

    if (overrideDate) {
      createOverride({
        particular_id: item.id,
        amount: newAmount,
        date: overrideDate,
      });
    } else {
      updateItem(item.id, {
        ...item,
        amount: newAmount,
      });
    }

    afterAdjust();
  };

  return (
    <>
      {!editable && `${numberFormat(item.amount)}`}
      {editable && (
        <div className="adjust-field">
          <form onSubmit={(e) => onSave(e)}>
            <input value={amount} onChange={(e) => setAmount(e.target.value)} />
          </form>
        </div>
      )}
    </>
  );
}
