-- Belghamdi Coaching — initial schema
-- Supabase / PostgreSQL

create extension if not exists "pgcrypto";

-- ============================================================
--  1. profiles (extends auth.users)
-- ============================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  role text not null default 'client' check (role in ('client', 'coach', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
--  2. leads
-- ============================================================
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  lead_code text unique,
  full_name text not null,
  email text not null,
  phone text,
  source text not null check (source in ('website-form', 'program-selector', 'contact-page', 'referral', 'social')),
  interested_program text,
  fitness_goal text,
  status text not null default 'new' check (status in ('new', 'contacted', 'qualified', 'converted', 'lost')),
  assigned_coach uuid references public.profiles (id),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_leads_status on public.leads (status);
create index if not exists idx_leads_created on public.leads (created_at desc);

-- ============================================================
--  3. clients
-- ============================================================
create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles (id),
  lead_id uuid references public.leads (id) on delete set null,
  name text not null,
  email text not null,
  phone text,
  age smallint, -- stored only when provided and necessary
  fitness_goal text,
  experience_level text check (experience_level in ('beginner', 'intermediate', 'advanced')),
  assigned_program text,
  coaching_package text check (coaching_package in ('silver', 'gold', 'none')) default 'none',
  start_date timestamptz,
  subscription_status text not null default 'pending' check (subscription_status in ('active', 'pending', 'expired', 'cancelled', 'on-hold')),
  assigned_coach uuid references public.profiles (id),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_clients_email on public.clients (email);

-- ============================================================
--  4. client_goals
-- ============================================================
create table if not exists public.client_goals (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete cascade,
  goal text not null,
  target_date date,
  notes text,
  created_at timestamptz not null default now()
);

-- ============================================================
--  5. client_progress
-- ============================================================
create table if not exists public.client_progress (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete cascade,
  recorded_at timestamptz not null default now(),
  weight_kg numeric(5, 2),
  target_weight_kg numeric(5, 2),
  height_cm numeric(5, 1), -- stored only if provided
  workout_completion_pct smallint check (workout_completion_pct between 0 and 100),
  nutrition_adherence_pct smallint check (nutrition_adherence_pct between 0 and 100),
  notes text,
  photo_path text, -- Supabase Storage object path
  created_at timestamptz not null default now()
);
create index if not exists idx_progress_client on public.client_progress (client_id, recorded_at desc);

-- ============================================================
--  6. coaching_packages
-- ============================================================
create table if not exists public.coaching_packages (
  id uuid primary key default gen_random_uuid(),
  code text unique not null check (code in ('silver', 'gold')),
  name text not null,
  price_monthly numeric(10, 2) not null,
  currency text not null default 'USD',
  follow_up_frequency text,
  reporting text,
  response_time text,
  support text,
  features jsonb not null default '{}'::jsonb,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
--  7. client_subscriptions
-- ============================================================
create table if not exists public.client_subscriptions (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete cascade,
  package_id uuid references public.coaching_packages (id),
  start_date timestamptz not null default now(),
  renewal_date timestamptz,
  status text not null default 'pending' check (status in ('active', 'pending', 'expired', 'cancelled', 'on-hold')),
  payment_status text not null default 'pending' check (payment_status in ('paid', 'pending', 'failed')),
  assigned_coach uuid references public.profiles (id),
  external_billing_ref text, -- future recurring-billing provider reference
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_subs_client on public.client_subscriptions (client_id);

-- ============================================================
--  8. orders (Shopify mirror — minimal cache)
-- ============================================================
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  shopify_order_id text unique,
  client_id uuid references public.clients (id) on delete set null,
  customer_name text not null,
  customer_email text not null,
  total numeric(10, 2) not null,
  currency text not null default 'USD',
  payment_status text not null check (payment_status in ('paid', 'pending', 'refunded')),
  fulfillment_status text not null check (fulfillment_status in ('fulfilled', 'unfulfilled', 'cancelled')),
  order_date timestamptz not null,
  demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_orders_date on public.orders (order_date desc);

-- ============================================================
--  9. order_items
-- ============================================================
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  shopify_product_id text,
  product_title text not null,
  quantity smallint not null default 1,
  unit_price numeric(10, 2) not null
);

-- ============================================================
--  10. products_cache (Shopify mirror — no competing DB)
-- ============================================================
create table if not exists public.products_cache (
  id uuid primary key default gen_random_uuid(),
  shopify_product_id text unique not null,
  title text not null,
  description text,
  price numeric(10, 2) not null,
  compare_at_price numeric(10, 2),
  category text,
  images jsonb not null default '[]'::jsonb,
  status text not null default 'active',
  product_url text,
  synced_at timestamptz not null default now()
);

-- ============================================================
--  11. testimonials
-- ============================================================
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients (id) on delete set null,
  client_name text not null,
  program text,
  quote text not null,
  rating smallint default 5 check (rating between 1 and 5),
  demo boolean not null default false,
  visible boolean not null default false,
  created_at timestamptz not null default now()
);

-- ============================================================
--  12. transformations
-- ============================================================
create table if not exists public.transformations (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients (id) on delete set null,
  client_label text not null,
  weeks integer not null default 12,
  summary text,
  stages jsonb not null default '[]'::jsonb,
  is_demo boolean not null default false,
  consent_verified boolean not null default false,
  visible boolean not null default false,
  created_at timestamptz not null default now()
);

-- ============================================================
--  13. internal_notes
-- ============================================================
create table if not exists public.internal_notes (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null check (entity_type in ('lead', 'client')),
  entity_id uuid not null,
  note text not null,
  author uuid references public.profiles (id),
  created_at timestamptz not null default now()
);
create index if not exists idx_notes_entity on public.internal_notes (entity_type, entity_id);

-- ============================================================
--  14. activity_logs
-- ============================================================
create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null check (entity_type in ('lead', 'client', 'order', 'subscription', 'progress')),
  entity_id uuid not null,
  action text not null,
  actor uuid references public.profiles (id),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists idx_activity_entity on public.activity_logs (entity_type, entity_id);

-- ============================================================
--  15. integration_events (n8n-ready)
-- ============================================================
create table if not exists public.integration_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null check (event_type in (
    'lead.created', 'lead.updated', 'client.created', 'client.updated',
    'order.paid', 'order.cancelled',
    'subscription.created', 'subscription.renewed', 'subscription.expired',
    'progress.submitted'
  )),
  source text not null check (source in ('website', 'admin', 'shopify', 'automation')),
  payload_ref text not null,
  processing_status text not null default 'pending' check (processing_status in ('pending', 'processed', 'failed')),
  error_message text,
  created_at timestamptz not null default now(),
  processed_at timestamptz
);
create index if not exists idx_events_type on public.integration_events (event_type);
create index if not exists idx_events_status on public.integration_events (processing_status);

-- ============================================================
--  Row Level Security
-- ============================================================
alter table public.leads enable row level security;
alter table public.clients enable row level security;
alter table public.client_progress enable row level security;
alter table public.client_subscriptions enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.products_cache enable row level security;
alter table public.testimonials enable row level security;
alter table public.transformations enable row level security;
alter table public.internal_notes enable row level security;
alter table public.activity_logs enable row level security;
alter table public.integration_events enable row level security;
alter table public.coaching_packages enable row level security;
alter table public.client_goals enable row level security;

-- Public read for visible demonstrations content only
create policy "public_read_visible_testimonials"
  on public.testimonials for select
  using (visible = true);

create policy "public_read_visible_transformations"
  on public.transformations for select
  using (visible = true);

create policy "public_read_published_packages"
  on public.coaching_packages for select
  using (active = true);

create policy "public_read_product_cache"
  on public.products_cache for select
  using (status = 'active');

-- Authenticated clients can read only their own data
create policy "client_reads_own_profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "client_reads_own_client_row"
  on public.clients for select
  using (auth.uid() = profile_id);

create policy "client_reads_own_progress"
  on public.client_progress for select
  using (exists (
    select 1 from public.clients c
    where c.id = client_progress.client_id and c.profile_id = auth.uid()
  ));

create policy "client_reads_own_subscriptions"
  on public.client_subscriptions for select
  using (exists (
    select 1 from public.clients c
    where c.id = client_subscriptions.client_id and c.profile_id = auth.uid()
  ));

create policy "client_reads_own_orders"
  on public.orders for select
  using (client_id is not null and exists (
    select 1 from public.clients c
    where public.orders.client_id = c.id and c.profile_id = auth.uid()
  ));

create policy "client_reads_own_order_items"
  on public.order_items for select
  using (exists (
    select 1 from public.orders o
    join public.clients c on o.client_id = c.id
    where order_items.order_id = o.id and c.profile_id = auth.uid()
  ));

-- Coach/admin full management (insert, update, delete)
create policy "staff_manage_leads"
  on public.leads for all
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('coach', 'admin'))
  );

