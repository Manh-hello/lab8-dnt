# Firestore Seed Data — Week 8

Week 8 dùng lại collection:

```text
rooms
```

## a201

```text
name        string    A201
building    string    Block A
capacity    number    30
available   boolean   true
```

## a202

```text
name        string    A202
building    string    Block A
capacity    number    50
available   boolean   true
```

## b101

```text
name        string    B101
building    string    Block B
capacity    number    40
available   boolean   true
```

## b202

```text
name        string    B202
building    string    Block B
capacity    number    60
available   boolean   false
```

Không cần seed booking.

Week 8 sẽ tạo booking bằng deterministic document ID:

```text
bookings/a201_08-00-09-00
bookings/a201_09-00-10-00
bookings/a202_08-00-09-00
...
```

Rule demo:

```text
booking document exists
→ slot đã booked

booking document missing
→ slot còn free
```
