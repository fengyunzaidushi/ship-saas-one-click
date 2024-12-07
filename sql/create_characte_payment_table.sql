-- 创建支付记录表
create table if not exists character_payment (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    stripe_session_id text not null unique,
    stripe_payment_intent_id text,
    price_id text not null,
    amount numeric(10,2) not null,
    currency text not null,
    status text not null,
    credits bigint null default '0'::bigint,
    product_metadata jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 创建索引
create index if not exists character_payment_user_id_idx on character_payment(user_id);
create index if not exists character_payment_stripe_session_id_idx on character_payment(stripe_session_id);
create index if not exists character_payment_status_idx on character_payment(status);

-- 添加RLS策略
alter table character_payment enable row level security;

-- 允许已认证用户查看自己的支付记录
create policy "Users can view their own payment records"
    on character_payment for select
    using (auth.uid() = user_id);

-- 允许服务角色完全访问
create policy "Service role has full access"
    on character_payment for all
    using (auth.role() = 'service_role');

-- 创建更新触发器以自动更新updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

create trigger update_character_payment_updated_at
    before update on character_payment
    for each row
    execute function update_updated_at_column(); 




-- 添加插入策略
CREATE POLICY "Allow users to insert their own payment records" ON character_payment
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 添加查看策略
CREATE POLICY "Allow users to view their own payment records" ON character_payment
FOR SELECT USING (auth.uid() = user_id);