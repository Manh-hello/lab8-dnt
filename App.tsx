import { useEffect, useState } from "react";

import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import {
  doc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  runTransaction,
} from "firebase/firestore";

import { db } from "./src/firebase";

type Room = {
  id: string;
  name: string;
  building: string;
  capacity: number;
  available: boolean;
};

type Booking = {
  id: string;
  roomId: string;
  roomName: string;
  building: string;
  slot: string;
  purpose: string;
  bookedBy: string;
  createdAt?: unknown;
};

type RoomCardProps = {
  room: Room;
  selected: boolean;
  onSelect: (room: Room) => void;
};

const slots = ["08:00-09:00", "09:00-10:00", "14:00-15:00", "15:00-16:00"];

function RoomCard({ room, selected, onSelect }: RoomCardProps) {
  return (
    <View style={[styles.card, selected ? styles.selectedCard : null]}>
      <Text style={styles.roomName}>{room.name}</Text>
      <Text style={styles.roomMeta}>Building: {room.building}</Text>
      <Text style={styles.roomMeta}>Capacity: {room.capacity}</Text>
      <Text style={styles.roomMeta}>
        {room.available ? "Available" : "Unavailable"}
      </Text>

      <Pressable
        style={[
          styles.selectButton,
          !room.available ? styles.disabledButton : null,
        ]}
        disabled={!room.available}
        onPress={() => onSelect(room)}
      >
        <Text style={styles.selectButtonText}>
          {!room.available ? "Not available" : selected ? "Selected" : "Select"}
        </Text>
      </Pressable>
    </View>
  );
}

function toSlotKey(slot: string) {
  return slot.replace(/:/g, "-");
}

