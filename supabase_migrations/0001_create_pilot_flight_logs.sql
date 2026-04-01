create table if not exists pilot_flight_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  date timestamptz not null,
  aircraft_type text,
  registration text,
  route text,
  category text,
  hours numeric,
  remarks text,
  created_at timestamptz not null default now()
);

create index if not exists idx_pilot_flight_logs_user_id on pilot_flight_logs(user_id);
create policy "Allow users to read their logs" on pilot_flight_logs for select using (auth.uid() = user_id);
create policy "Allow users to manage their logs" on pilot_flight_logs for insert, update, delete with check (auth.uid() = user_id);
