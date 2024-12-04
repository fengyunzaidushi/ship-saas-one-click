-- Create characters table
create table if not exists characters (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text not null,
  review text not null,
  gender text,
  background text,
  surname_type text,
  traits text,
  additional_info text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table characters enable row level security;

-- Create a policy that allows all operations
create policy "Allow all operations" on characters
  for all
  using (true)
  with check (true);

-- Create updated_at trigger function
create or replace function handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create trigger for updated_at
create trigger set_updated_at
  before update on characters
  for each row
  execute procedure handle_updated_at();

-- Create index for faster queries
create index if not exists characters_created_at_idx on characters(created_at desc); 