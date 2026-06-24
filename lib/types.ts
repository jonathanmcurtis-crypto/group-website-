export type Trip = { id: string; name: string; destination: string; start_date: string; end_date: string; created_by: string };
export type Member = { trip_id: string; user_id: string; role: "owner" | "member"; email?: string };
export type Proposal = { id: string; trip_id: string; title: string; notes: string | null; google_place_id: string; lat: number; lng: number; address: string | null; proposed_by: string; vote_score?: number };
export type ItineraryItem = { id: string; trip_id: string; proposal_id: string; day: string; starts_at: string; ends_at: string | null; title?: string; lat?: number; lng?: number };
export type Expense = { id: string; trip_id: string; paid_by: string; description: string; amount_cents: number; spent_at: string };
export type ExpenseSplit = { id: string; expense_id: string; user_id: string; amount_cents: number };
