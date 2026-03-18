create table if not exists tech_solutions_requests (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  company text not null,
  interest text not null check (interest in ('farms', 'd2c', 'both')),
  description text not null,
  phone text,
  created_at timestamptz default now()
);

-- Enable RLS (rows inserted via service role, so no public access needed)
alter table tech_solutions_requests enable row level security;
