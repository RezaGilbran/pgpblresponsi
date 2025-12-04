import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  ScrollView,
  Linking,
  Platform,
  ImageSourcePropType,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { localImageMapping } from "../constants/imageMapping";
import { WebView } from "react-native-webview";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";

export default function DetailScreen() {
  const params = useLocalSearchParams();

  const id = String(params.id);
  const nama = String(params.nama);
  const deskripsi = String(params.deskripsi);
  const latitude = Number(params.latitude);
  const longitude = Number(params.longitude);

  // ============================================
  // HANDLE FOTO PARAM
  // ============================================
  let fotoParam: string | null = null;

  if (params.foto) {
    if (Array.isArray(params.foto)) fotoParam = params.foto[0];
    else fotoParam = String(params.foto);

    fotoParam = fotoParam.replace(/^"(.+)"$/, "$1");
  }

  let imageSource: ImageSourcePropType;
  if (fotoParam && fotoParam !== "undefined") {
    imageSource = { uri: fotoParam };
  } else {
    imageSource =
      localImageMapping[id] ||
      { uri: "https://via.placeholder.com/700x400?text=No+Image" };
  }

  // ============================================
  // DISTANCE
  // ============================================
  const [distance, setDistance] = useState<number | null>(null);

  const getDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;

    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  };

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      const loc = await Location.getCurrentPositionAsync({});
      const jarak = getDistance(
        loc.coords.latitude,
        loc.coords.longitude,
        latitude,
        longitude
      );
      setDistance(jarak);
    })();
  }, []);

  // ============================================
  // TICKET SYSTEM
  // ============================================
  const [anak, setAnak] = useState<number>(0);
  const [dewasa, setDewasa] = useState<number>(0);

  const hargaAnak = 10000;
  const hargaDewasa = 20000;
  const total = anak * hargaAnak + dewasa * hargaDewasa;

  const generateTicketId = () =>
    "TIKET-" + Math.random().toString(36).substring(2, 10).toUpperCase();

  const saveToCart = async () => {
    if (total <= 0) return alert("Pilih tiket dulu!");

    const ticket = {
      id: generateTicketId(),
      wisataId: id,
      nama,
      anak,
      dewasa,
      total,
      tanggal: new Date().toISOString(),
    };

    const existing = await AsyncStorage.getItem("CART");
    const cart = existing ? JSON.parse(existing) : [];
    cart.push(ticket);

    await AsyncStorage.setItem("CART", JSON.stringify(cart));

    alert("Ditambahkan ke keranjang!");
  };

  const handleCheckout = async () => {
    if (total <= 0) return alert("Pilih tiket dulu!");

    const ticket = {
      id: generateTicketId(),
      wisataId: id,
      nama,
      anak,
      dewasa,
      total,
      tanggal: new Date().toISOString(),
    };

    const existing = await AsyncStorage.getItem("HISTORY");
    const history = existing ? JSON.parse(existing) : [];
    history.push(ticket);

    await AsyncStorage.setItem("HISTORY", JSON.stringify(history));

    router.push({ pathname: "/qr", params: ticket });
  };

  const openMaps = () => {
    const url =
      Platform.OS === "ios"
        ? `http://maps.google.com/?daddr=${latitude},${longitude}`
        : `google.navigation:q=${latitude},${longitude}`;
    Linking.openURL(url);
  };

  // ============================================
  // RENDER UI
  // ============================================
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 150 }}>
        {/* HERO IMAGE */}
        <View style={styles.heroContainer}>
          <Image source={imageSource} style={styles.heroImage} />
          <View style={styles.heroOverlay} />
          <Text style={styles.heroTitle}>{nama}</Text>
        </View>

        {/* INFORMASI */}
        <Text style={styles.sectionHeader}>Informasi Wisata</Text>
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>{deskripsi}</Text>
        </View>

        {/* ESTIMASI */}
        <Text style={styles.sectionHeader}>Estimasi Perjalanan</Text>
        <View style={styles.travelCard}>
          {distance ? (
            <>
              <Text style={styles.travelInfo}>
                📍 Jarak: <Text style={styles.bold}>{distance.toFixed(1)} km</Text>
              </Text>
              <Text style={styles.travelInfo}>
                🏍 Motor:{" "}
                <Text style={styles.bold}>
                  {(distance / 40 * 60).toFixed(0)} menit
                </Text>
              </Text>
              <Text style={styles.travelInfo}>
                🚗 Mobil:{" "}
                <Text style={styles.bold}>
                  {(distance / 60 * 60).toFixed(0)} menit
                </Text>
              </Text>

              <Pressable style={styles.mapButton} onPress={openMaps}>
                <Text style={styles.mapButtonText}>Buka Maps</Text>
              </Pressable>
            </>
          ) : (
            <Text>Mengambil lokasi...</Text>
          )}
        </View>

        {/* MAP */}
        <Text style={styles.sectionHeader}>Lokasi Wisata</Text>
        <View style={styles.mapContainer}>
          <WebView
            style={{ flex: 1 }}
            originWhitelist={["*"]}
            source={{
              html: `
                <html>
                  <head>
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
                    <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>

                    <style>
                      #map { height: 100vh; width: 100vw; }
                      .leaflet-pane { transform: translateY(40px); }
                    </style>
                  </head>
                  <body style="margin:0">
                    <div id="map"></div>
                    <script>
                      var map = L.map('map').setView([${latitude}, ${longitude}], 13);
                      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
                      L.marker([${latitude}, ${longitude}]).addTo(map);
                    </script>
                  </body>
                </html>
              `,
            }}
          />
        </View>

        {/* BELI TIKET */}
        <Text style={styles.sectionHeader}>Beli Tiket</Text>

        <View style={styles.ticketCard}>
          {/* Anak */}
          <View style={styles.ticketRow}>
            <Text style={styles.ticketLabel}>Anak</Text>

            <View style={styles.counter}>
              <Pressable style={styles.counterBtn} onPress={() => setAnak(Math.max(0, anak - 1))}>
                <Text style={styles.counterText}>-</Text>
              </Pressable>

              <Text style={styles.counterNumber}>{anak}</Text>

              <Pressable style={styles.counterBtn} onPress={() => setAnak(anak + 1)}>
                <Text style={styles.counterText}>+</Text>
              </Pressable>
            </View>

            <Text style={styles.ticketPrice}>Rp {hargaAnak.toLocaleString()}</Text>
          </View>

          {/* Dewasa */}
          <View style={styles.ticketRow}>
            <Text style={styles.ticketLabel}>Dewasa</Text>

            <View style={styles.counter}>
              <Pressable style={styles.counterBtn} onPress={() => setDewasa(Math.max(0, dewasa - 1))}>
                <Text style={styles.counterText}>-</Text>
              </Pressable>

              <Text style={styles.counterNumber}>{dewasa}</Text>

              <Pressable style={styles.counterBtn} onPress={() => setDewasa(dewasa + 1)}>
                <Text style={styles.counterText}>+</Text>
              </Pressable>
            </View>

            <Text style={styles.ticketPrice}>Rp {hargaDewasa.toLocaleString()}</Text>
          </View>
        </View>
      </ScrollView>

      {/* FOOTER */}
      <View style={styles.footerBar}>
        <Pressable style={styles.cartBtn} onPress={saveToCart}>
          <Text style={styles.footerText}>+ Keranjang</Text>
        </Pressable>

        <Pressable style={styles.checkoutBtn} onPress={handleCheckout}>
          <Text style={styles.footerText}>Checkout</Text>
        </Pressable>
      </View>
    </View>
  );
}

