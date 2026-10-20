# Week 8 Starter — React Native + Firestore Transactions

## Mục đích

Starter này là điểm bắt đầu cho **Student Handout Week 8**.

Nó cố ý giữ cách ghi booking kiểu Week 7:

```text
Book
→ addDoc()
→ Firestore tạo random document ID
```

Vì vậy app vẫn có thể **double booking** khi hai client cùng đặt một room/slot.

Sinh viên sẽ dùng Student Handout để biến starter thành:

```text
Room + Slot
→ deterministic bookingId
→ runTransaction()
→ READ → CHECK → WRITE
→ exactly one winner
```

## Starter đã có sẵn

```text
✅ React Native + Expo
✅ Firebase / Firestore config structure
✅ rooms onSnapshot()
✅ bookings onSnapshot()
✅ selectedRoom
✅ selectedSlot
✅ purpose
✅ bookedBy
✅ Recent Bookings
✅ addDoc() — Week 7 style write
```

## Cố ý CHƯA có

```text
❌ toSlotKey()
❌ deterministic bookingId
❌ bookingRef bằng doc()
❌ runTransaction()
❌ transaction.get()
❌ exists() business check
❌ transaction.set()
❌ SLOT_ALREADY_BOOKED
❌ isBooking state
❌ Cancel Booking
```

## Bắt đầu

1. Điền Firebase config thật vào `src/firebase.ts`.
2. Dùng lại Firestore project Week 7.
3. Giữ `rooms` collection.
4. Xóa booking test cũ nếu cần quan sát rõ.
5. Chạy:

```cmd
npm install
npm start
```

Sau đó làm lần lượt theo:

```text
Demo-Week-08-Firestore-Transactions-Student-Handout.md
```

## Checkpoint đầu tiên

Trước khi sửa transaction, hãy thử hai client cùng đặt:

```text
A201 / 08:00-09:00
```

Starter có thể tạo hai booking document khác ID cho cùng room/slot.

Đó là bug mà Week 8 sẽ sửa.
