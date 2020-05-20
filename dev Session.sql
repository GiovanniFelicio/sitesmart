insert into projects(user_id, title) values('2', 'Machine Learning'),('3', 'WebRTC'),('4', 'Broadcast RTC');
select * from users;
update users set created_at =  '2020-05-02 14:52:35' where id = 4;
alter table projects auto_increment = 1;