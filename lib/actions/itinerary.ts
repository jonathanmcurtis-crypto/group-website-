"use server";
import { createSupabaseServerClient, getUser } from "../supabase/server";
export async function scheduleProposal(formData: FormData) { const user = await getUser(); if (!user) throw new Error("Sign in required"); await createSupabaseServerClient().from("itinerary_items").insert({ trip_id: String(formData.get("trip_id")), proposal_id: String(formData.get("proposal_id")), day: String(formData.get("day")), starts_at: String(formData.get("starts_at")), ends_at: String(formData.get("ends_at") || ""), notes: String(formData.get("notes") || ""), created_by: user.id }); }
