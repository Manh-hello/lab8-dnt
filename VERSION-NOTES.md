# Version Notes — Week 8 Starter

Project tiếp tục stack của Week 7:

```text
expo             ~57.0.26
react            19.2.3
react-native     0.86.3
expo-status-bar  ~57.0.1
firebase         13.0.0
@types/react     ~19.2.2
typescript       ~6.0.3
```

Week 8 không cần package transaction riêng.

Firestore transaction API được import từ:

```tsx
firebase/firestore
```

Các API chính:

```text
doc
runTransaction
transaction.get
transaction.set
deleteDoc
onSnapshot
```

Nếu dùng project ở học kỳ sau, nên kiểm tra lại compatibility của Expo SDK và Firebase SDK trước khi nâng version.
