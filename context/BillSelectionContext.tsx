import React, { createContext, useCallback, useContext, useMemo, useReducer } from 'react';

export type BillSource = 'assessment' | 'booth' | 'misc' | 'compound';

export interface SelectableBill {
  id: string | number;
  bill_no: string;
  amount: number;
  due_date: string;
  description?: string;
  source: BillSource;
  meta?: { item_type?: string; account_no?: string; compound_no?: string; raw?: any };
}

interface State {
  bills: Record<string, SelectableBill>; // key = source|id|bill_no
  order: string[]; // maintain insertion order
}

const initialState: State = { bills: {}, order: [] };

type Action =
  | { type: 'ADD'; bill: SelectableBill }
  | { type: 'REMOVE'; key: string }
  | { type: 'CLEAR' };

const makeKey = (b: { source: BillSource; id: string | number; bill_no: string }) => `${b.source}|${b.id}|${b.bill_no || ''}`;

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD': {
      const key = makeKey(action.bill);
      if (state.bills[key]) return state; // dedupe
      return {
        bills: { ...state.bills, [key]: action.bill },
        order: [...state.order, key],
      };
    }
    case 'REMOVE': {
      if (!state.bills[action.key]) return state;
      const { [action.key]: _, ...rest } = state.bills;
      return { bills: rest, order: state.order.filter(k => k !== action.key) };
    }
    case 'CLEAR':
      return initialState;
    default:
      return state;
  }
}

interface CtxValue {
  bills: SelectableBill[];
  total: number;
  count: number;
  add: (bill: SelectableBill) => void;
  remove: (bill: SelectableBill) => void;
  clear: () => void;
  has: (bill: SelectableBill) => boolean;
}

const BillSelectionContext = createContext<CtxValue | undefined>(undefined);

export const BillSelectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const bills = useMemo(() => state.order.map(k => state.bills[k]), [state]);
  const total = useMemo(() => bills.reduce((s, b) => s + (Number(b.amount) || 0), 0), [bills]);
  const count = bills.length;

  const add = useCallback((bill: SelectableBill) => {
    if (bill.amount <= 0) return; // skip zero amount
    dispatch({ type: 'ADD', bill });
  }, []);
  const remove = useCallback((bill: SelectableBill) => {
    dispatch({ type: 'REMOVE', key: makeKey(bill) });
  }, []);
  const clear = useCallback(() => dispatch({ type: 'CLEAR' }), []);
  const has = useCallback((bill: SelectableBill) => !!state.bills[makeKey(bill)], [state]);

  const value: CtxValue = { bills, total, count, add, remove, clear, has };
  return <BillSelectionContext.Provider value={value}>{children}</BillSelectionContext.Provider>;
};

export const useBillSelection = () => {
  const ctx = useContext(BillSelectionContext);
  if (!ctx) throw new Error('useBillSelection must be used within BillSelectionProvider');
  return ctx;
};
