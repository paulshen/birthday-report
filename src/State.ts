import { createClient, SupabaseClient, User } from "@supabase/supabase-js";
import create from "zustand";
import { Entry } from "./Types";
import { definitions } from "./types/supabase";

export const useUser = create<{ user: User | undefined }>((_set) => ({
  user: undefined,
}));
export const useEntries = create<{ entries: Entry[] | undefined }>((_set) => ({
  entries: undefined,
}));

useUser.subscribe(async (state) => {
  if (state.user !== undefined) {
    const entries = await fetchEntries();
    useEntries.setState({ entries });
  }
});

let client: SupabaseClient | undefined;
function getSupabaseClient() {
  if (client === undefined) {
    client = createClient(
      import.meta.env.VITE_APP_SUPABASE_URL,
      import.meta.env.VITE_APP_SUPABASE_ANON_KEY
    );
    client.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && useUser.getState().user !== undefined) {
        // onload, supabase will fire this after session is already set
        // https://github.com/supabase/gotrue-js/blob/5690b208ee6f0fa5cf0cf55f5251a10a2bfe5e03/src/GoTrueClient.ts#L472
        return;
      }
      useUser.setState({
        user: session === null ? undefined : session.user,
      });
    });
    useUser.setState({
      user: client.auth.user() ?? undefined,
    });
  }
  return client;
}

export function initializeSupabase() {
  getSupabaseClient();
}

export function login() {
  const client = getSupabaseClient();
  client.auth.signIn(
    {
      provider: "google",
    },
    {
      redirectTo: `http://localhost:3000?login_entries=${btoa(
        JSON.stringify(useEntries.getState().entries)
      )}`,
    }
  );
}

export function logout() {
  const client = getSupabaseClient();
  client.auth.signOut();
  useUser.setState({ user: undefined });
  useEntries.setState({ entries: [] });
}

function entryFromResponse(data: definitions["birthdays"]): Entry {
  return {
    id: data.id,
    name: data.name,
    month: data.month,
    date: data.date,
    year: data.year,
  };
}

export async function fetchEntries(): Promise<Entry[]> {
  const client = getSupabaseClient();
  const session = client.auth.session();
  if (session === null) {
    throw new Error("not logged in");
  }
  const response = await client
    .from<definitions["birthdays"]>("birthdays")
    .select("*");
  if (response.error !== null) {
    throw new Error(response.error.message);
  }
  return response.data.map(entryFromResponse);
}

export async function insertSupabaseEntry(entry: Entry): Promise<Entry> {
  const client = getSupabaseClient();
  const session = client.auth.session();
  if (session === null) {
    throw new Error("not logged in");
  }
  const response = await client
    .from<definitions["birthdays"]>("birthdays")
    .insert({
      user_id: session.user.id,
      id: entry.id,
      name: entry.name,
      month: entry.month,
      date: entry.date,
      year: entry.year,
    });
  if (response.error !== null) {
    // TODO: handle PK conflict
    throw new Error(response.error.message);
  }
  return entryFromResponse(response.data[0]);
}

export async function insertSupabaseEntries(
  entries: Entry[]
): Promise<Entry[]> {
  const client = getSupabaseClient();
  const session = client.auth.session();
  if (session === null) {
    throw new Error("not logged in");
  }
  const response = await client
    .from<definitions["birthdays"]>("birthdays")
    .insert(
      entries.map((entry) => ({
        user_id: session.user.id,
        id: entry.id,
        name: entry.name,
        month: entry.month,
        date: entry.date,
        year: entry.year,
      }))
    );
  if (response.error !== null) {
    // TODO: handle PK conflict
    throw new Error(response.error.message);
  }
  return response.data.map(entryFromResponse);
}

export async function updateSupabaseEntry(entry: Entry): Promise<Entry> {
  const client = getSupabaseClient();
  const session = client.auth.session();
  if (session === null) {
    throw new Error("not logged in");
  }
  const response = await client
    .from<definitions["birthdays"]>("birthdays")
    .update({
      name: entry.name,
      month: entry.month,
      date: entry.date,
      year: entry.year,
    })
    .match({
      user_id: session.user.id,
      id: `${entry.id}`,
    });
  if (response.error !== null) {
    throw new Error(response.error.message);
  }
  return entryFromResponse(response.data[0]);
}

export async function deleteSupabaseEntry(entryId: number): Promise<void> {
  const client = getSupabaseClient();
  const session = client.auth.session();
  if (session === null) {
    throw new Error("not logged in");
  }
  const response = await client
    .from<definitions["birthdays"]>("birthdays")
    .delete()
    .match({
      user_id: session.user.id,
      id: `${entryId}`,
    });
  if (response.error !== null) {
    throw new Error(response.error.message);
  }
}
