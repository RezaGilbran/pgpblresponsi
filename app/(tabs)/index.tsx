import { View, Text, FlatList, StyleSheet, Image, Pressable } from "react-native";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

type TWisata = {
  id: string;
  nama: string;
  fotoUrl?: string;
  foto?: any;
  deskripsi: string;
  harga: string;
  maps?: string;
  latitude?: number;
  longitude?: number;
};

// --- DATA DEFAULT (ASSET LOKAL) ---
const wisataDefault: TWisata[] = [
  {
    id: "1",
    nama: "Huta Siallagan",
    foto: require("../../assets/images/huta.jpeg"),
    deskripsi: "Kampung adat Batak dengan Batu Persidangan dan rumah adat Bolon.",
    harga: "Rp 10.000 - Rp 20.000",
    maps: "",
    latitude: 2.6789177,
    longitude: 98.836382,
  },
  {
    id: "2",
    nama: "Bukit Sibea-bea",
    foto: require("../../assets/images/patung.jpg"),
    deskripsi: "Bukit dengan patung Yesus Kristus besar dan panorama Danau Toba.",
    harga: "Rp 10.000 – Rp 20.000",
    maps: "",
    latitude: 2.4939,
    longitude: 98.6946,
  },
  {
    id: "3",
    nama: "Danau Toba",
    foto: require("../../assets/images/danautoba.jpeg"),
    deskripsi: "Danau kawah vulkanik terbesar di dunia.",
    harga: "Rp 10.000 - Rp 20.000",
    maps: "",
    latitude: 2.6167,
    longitude: 98.8167,
  },
  {
    id: "4",
    nama: "Bukit Holbung",
    foto: require("../../assets/images/bukitholbung.jpg"),
    deskripsi: "Bukit indah dengan padang rumput luas.",
    harga: "Rp 10.000 – Rp 10.000",
    maps: "",
    latitude: 2.5539,
    longitude: 98.7742,
  },
];

export default function HomeScreen() {
  const [wisataFirebase, setWisataFirebase] = useState<TWisata[]>([]);

  // --- LOAD DATA DARI FIRESTORE ---
  const loadFirebaseData = async () => {
    const snap = await getDocs(collection(db, "wisata"));
    const list: TWisata[] = [];

    snap.forEach((docSnap) => {
      const data = docSnap.data();

      list.push({
        id: docSnap.id,
        nama: data.nama,
        deskripsi: data.deskripsi,
        harga: data.harga,
        maps: data.maps || "",
        fotoUrl: data.fotoUrl,
        latitude: typeof data.latitude === "string" ? parseFloat(data.latitude) : data.latitude,
        longitude: typeof data.longitude === "string" ? parseFloat(data.longitude) : data.longitude,
      });
    });

    setWisataFirebase(list);
  };

  useEffect(() => {
    loadFirebaseData();
  }, []);

  const allWisata = [...wisataDefault, ...wisataFirebase];

  return (
    <View style={{ flex: 1, backgroundColor: "#f2f2f2" }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>SITOURS</Text>
      </View>

      <FlatList
        data={allWisata}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image
              source={
                item.fotoUrl
                  ? { uri: item.fotoUrl }
                  : item.foto
              }
              style={styles.image}
            />

            <Text style={styles.title}>{item.nama}</Text>

            <Pressable
              style={styles.detailButton}
              onPress={() =>
                router.push({
                  pathname: "/detail",
                  params: {
                    id: item.id,
                    nama: item.nama,
                    deskripsi: item.deskripsi,
                    harga: item.harga,
                    maps: item.maps,
                    latitude: item.latitude?.toString() || "",
                    longitude: item.longitude?.toString() || "",
                    foto: item.fotoUrl ?? "",
                  },
                })
              }
            >
              <Text style={styles.detailText}>Detail</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: "#4A90E2",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "white",
    letterSpacing: 2,
  },
  card: {
    margin: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 180,
  },
  title: {
    fontSize: 18,
    padding: 10,
    fontWeight: "600",
  },
  detailButton: {
    backgroundColor: "#4A90E2",
    padding: 12,
    alignItems: "center",
    margin: 10,
    borderRadius: 8,
  },
  detailText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
});