export default function App() {
  // Shared Firestore data.
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Local UI state.
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [purpose, setPurpose] = useState("");
  const [bookedBy, setBookedBy] = useState("");
  const [message, setMessage] = useState("");
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const bookedSlotCount = selectedRoom
    ? bookings.filter((b) => b.roomId === selectedRoom.id).length
    : 0;
  // Firestore rooms → React state → UI.
  useEffect(() => {
    const roomsRef = collection(db, "rooms");

    const unsubscribe = onSnapshot(
      roomsRef,
      (snapshot) => {
        const roomItems = snapshot.docs.map((roomDoc) => ({
          id: roomDoc.id,
          ...roomDoc.data(),
        })) as Room[];

        roomItems.sort((a, b) => a.name.localeCompare(b.name));

        setRooms(roomItems);
        setLoadingRooms(false);
        setErrorMessage("");
      },
      (error) => {
        console.error("Listen rooms failed:", error);
        setErrorMessage(
          "Cannot load rooms. Check Firebase config and Firestore rules.",
        );
        setLoadingRooms(false);
      },
    );

    return unsubscribe;
  }, []);

  // Firestore bookings → React state → Recent Bookings UI.
  useEffect(() => {
    const bookingsQuery = query(
      collection(db, "bookings"),
      orderBy("createdAt", "desc"),
    );

    const unsubscribe = onSnapshot(
      bookingsQuery,
      (snapshot) => {
        const bookingItems = snapshot.docs.map((bookingDoc) => ({
          id: bookingDoc.id,
          ...bookingDoc.data(),
        })) as Booking[];

        setBookings(bookingItems);
      },
      (error) => {
        console.error("Listen bookings failed:", error);
      },
    );

    return unsubscribe;
  }, []);

  // STARTER LOGIC:
  // This is intentionally the Week 7 style write path.
  // addDoc() creates a random document ID, so two clients can still
  // create two bookings for the same room + slot.
  async function handleBookRoom() {
    setMessage("");

    if (!selectedRoom) {
      setMessage("Please select a room.");
      return;
    }

    if (!selectedSlot) {
      setMessage("Please select a time slot.");
      return;
    }

    if (!purpose.trim()) {
      setMessage("Please enter purpose.");
      return;
    }

    if (!bookedBy.trim()) {
      setMessage("Please enter your name.");
      return;
    }

    const slotKey = toSlotKey(selectedSlot);
    const bookingId = `${selectedRoom.id}_${slotKey}`;
    const bookingRef = doc(db, "bookings", bookingId);

    try {
      await runTransaction(db, async (transaction) => {
        // READ
        const bookingSnap = await transaction.get(bookingRef);
        // CHECK
        if (bookingSnap.exists()) {
          throw new Error("SLOT_ALREADY_BOOKED");
        }
        await new Promise((resolve) => setTimeout(resolve, 3000));
        // WRITE
        transaction.set(bookingRef, {
          roomId: selectedRoom.id,
          roomName: selectedRoom.name,
          building: selectedRoom.building,
          slot: selectedSlot,
          purpose: purpose.trim(),
          bookedBy: bookedBy.trim(),
          createdAt: serverTimestamp(),
        });
      });

      setMessage("Booking successful.");
      setPurpose("");
      setBookedBy("");
      setSelectedSlot(null);
      setSelectedRoom(null);
    } catch (error) {
      if (error instanceof Error && error.message === "SLOT_ALREADY_BOOKED") {
        setMessage("Slot already booked.");
        return;
      }
      console.error("Booking transaction failed:", error);
      setMessage("Booking failed. Please try again.");
    }
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={rooms}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View>
            <Text style={styles.eyebrow}>WEEK 8 · STARTER</Text>

            <Text style={styles.title}>Real-Time Room Booking</Text>

            <Text style={styles.subtitle}>
              Starter state: realtime works, but double booking is still
              possible.
            </Text>

            <View style={styles.warningBox}>
              <Text style={styles.warningTitle}>Intentional starter bug</Text>
              <Text style={styles.warningText}>
                Booking still uses addDoc() with a random document ID.
              </Text>
              <Text style={styles.warningText}>
                Follow the Student Handout to make booking transaction-safe.
              </Text>
            </View>

            <Text style={styles.sectionTitle}>Available Rooms</Text>

            {loadingRooms ? (
              <Text style={styles.hint}>Loading rooms...</Text>
            ) : null}

            {errorMessage ? (
              <Text style={styles.error}>{errorMessage}</Text>
            ) : null}
          </View>
        }
        renderItem={({ item }) => (
          <RoomCard
            room={item}
            selected={selectedRoom?.id === item.id}
            onSelect={(room) => {
              setSelectedRoom(room);
              setMessage("");
            }}
          />
        )}
        ListEmptyComponent={
          !loadingRooms && !errorMessage ? (
            <Text style={styles.hint}>No rooms found in Firestore.</Text>
          ) : null
        }
        ListFooterComponent={
          <View>
            <View style={styles.bookingPanel}>
              <Text style={styles.selectedText}>
                Selected room: {selectedRoom ? selectedRoom.name : "None"}
              </Text>

              <Text style={styles.label}>Time Slot</Text>
              <Text>
                Booked Slots: {bookedSlotCount}/{slots.length}
              </Text>
              <View style={styles.slotRow}>
                {slots.map((slot) => {
                  const isSelected = selectedSlot === slot;
                  const isBooked = bookings.some(
                    (booking) =>
                      booking.roomId === selectedRoom?.id &&
                      booking.slot === slot,
                  );

                  return (
                    <Pressable
                      key={slot}
                      disabled={isBooked}
                      style={[
                        styles.slotButton,
                        isSelected ? styles.selectedSlotButton : null,
                        isBooked ? styles.disabledButton : null,
                      ]}
                      onPress={() => {
                        setSelectedSlot(slot);
                        setMessage("");
                      }}
                    >
                      <Text
                        style={[
                          styles.slotText,
                          isSelected ? styles.selectedSlotText : null,
                        ]}
                      >
                        <Text>{isBooked ? `${slot} - Booked` : slot}</Text>
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <Text style={styles.label}>Purpose</Text>

              <TextInput
                style={styles.input}
                value={purpose}
                onChangeText={(text) => {
                  setPurpose(text);
                  setMessage("");
                }}
                placeholder="Booking purpose"
              />

              <Text style={styles.label}>Booked By</Text>

              <TextInput
                style={styles.input}
                value={bookedBy}
                onChangeText={(text) => {
                  setBookedBy(text);
                  setMessage("");
                }}
                placeholder="Your name"
                returnKeyType="done"
              />

              <Pressable style={styles.bookButton} onPress={handleBookRoom}>
                <Text style={styles.bookButtonText}>Book Room</Text>
              </Pressable>

              {message ? <Text style={styles.message}>{message}</Text> : null}
            </View>

            <Text style={styles.counter}>
              Total Bookings: {bookings.length}
            </Text>

            <Text style={styles.sectionTitle}>Recent Bookings</Text>

            {bookings.length === 0 ? (
              <Text style={styles.hint}>No bookings yet.</Text>
            ) : (
              bookings.slice(0, 8).map((booking) => (
                <View key={booking.id} style={styles.bookingCard}>
                  <Text style={styles.roomName}>{booking.roomName}</Text>
                  <Text style={styles.roomMeta}>{booking.building}</Text>
                  <Text style={styles.roomMeta}>Slot: {booking.slot}</Text>
                  <Text style={styles.roomMeta}>
                    Purpose: {booking.purpose}
                  </Text>
                  <Text style={styles.roomMeta}>
                    Booked by: {booking.bookedBy}
                  </Text>
                  <Text style={styles.bookingId}>
                    Document ID: {booking.id}
                  </Text>
                </View>
              ))
            )}

            <View style={styles.testBox}>
              <Text style={styles.testTitle}>Starter checkpoint</Text>
              <Text style={styles.hint}>
                Try booking the same room and slot from two clients. This
                starter can create two different booking documents.
              </Text>
            </View>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  listContent: {
    paddingTop: 48,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 18,
  },
  warningBox: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#cccccc",
    backgroundColor: "#ffffff",
    marginBottom: 20,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },
  warningText: {
    fontSize: 14,
    marginBottom: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 8,
    marginBottom: 12,
  },
  hint: {
    fontSize: 14,
    marginBottom: 12,
  },
  error: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: "#222222",
  },
  roomName: {
    fontSize: 19,
    fontWeight: "700",
    marginBottom: 4,
  },
  roomMeta: {
    marginBottom: 3,
  },
  selectButton: {
    marginTop: 12,
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#222222",
  },
  disabledButton: {
    opacity: 0.45,
  },
  selectButtonText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  bookingPanel: {
    marginTop: 12,
    marginBottom: 18,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#ffffff",
  },
  selectedText: {
    marginBottom: 16,
    fontSize: 16,
    fontWeight: "600",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  slotRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  slotButton: {
    paddingHorizontal: 10,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 8,
  },
  selectedSlotButton: {
    borderWidth: 2,
    borderColor: "#222222",
    backgroundColor: "#eeeeee",
  },
  slotText: {
    fontSize: 13,
  },
  selectedSlotText: {
    fontWeight: "700",
  },
  input: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  bookButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#222222",
  },
  bookButtonText: {
    color: "#ffffff",
    fontWeight: "700",
  },
  message: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "600",
  },
  counter: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  bookingCard: {
    backgroundColor: "#ffffff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
  },
  bookingId: {
    marginTop: 6,
    fontSize: 12,
  },
  testBox: {
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#cccccc",
  },
  testTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },
});
