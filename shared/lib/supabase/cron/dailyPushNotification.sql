select
  cron.schedule (
    'daily-send-notifications', -- name of cron
    '0 15 * * *', -- every day at 11:00
    $$
    select
    net.http_post(
    url:='https://zuuyrkkfrnvvfvlpkyyv.supabase.co/functions/v1/dailySendNotifications', -- your edge function
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer "}'::jsonb,
    body:=concat('{}')::jsonb
    ) as request_id;
    $$
  );
