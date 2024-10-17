"use client";

import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { Expense, Income } from "../../types";
import { ItemAmount } from "./ItemAmount";
import { ItemDate } from "./ItemDate";
import { get, remove, update } from "../../api/items";

export function Particulars() {
  const [data, setData] = useState<Expense[] | Income[]>([]);

  useEffect(() => {
    (async () => {
      get().then((o) => setData(o));
    })();
  }, []);

  return (
    <table>
      <thead>
        <tr>
          <th>Particulars</th>
          <th>Frequency</th>
          <th>Amount</th>
          <th>Actions</th>
        </tr>
      </thead>
      {data && (
        <tbody>
          <tr>
            <td colSpan={5} className="center">
              Incomes
            </td>
          </tr>
          {data
            .filter((i) => i.type === "income")
            .sort((a, b) => b.amount - a.amount)
            .map((item) => (
              <ParticularsItem key={item.id} item={item}></ParticularsItem>
            ))}
          <tr>
            <td colSpan={5} className="center">
              Expenses
            </td>
          </tr>
          {data
            .filter((i) => i.type === "expense" && i.recurring === "month")
            .sort((a, b) => b.amount - a.amount)
            .map((item) => (
              <ParticularsItem key={item.id} item={item}></ParticularsItem>
            ))}
          {data
            .filter((i) => i.type === "expense" && i.recurring === "fortnight")
            .sort((a, b) => b.amount - a.amount)
            .map((item) => (
              <ParticularsItem key={item.id} item={item}></ParticularsItem>
            ))}
          {data
            .filter((i) => i.type === "expense" && i.recurring === "week")
            .sort((a, b) => b.amount - a.amount)
            .map((item) => (
              <ParticularsItem key={item.id} item={item}></ParticularsItem>
            ))}
          {data
            .filter((i) => i.type === "expense" && !i.recurring)
            .sort((a, b) => b.amount - a.amount)
            .map((item) => (
              <ParticularsItem key={item.id} item={item}></ParticularsItem>
            ))}
        </tbody>
      )}
    </table>
  );
}

export function ParticularsItem({ item }: { item: Expense | Income }) {
  const [editable, setEditable] = useState<boolean>(false);
  const [recurringInfo, setRecurringInfo] = useState<string>("");

  const dayNumber = DateTime.fromSeconds(item.date).toFormat("d");
  let suffix = "th";

  if (dayNumber.length > 1 && dayNumber.startsWith("1")) {
    suffix = "th";
  } else if (dayNumber.endsWith("1")) {
    suffix = "st";
  } else if (dayNumber.endsWith("2")) {
    suffix = "nd";
  } else if (dayNumber.endsWith("3")) {
    suffix = "rd";
  }

  useEffect(() => {
    switch (item.recurring) {
      case "month":
        setRecurringInfo(
          `Every ${DateTime.fromSeconds(item.date).toFormat("d")}${suffix}`,
        );
        break;
      case "fortnight":
        setRecurringInfo(
          `Every second ${DateTime.fromSeconds(item.date).toFormat("EEEE")}`,
        );
        break;
      case "week":
        setRecurringInfo(
          `Every ${DateTime.fromSeconds(item.date).toFormat("EEEE")}`,
        );
        break;
      default:
        setRecurringInfo(
          `Once on ${DateTime.fromSeconds(item.date).toFormat("LLL dd ccc")}`,
        );
        break;
    }
  }, [item.recurring, item.date, suffix]);

  const onRemove = (e: any) => {
    e.preventDefault();

    if (!confirm("Are you sure?")) return;

    remove(item.id);
  };

  const onToggleLock = (e: any) => {
    e.preventDefault();

    update(item.id, {
      ...item,
      locked: !item.locked,
    });
  };

  return (
    <tr>
      <td>{item.name}</td>
      <td>
        <ItemDate
          afterAdjust={() => setEditable(false)}
          item={item}
          editable={editable}
        >
          {recurringInfo}
        </ItemDate>
      </td>
      <td className="amount">
        <ItemAmount
          afterAdjust={() => setEditable(false)}
          item={item}
          editable={editable}
        ></ItemAmount>
      </td>
      <td className="action-col">
        <div className="action-controls">
          {!editable && <button onClick={() => setEditable(true)}>Edit</button>}
          {!editable && <button onClick={(e) => onRemove(e)}>Remove</button>}
          {!editable && (
            <button style={{ width: "60px" }} onClick={(e) => onToggleLock(e)}>
              {!item.locked ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path d="M 12 1 C 9.1277778 1 6.7189086 3.0461453 6.1230469 5.7871094 L 8.078125 6.2128906 C 8.4822632 4.3538547 10.072222 3 12 3 C 14.27619 3 16 4.7238095 16 7 L 16 8 L 6 8 C 4.9069372 8 4 8.9069372 4 10 L 4 20 C 4 21.093063 4.9069372 22 6 22 L 18 22 C 19.093063 22 20 21.093063 20 20 L 20 10 C 20 8.9069372 19.093063 8 18 8 L 18 7 C 18 3.6761905 15.32381 1 12 1 z M 6 10 L 18 10 L 18 20 L 6 20 L 6 10 z M 12 13 C 10.9 13 10 13.9 10 15 C 10 16.1 10.9 17 12 17 C 13.1 17 14 16.1 14 15 C 14 13.9 13.1 13 12 13 z"></path>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path d="M 12 1 C 8.6761905 1 6 3.6761905 6 7 L 6 8 C 5.4777778 8 4.9453899 8.1913289 4.5683594 8.5683594 C 4.1913289 8.9453899 4 9.4777778 4 10 L 4 20 C 4 20.522222 4.1913289 21.05461 4.5683594 21.431641 C 4.9453899 21.808671 5.4777778 22 6 22 L 18 22 C 18.522222 22 19.05461 21.808671 19.431641 21.431641 C 19.808671 21.05461 20 20.522222 20 20 L 20 10 C 20 9.4777778 19.808671 8.9453899 19.431641 8.5683594 C 19.05461 8.1913289 18.522222 8 18 8 L 18 7 C 18 3.6761905 15.32381 1 12 1 z M 12 3 C 14.27619 3 16 4.7238095 16 7 L 16 8 L 8 8 L 8 7 C 8 4.7238095 9.7238095 3 12 3 z M 6 10 L 18 10 L 18 20 L 6 20 L 6 10 z M 12 13 C 10.9 13 10 13.9 10 15 C 10 16.1 10.9 17 12 17 C 13.1 17 14 16.1 14 15 C 14 13.9 13.1 13 12 13 z"></path>
                </svg>
              )}
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
