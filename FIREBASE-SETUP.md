# Firebase Setup — Week 8 Starter

Week 8 tiếp tục dùng Firebase project Week 7.

## 1. Nếu đã có project Week 7

Giữ nguyên:

```text
Firebase project
Firestore Database
rooms collection
Firebase Web App
firebaseConfig
```

Không cần tạo project mới.

## 2. Điền Firebase config

Mở:

```text
src/firebase.ts
```

Thay các giá trị:

```text
PASTE_...
```

bằng config thật của project.

## 3. Firestore Rules

Week 8 chưa có Authentication.

Trong môi trường học tập có thể dùng Test mode/rules demo tạm thời theo hướng dẫn của GV.

> Không dùng rules mở cho production.

## 4. Cleanup bookings cũ

Week 7 có thể có:

```text
bookings/<random-auto-id>
```

Week 8 dùng:

```text
bookings/{roomId_slotKey}
```

Ví dụ:

```text
bookings/a201_08-00-09-00
```

Trước Demo nên xóa booking test cũ để dễ quan sát.

## 5. PASS

```text
App mở
→ rooms hiển thị
→ không có Firebase initialization error
→ bookings listener hoạt động
```
