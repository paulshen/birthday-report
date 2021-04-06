# Birthday.report

[Birthday.report](https://birthday.report) is a simple birthday tracker. Save and view a list of birthdays you need to remember.

## Development

This is a TypeScript React webapp using [Supabase](https://supabase.io/) as backend, [Tailwind CSS](https://tailwindcss.com/) for styling, and [Vite](https://vitejs.dev/) for build.

To run locally, copy `.env.sample` to `.env` and replace the values with your own.

```sh
# Install dependencies
yarn
# Run in development
yarn dev
# Build for production
yarn build
```

## Supabase setup

The Supabase (Postgres) database has one table `birthdays` (and `auth.users`). You can find the schema in `db.sql`.

Birthday.report supports accounts via Supabase's Google provider. Setup following Supabase's [Google Oauth instructions](https://supabase.io/docs/learn/auth-deep-dive/auth-google-oauth).
