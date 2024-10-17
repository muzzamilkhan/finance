'use client';

import { CSVLink } from 'react-csv';
import { CsvDataInput } from './Timeline';

export function CsvDownload({ data }: { data: CsvDataInput }) {
  if (data.length === 0) return <></>;

  const csvData = [Object.keys(data[0]), ...data.map((d) => Object.values(d))];

  return <CSVLink data={csvData}>Download Balances</CSVLink>;
}
