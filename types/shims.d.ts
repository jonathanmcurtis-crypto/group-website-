declare module "next" { export type Metadata = Record<string, unknown>; }
declare module "next/headers" { export function cookies(): { get(name:string): {value:string}|undefined; set(...args:any[]): void; delete(...args:any[]): void }; }
declare module "next/navigation" { export function redirect(path:string): never; export function notFound(): never; }
declare module "next/link" { const Link: any; export default Link; }
declare module "@supabase/ssr" { export function createBrowserClient(url:string,key:string): any; export function createServerClient(url:string,key:string,opts:any): any; }
declare module "@supabase/supabase-js" { export function createClient(url:string,key:string,opts?:any): any; }
declare module "@googlemaps/js-api-loader" { export class Loader { constructor(opts:any); load(): Promise<any>; } }
declare namespace JSX { interface IntrinsicElements { [elemName: string]: any } }
declare namespace React { type ReactNode = any; }
declare module "*.css" { const content: any; export default content; }
declare module "tailwindcss" { export type Config = any; }
declare var process: { env: Record<string, string | undefined> };
declare namespace JSX { interface IntrinsicAttributes { key?: any } }
declare module "react" { export function useEffect(cb: any, deps?: any[]): void; export function useRef<T>(value: T | null): { current: T | null }; export function useState<T>(value: T): [T, (value: T) => void]; }
declare var document: any; declare var window: any;
interface HTMLInputElement { value: string; }
interface HTMLDivElement {}
