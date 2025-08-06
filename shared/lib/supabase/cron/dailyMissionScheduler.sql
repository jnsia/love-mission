-- 매일 자정에 실행되는 미션 관련 스케줄러
SELECT cron.schedule (
  'daily-mission-scheduler',
  '0 15 * * *',
  $$
  -- 예약 등록된 일일 미션들 등록하기
  INSERT INTO "missions" ("userId", "title", "successCoin", "failCoin", "type", "description")
  (
    SELECT "userId", title, "successCoin", "failCoin", 'daily', "description"
    FROM "scheduledMissions"
  );
  
  -- 마감된 미션 정보를 임시 View에 저장
  CREATE OR REPLACE VIEW expired_missions AS
  SELECT id, title, "failCoin", "userId", completed, type
  FROM missions
  WHERE type = 'daily' AND (NOT completed) AND ("createdAt" <= NOW() - INTERVAL '1 day');

  -- 일일 미션 실패 유저들 코인 차감
  UPDATE users
  SET "coin" = "coin" - (
    SELECT COALESCE(SUM("failCoin"), 0) 
    FROM expired_missions 
    WHERE expired_missions."userId" = users.id
  )
  WHERE id IN (SELECT "userId" FROM expired_missions); 

  -- 일일 미션 실패 이력 저장
  INSERT INTO histories ("userId", "record", "coin", "date")
  (
    SELECT "userId", CONCAT(title, ' 미션 실패'), -"failCoin", NOW()::date
    FROM expired_missions
  );

  -- 미션 실패 정보 저장
  INSERT INTO "failedMissions" ("userId", "title", "coin", "date", "type")
  (
    SELECT "userId", title, -"failCoin", NOW()::date, type
    FROM expired_missions
  );

  -- 실패한 미션 정보 삭제
  DELETE FROM missions
  WHERE id IN (SELECT id FROM expired_missions);
  $$
);
