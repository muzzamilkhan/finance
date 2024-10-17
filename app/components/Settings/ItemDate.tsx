'use client';

import { DateTime } from 'luxon';
import { useState } from 'react';
import { update as updateItem } from '../../api/items';

export function ItemDate({ editable, afterAdjust, item, children }: any) {
  const [date, setDate] = useState<string>('');

  const onSave = (e: any) => {
    e.preventDefault();

    if (date.trim() === '') return;

    const dateTime = DateTime.fromISO(date).toSeconds();
    if (item.type === 'expense') {
      updateItem(item.id, {
        ...item,
        date: dateTime,
      });
    } else {
      updateItem(item.id, {
        ...item,
        date: dateTime,
      });
    }

    afterAdjust();
  };

  return (
    <>
      {!editable && children}
      {editable && (
        <div className="adjust-field">
          <form>
            <input
              type="date"
              value={
                date.trim() != ''
                  ? date
                  : DateTime.fromSeconds(item.date).toFormat('yyyy-LL-dd')
              }
              onChange={(e) => setDate(e.target.value)}
            />
            <button onClick={(e) => onSave(e)} type="submit">
              Save
            </button>
          </form>
        </div>
      )}
    </>
  );
}
