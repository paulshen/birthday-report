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

let client: SupabaseClient | undefined;
function getSupabaseClient() {
  if (client === undefined) {
    client = createClient(
      import.meta.env.VITE_APP_SUPABASE_URL,
      import.meta.env.VITE_APP_SUPABASE_ANON_KEY
    );
    useUser.setState({
      user: client.auth.user() ?? undefined,
    });
  }
  return client;
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
    throw new Error(response.error.message);
  }
  return entryFromResponse(response.data[0]);
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
      user_id: session.user.id,
      id: entry.id,
      name: entry.name,
      month: entry.month,
      date: entry.date,
      year: entry.year,
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
      // @ts-ignore
      id: entryId,
    });
  if (response.error !== null) {
    throw new Error(response.error.message);
  }
}
