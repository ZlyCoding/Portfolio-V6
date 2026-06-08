# Portfolio V6

Modern portfolio website with an integrated admin dashboard built using Next.js and Supabase.

## Features

### Public

- Portfolio showcase
- About section
- Blog system
- Project gallery
- Responsive design

### Admin Panel

- Manage profile information
- Manage projects
- Manage blog posts
- Image upload management
- Authentication system
- Protected admin routes

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- Supabase
- PostgreSQL

---

## Installation

Clone repository:

```bash
git clone <repository-url>
cd portfolio-v6
```

Install dependencies:

```bash
npm install
```

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPBASE_SERVICE_KEY
```

---

## Database Setup

1. Create a new Supabase project.
2. Open **SQL Editor**.
3. Execute the provided schema file: [schema.sql](./schema.sql)
4. Wait until all tables, policies, functions, and storage buckets are created.

---

## Create Admin User

Register a new account through the application.

After registration, open **SQL Editor** and run:

```sql
update auth.users
set raw_app_meta_data =
  coalesce(raw_app_meta_data, '{}'::jsonb)
  || '{"role":"admin"}'::jsonb
where email = 'your-email@example.com';
```

> Make sure the query is executed using the **postgres (Superuser)** role.

Logout and login again after updating the role.

---

## Run Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## Production Build

Build the application:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

---

## Deployment

### Deploy to Vercel

1. Push the project to GitHub.
2. Import the repository into Vercel.
3. Configure the environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

4. Deploy the project.

After deployment, your application will be available at:

```text
https://your-project.vercel.app
```

### Important

Before using the application in production:

- Execute the database schema.
- Create an admin account.
- Assign the `admin` role to the account.
- Verify Supabase Storage buckets are created successfully.
- Configure a custom domain (optional).

---

## Project Structure

```text
src/
├── app/
│   ├── (public)/
│   ├── admin/
│   └── auth/
├── components/
├── lib/
└── middleware.ts
```

---

## Security

- Row Level Security (RLS)
- JWT-based admin authorization
- Protected storage buckets
- Admin-only CRUD operations

---

## License

MIT License
