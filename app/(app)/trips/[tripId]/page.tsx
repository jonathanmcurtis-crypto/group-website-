import { notFound, redirect } from "next/navigation";
import { AppNav } from "../../../../components/app-nav";
import { ExpenseForm } from "../../../../components/expense-form";
import { ExpenseLedger } from "../../../../components/expense-ledger";
import { ItineraryTimeline } from "../../../../components/itinerary-timeline";
import { MemberInviteForm } from "../../../../components/member-invite-form";
import { ProposalForm } from "../../../../components/proposal-form";
import { ProposalList } from "../../../../components/proposal-list";
import { TripMap } from "../../../../components/trip-map";
import { calculateSettlements, type SplitInput } from "../../../../lib/settlement";
import { createSupabaseServerClient, getUser } from "../../../../lib/supabase/server";
import type { Expense, ExpenseSplit, ItineraryItem, Proposal, Trip } from "../../../../lib/types";

export default async function TripPage({ params }: { params: { tripId: string } }) {
  const user = await getUser(); if (!user) redirect("/login");
  const supabase = createSupabaseServerClient();
  const [{ data: trip }, { data: members }, { data: proposalsRaw }, { data: votes }, { data: itineraryRaw }, { data: expenses }, { data: splits }] = await Promise.all([
    supabase.from("trips").select("*").eq("id", params.tripId).single(),
    supabase.from("trip_members").select("user_id, role, profiles(email)").eq("trip_id", params.tripId),
    supabase.from("proposals").select("*").eq("trip_id", params.tripId).order("created_at", { ascending: false }),
    supabase.from("votes").select("proposal_id,value"),
    supabase.from("itinerary_items").select("*, proposals(title,lat,lng)").eq("trip_id", params.tripId).order("day").order("starts_at"),
    supabase.from("expenses").select("*").eq("trip_id", params.tripId).order("spent_at", { ascending: false }),
    supabase.from("expense_splits").select("*, expenses!inner(trip_id)").eq("expenses.trip_id", params.tripId),
  ]);
  if (!trip) notFound();
  const voteTotals = new Map<string, number>();
  (votes ?? []).forEach((vote: { proposal_id: string; value: number }) => voteTotals.set(vote.proposal_id, (voteTotals.get(vote.proposal_id) ?? 0) + vote.value));
  const proposals = ((proposalsRaw ?? []) as Proposal[]).map((p) => ({ ...p, vote_score: voteTotals.get(p.id) ?? 0 })).sort((a,b) => (b.vote_score ?? 0) - (a.vote_score ?? 0));
  const itinerary = (itineraryRaw ?? []).map((item: any) => ({ ...item, title: item.proposals?.title, lat: item.proposals?.lat, lng: item.proposals?.lng })) as ItineraryItem[];
  const expenseInputs: SplitInput[] = ((expenses ?? []) as Expense[]).map((expense) => ({ paidBy: expense.paid_by, amountCents: expense.amount_cents, splits: ((splits ?? []) as ExpenseSplit[]).filter((split) => split.expense_id === expense.id).map((split) => ({ userId: split.user_id, amountCents: split.amount_cents })) }));
  const payments = calculateSettlements(expenseInputs);
  const memberIds = (members ?? []).map((member: { user_id: string }) => member.user_id);
  return <><AppNav email={user.email}/><main className="mx-auto max-w-7xl space-y-6 p-6"><section className="rounded-3xl bg-gradient-to-r from-wayfare to-lagoon p-8 text-white"><p className="font-semibold uppercase tracking-wide">{(trip as Trip).destination}</p><h1 className="text-4xl font-black">{(trip as Trip).name}</h1><p>{(trip as Trip).start_date} → {(trip as Trip).end_date}</p></section><div className="grid gap-6 lg:grid-cols-[320px_1fr]"><aside className="space-y-6"><MemberInviteForm tripId={params.tripId}/><ProposalForm tripId={params.tripId}/><ExpenseForm tripId={params.tripId} memberIds={memberIds}/></aside><section className="space-y-6"><TripMap points={itinerary.filter((i) => i.lat && i.lng).map((i) => ({ title: i.title ?? "Stop", lat: Number(i.lat), lng: Number(i.lng) }))}/><div className="grid gap-6 xl:grid-cols-2"><div><h2 className="mb-3 text-2xl font-black">Proposals</h2><ProposalList tripId={params.tripId} proposals={proposals}/></div><div><h2 className="mb-3 text-2xl font-black">Itinerary</h2><ItineraryTimeline items={itinerary}/></div></div><ExpenseLedger expenses={(expenses ?? []) as Expense[]} payments={payments}/></section></div></main></>;
}
