import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Pressable,
} from "react-native";
import MapView, { Marker, Region, Callout } from "react-native-maps";
import { useFocusEffect, router } from "expo-router";

import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

// -----------------------------
// TIPE DATA WISATA (FINAL)
// -----------------------------
type TWisata = {
  id: string;
  nama: string;
  deskripsi: string;
  harga: string;
  maps?: string;
  fotoUrl?: string;  // dari Firebase
  foto?: any;        // dari asset lokal
  latitude: number;
  longitude: number;
};

// -----------------------------
// DATA DEFAULT (STATIC / LOKAL)
// -----------------------------
const wisataDefault: TWisata[] = [
  {
    id: "1",
    nama: "Huta Siallagan",
    foto: require("../../assets/images/huta.jpeg"),
    deskripsi:
      "Kampung adat Batak dengan Batu Persidangan dan rumah adat Bolon.",
    harga: "Rp 10.000 - Rp 20.000",
    maps: "",
    latitude: 2.6789177,
    longitude: 98.836382,
  },
  {
    id: "2",
    nama: "Bukit Sibea-bea",
    foto: require("../../assets/images/patung.jpg"),
    deskripsi:
      "Bukit dengan patung Yesus Kristus besar dan panorama Danau Toba.",
    harga: "Rp 10.000 – Rp 20.000",
    maps: "",
    latitude: 2.4939,
    longitude: 98.6946,
  },
  {
    id: "3",
    nama: "Danau Toba",
    foto: require("../../assets/images/danautoba.jpeg"),
    deskripsi:
      "Danau kawah vulkanik terbesar di dunia dengan Pulau Samosir.",
    harga: "Rp 10.000 - Rp 20.000",
    maps: "",
    latitude: 2.7777028,
    longitude: 98.697052,
  },
  {
    id: "4",
    nama: "Bukit Holbung",
    foto: require("../../assets/images/bukitholbung.jpg"),
    deskripsi:
      "Bukit indah dengan padang rumput luas dan pemandangan Danau Toba.",
    harga: "Rp 10.000 – Rp 10.000",
    maps: "",
    latitude: 2.5539,
    longitude: 98.7742,
  },
];

// -----------------------------
// MAP SCREEN
// -----------------------------
export default function MapScreen() {
  const [wisataFirebase, setWisataFirebase] = useState<TWisata[]>([]);

  // Load dari Firestore ketika layar dibuka
  useFocusEffect(
    React.useCallback(() => {
      const loadData = async () => {
        const snap = await getDocs(collection(db, "wisata"));
        const list: TWisata[] = [];
        snap.forEach((docSnap) => {
          const data = docSnap.data() as TWisata;
          const { id, ...rest } = data; // hapus id dari Firestore

          list.push({
            id: docSnap.id, // gunakan ID asli Firestore
            ...rest,        // sisanya aman
          });
        });
        setWisataFirebase(list);
      };

      loadData();
    }, [])
  );

  const allWisata: TWisata[] = [...wisataDefault, ...wisataFirebase];

  const initialRegion: Region = {
    latitude: 2.65,
    longitude: 98.78,
    latitudeDelta: 0.8,
    longitudeDelta: 0.8,
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={initialRegion}>
        {allWisata.map((item) => (
          <Marker
            key={item.id}
            coordinate={{
              latitude: item.latitude,
              longitude: item.longitude,
            }}
          >
            <Callout
              onPress={() =>
                router.push({
                  pathname: "/detail",
                  params: {
                    id: item.id,
                    nama: item.nama,
                    deskripsi: item.deskripsi,
                    harga: item.harga,
                    maps: item.maps || "",
                    foto: item.fotoUrl || "", // kirim URL gambar firebase
                    latitude: item.latitude,
                    longitude: item.longitude,
                  },
                })
              }
            >
              <View style={styles.calloutBox}>
                {(item.fotoUrl || item.foto) && (
                  <Image
                    source={
                      item.fotoUrl
                        ? { uri: item.fotoUrl }
                        : item.foto
                    }
                    style={styles.calloutImage}
                  />
                )}

                <Text style={styles.calloutTitle}>{item.nama}</Text>

                <Text numberOfLines={2} style={styles.calloutDesc}>
                  {item.deskripsi}
                </Text>

                <Text style={styles.calloutHint}>Tap untuk lihat detail →</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      {/* TOMBOL TAMBAH WISATA */}
      <Pressable
        style={styles.addButton}
        onPress={() => router.push("/formwisata")}
      >
        <Text style={styles.addButtonText}>+</Text>
      </Pressable>
    </View>
  );
}

// -----------------------------
// STYLES
// -----------------------------
const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: "100%", height: "100%" },

  calloutBox: {
    width: 220,
    padding: 5,
  },
  calloutImage: {
    width: "100%",
    height: 100,
    borderRadius: 10,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 6,
  },
  calloutDesc: {
    fontSize: 13,
    color: "#555",
    marginTop: 4,
  },
  calloutHint: {
    marginTop: 8,
    fontSize: 12,
    color: "#4A90E2",
    fontWeight: "600",
  },

  addButton: {
    position: "absolute",
    bottom: 25,
    right: 25,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#4A90E2",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
  },
  addButtonText: {
    fontSize: 32,
    color: "#fff",
    fontWeight: "bold",
    marginTop: -4,
  },
});
