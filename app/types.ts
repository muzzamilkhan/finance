export type Recurring = 'week' | 'fortnight' | 'month';

type Particulars<T> = {
  id: number;
  type: T;
  name: string;
  amount: number;
  recurring?: Recurring;
  date: number;
  locked?: boolean;
};

export type Expense = Particulars<'expense'>;
export type Income = Particulars<'income'>;

export type Override = {
  id: number;
  particular: Expense | Income;
  particular_id: number;
  amount: number;
  date: number;
};