//
// ==========================
// STYLES FINAL
// ==========================
const styles = StyleSheet.create({
  heroContainer: { position: "relative" },
  heroImage: { width: "100%", height: 260 },
  heroOverlay: {
    position: "absolute",
    width: "100%",
    height: 260,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  heroTitle: {
    position: "absolute",
    bottom: 20,
    left: 20,
    fontSize: 30,
    fontWeight: "800",
    color: "#fff",
  },

  sectionHeader: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 25,
    marginLeft: 20,
  },

  infoCard: {
    marginHorizontal: 20,
    marginTop: 12,
    backgroundColor: "#ffffff",
    padding: 18,
    borderRadius: 16,
    elevation: 3,
  },
  infoText: {
    fontSize: 16,
    lineHeight: 22,
    color: "#444",
  },

  travelCard: {
    marginHorizontal: 20,
    marginTop: 15,
    backgroundColor: "#eef6ff",
    padding: 18,
    borderRadius: 14,
    elevation: 3,
  },
  travelInfo: { fontSize: 16, marginBottom: 4 },
  bold: { fontWeight: "800" },

  mapButton: {
    marginTop: 14,
    backgroundColor: "#2d89ff",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  mapButtonText: { color: "#fff", fontWeight: "700", fontSize: 16 },

  mapContainer: {
    height: 270,
    marginHorizontal: 20,
    marginTop: 15,
    borderRadius: 15,
    overflow: "hidden",
    elevation: 4,
  },

  ticketCard: {
    marginHorizontal: 20,
    marginTop: 18,
    backgroundColor: "#f8f9ff",
    padding: 18,
    borderRadius: 12,
  },

  ticketRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  ticketLabel: { fontSize: 18, fontWeight: "600" },

  counter: { flexDirection: "row", alignItems: "center" },
  counterBtn: {
    width: 36,
    height: 36,
    backgroundColor: "#4A90E2",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  counterText: { color: "#fff", fontSize: 20, fontWeight: "700" },
  counterNumber: {
    width: 40,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
  },

  ticketPrice: { fontSize: 16, fontWeight: "700" },

  footerBar: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#ccc",
  },

  cartBtn: {
    width: "48%",
    backgroundColor: "#f39c12",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  checkoutBtn: {
    width: "48%",
    backgroundColor: "#2ecc71",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  footerText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
});
