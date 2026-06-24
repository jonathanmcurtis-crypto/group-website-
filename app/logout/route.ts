import { redirect } from "next/navigation"; import { createSupabaseServerClient } from "../../lib/supabase/server";
export async function POST() { await createSupabaseServerClient().auth.signOut(); redirect("/login"); }
