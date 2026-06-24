import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { env } from "../env";
export function createSupabaseServerClient() {
  const cookieStore = cookies();
  return createServerClient(env.supabaseUrl, env.supabaseAnonKey, { cookies: { get: (name: string) => cookieStore.get(name)?.value, set: (name: string, value: string, options: any) => cookieStore.set(name, value, options), remove: (name: string, options: any) => cookieStore.set(name, "", options) } });
}
export async function getUser() { const supabase = createSupabaseServerClient(); const { data } = await supabase.auth.getUser(); return data.user; }
