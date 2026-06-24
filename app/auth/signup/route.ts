import { redirect } from "next/navigation"; import { createSupabaseServerClient } from "../../../lib/supabase/server";
export async function POST(request: Request) { const form = await request.formData(); const supabase = createSupabaseServerClient(); await supabase.auth.signUp({ email: String(form.get("email")), password: String(form.get("password")) }); redirect("/dashboard"); }
