export type SplitInput = { paidBy: string; amountCents: number; splits: { userId: string; amountCents: number }[] };
export type Payment = { from: string; to: string; amountCents: number };
export function calculateSettlements(expenses: SplitInput[]): Payment[] {
  const balances = new Map<string, number>();
  for (const expense of expenses) { balances.set(expense.paidBy, (balances.get(expense.paidBy) ?? 0) + expense.amountCents); for (const split of expense.splits) balances.set(split.userId, (balances.get(split.userId) ?? 0) - split.amountCents); }
  const debtors = [...balances].filter(([,v]) => v < 0).map(([id,v]) => ({ id, amount: -v })).sort((a,b)=>b.amount-a.amount);
  const creditors = [...balances].filter(([,v]) => v > 0).map(([id,v]) => ({ id, amount: v })).sort((a,b)=>b.amount-a.amount);
  const payments: Payment[] = []; let i = 0, j = 0;
  while (i < debtors.length && j < creditors.length) { const amount = Math.min(debtors[i].amount, creditors[j].amount); if (amount > 0) payments.push({ from: debtors[i].id, to: creditors[j].id, amountCents: amount }); debtors[i].amount -= amount; creditors[j].amount -= amount; if (debtors[i].amount === 0) i++; if (creditors[j].amount === 0) j++; }
  return payments;
}
