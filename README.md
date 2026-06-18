# real_roleplay_progressbot

Bot Discord tracking tiến độ cho Real Roleplay, có dashboard cố định và thanh tiến độ xanh.

## Railway Variables cần có

```env
DISCORD_TOKEN=token_bot
CLIENT_ID=application_client_id
GUILD_ID=server_id
PROGRESS_CHANNEL_ID=channel_id_dashboard
ALLOWED_ROLE_ID=role_id_duoc_quyen_quan_ly
```

`ALLOWED_ROLE_ID` có thể bỏ trống. Khi bỏ trống, chỉ người có quyền Administrator dùng được lệnh quản lý.

## Cách chạy local

```bash
npm install
npm run deploy
npm start
```

## Cách chạy Railway

Railway chỉ cần `npm start`. Bản này đã tự đăng ký slash commands lúc bot online, nên không cần chạy riêng `npm run deploy` trên Railway.

Sau khi deploy/restart, đợi Discord cập nhật khoảng vài giây rồi thử gõ:

```txt
/task dashboard
/task add name:"Fix độ xe PD" progress:80 status:doing assignee:@Ty deadline:"20/06"
/task list
/task update id:"1" progress:100
/task delete id:"1"
```

## Invite bot

Invite bot phải có đủ scope:

```txt
bot
applications.commands
```

Bot cần quyền trong kênh dashboard:

```txt
View Channel
Send Messages
Embed Links
Read Message History
```

Nếu lệnh không hiện, mời bot lại bằng link có `applications.commands`, rồi restart Railway.
