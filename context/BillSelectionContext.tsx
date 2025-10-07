import React, { createContext, useCallback, useContext, useMemo, useReducer, useEffect, useRef } from 'react';

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

// Generate a stable composite key. When bill_no is missing, include a lightweight fingerprint
// so two different blank-number bills with same id but different amount/date don't collide.
const makeKey = (b: { source: BillSource; id: string | number; bill_no: string; amount?: number; due_date?: string; description?: string }) => {
  const core = `${b.source}|${b.id}`;
  if (b.bill_no) return `${core}|${b.bill_no}`;
  // Fallback fingerprint: amount + due_date + first 12 chars of description (if any)
  const amt = b.amount != null ? Number(b.amount) : '';
  const due = b.due_date || '';
  const descFrag = (b.description || '').slice(0, 12).replace(/\s+/g, '_');
  return `${core}|_blank_${amt}_${due}_${descFrag}`;
};

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
  /** Attempt to add a bill; returns true if added, false if duplicate or invalid */
  add: (bill: SelectableBill) => boolean;
  remove: (bill: SelectableBill) => void;
  clear: () => void;
  has: (bill: SelectableBill) => boolean;
  /** Alias for has() to make intent explicit in UI components */
  isDuplicate: (bill: SelectableBill) => boolean;
}

const BillSelectionContext = createContext<CtxValue | undefined>(undefined);

const STORAGE_KEY = 'ixora_selected_bills_v1';

export const BillSelectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const hydratedRef = useRef(false);

  // Rehydrate from storage (client-only) once
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { bills?: SelectableBill[] };
        if (parsed?.bills && Array.isArray(parsed.bills)) {
          parsed.bills.forEach(b => dispatch({ type: 'ADD', bill: b }));
        }
      }
    } catch {/* ignore */}
    hydratedRef.current = true;
  }, []);

  const bills = useMemo(() => state.order.map(k => state.bills[k]), [state]);
  const total = useMemo(() => bills.reduce((s, b) => s + (Number(b.amount) || 0), 0), [bills]);
  const count = bills.length;

  const add = useCallback((bill: SelectableBill) => {
    if (bill.amount <= 0) return false; // skip zero amount
    const key = makeKey(bill);
    if (state.bills[key]) return false; // duplicate
    dispatch({ type: 'ADD', bill });
    return true;
  }, [state.bills]);
  const remove = useCallback((bill: SelectableBill) => {
    dispatch({ type: 'REMOVE', key: makeKey(bill) });
  }, []);
  const clear = useCallback(() => dispatch({ type: 'CLEAR' }), []);
  const has = useCallback((bill: SelectableBill) => !!state.bills[makeKey(bill)], [state]);
  const isDuplicate = has;

  // Persist after hydration whenever bill list changes
  useEffect(() => {
    if (!hydratedRef.current) return;
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ bills }));
    } catch {/* ignore */}
  }, [bills]);

  const value: CtxValue = { bills, total, count, add, remove, clear, has, isDuplicate };
  return <BillSelectionContext.Provider value={value}>{children}</BillSelectionContext.Provider>;
};

export const useBillSelection = () => {
  const ctx = useContext(BillSelectionContext);
  if (!ctx) throw new Error('useBillSelection must be used within BillSelectionProvider');
  return ctx;
};
