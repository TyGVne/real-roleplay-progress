# real_roleplay_progressbot

Bot Discord tracking tiến độ cho Real Roleplay, có dashboard cố định và thanh tiến độ xanh.

## Cần chuẩn bị

- Node.js 18+
- Discord Bot Token
- Application Client ID
- Discord Server ID
- ID kênh để bot gửi dashboard tiến độ
- Role ID được quyền quản lý task, có thể bỏ trống nếu chỉ Admin dùng

## Cài đặt

```bash
npm install
cp .env.example .env
```

Mở `.env` và điền:

```env
DISCORD_TOKEN=token_bot
CLIENT_ID=application_client_id
GUILD_ID=server_id
PROGRESS_CHANNEL_ID=channel_id
ALLOWED_ROLE_ID=role_id_duoc_quyen_quan_ly
```

## Deploy slash command

```bash
npm run deploy
```

## Chạy bot

```bash
npm start
```

## Lệnh Discord

```txt
/task add name:"Fix độ xe PD" progress:80 status:doing assignee:@Ty deadline:"20/06"
/task update id:1 progress:100
/task update id:2 status:testing note:"Chờ tester check lại"
/task list
/task delete id:1
/task dashboard
```

Dashboard sẽ tự edit message cũ, không spam kênh.

## Invite bot

Khi tạo invite link cho bot, cần quyền:
- bot
- applications.commands
- Send Messages
- Embed Links
- Read Message History