create policy "staff_manage_clients"
  on public.clients for all
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('coach', 'admin'))
  );

create policy "staff_manage_progress"
  on public.client_progress for all
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('coach', 'admin'))
  );

create policy "staff_manage_subscriptions"
  on public.client_subscriptions for all
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('coach', 'admin'))
  );

create policy "staff_manage_orders"
  on public.orders for all
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('coach', 'admin'))
  );

create policy "staff_manage_order_items"
  on public.order_items for all
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('coach', 'admin'))
  );

create policy "staff_manage_products_cache"
  on public.products_cache for all
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('coach', 'admin'))
  );

create policy "staff_manage_testimonials"
  on public.testimonials for all
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('coach', 'admin'))
  );

create policy "staff_manage_transformations"
  on public.transformations for all
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('coach', 'admin'))
  );

create policy "staff_manage_notes"
  on public.internal_notes for all
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('coach', 'admin'))
  );

create policy "staff_manage_activity"
  on public.activity_logs for all
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('coach', 'admin'))
  );

create policy "staff_manage_events"
  on public.integration_events for all
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('coach', 'admin'))
  );

create policy "staff_manage_goals"
  on public.client_goals for all
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('coach', 'admin'))
  );

create policy "staff_manage_packages"
  on public.coaching_packages for all
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('coach', 'admin'))
  );

-- ============================================================
--  updated_at triggers
-- ============================================================
create or replace function public.touch_updated_at ()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

do $$
declare
  t text;
  tables text[] := array['profiles', 'leads', 'clients', 'coaching_packages', 'client_subscriptions', 'orders', 'products_cache'];
begin
  foreach t in array tables loop
    execute format('drop trigger if exists trg_touch_%s on public.%I', lower(t), t);
    execute format('create trigger trg_touch_%s before update on public.%I for each row execute function public.touch_updated_at()', lower(t), t);
  end loop;
end;
$$;
