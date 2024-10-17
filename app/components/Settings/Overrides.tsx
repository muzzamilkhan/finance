"use client";

import { numberFormat } from "../../utils";
import { DateTime } from "luxon";
import { Override } from "../../types";
import { get as getOverrides, remove as removeOverrides } from "../../api/overrides";
import { useEffect, useState } from "react";

export function Overrides() {
  const [data, setData] = useState<Override[]>([]);

  useEffect(() => {
    (async () => {
      getOverrides().then((o) => setData(o));
    })();
  }, []);

  return (
    <table>
      <thead>
        <tr>
          <th>Particulars</th>
          <th>Date</th>
          <th>Amount</th>
          <th>Actions</th>
        </tr>
      </thead>
      {data && (
        <tbody>
          {data.filter((item) => item.particular.type === "income").length >
            0 && (
            <tr>
              <td colSpan={4}>Income</td>
            </tr>
          )}
          {data
            .filter((item) => item.particular.type === "income")
            .map((item) => (
              <OverrideItem key={item.id} item={item}></OverrideItem>
            ))}

          {data.filter((item) => item.particular.type === "expense").length >
            0 && (
            <tr>
              <td colSpan={4}>Expense</td>
            </tr>
          )}
          {data
            .filter((item) => item.particular.type === "expense")
            .map((item) => (
              <OverrideItem key={item.id} item={item}></OverrideItem>
            ))}
        </tbody>
      )}
    </table>
  );
}

export function OverrideItem({ item }: { item: Override }) {
  const onRemove = (e: any) => {
    e.preventDefault();

    if (!confirm("Are you sure?")) return;

    removeOverrides(item.id);
  };

  return (
    <tr>
      <td>{item.particular.name}</td>
      <td className="date-col">
        {DateTime.fromSeconds(item.date).toFormat("LLL dd ccc")}
      </td>
      <td>{numberFormat(item.amount)}</td>
      <td className="action-col">
        <div className="action-controls">
          <button onClick={(e) => onRemove(e)}>Remove</button>
        </div>
      </td>
    </tr>
  );
}
