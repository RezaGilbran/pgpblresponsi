import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

import { uploadToCloudinary } from "../firebase/cloudinary";

export default function FormWisata() {
  const [nama, setNama] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [harga, setHarga] = useState("");
  const [maps, setMaps] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [foto, setFoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      setFoto(result.assets[0].uri);
    }
  };

  const saveData = async () => {
    if (!nama || !deskripsi || !harga || !lat || !lng) {
      Alert.alert("Error", "Semua field wajib diisi!");
      return;
    }

    if (!foto) {
      Alert.alert("Error", "Pilih gambar terlebih dahulu!");
      return;
    }

    try {
      setLoading(true);

      const fotoUrl = await uploadToCloudinary(foto);

      if (!fotoUrl) {
        Alert.alert("Upload gagal", "Gambar tidak dapat diupload.");
        return;
      }

      await addDoc(collection(db, "wisata"), {
        nama,
        deskripsi,
        harga,
        maps,
        latitude: parseFloat(lat),
        longitude: parseFloat(lng),
        fotoUrl,
        createdAt: new Date().toISOString(),
      });

      Alert.alert("Sukses!", "Wisata berhasil ditambahkan.");
      router.back();
    } catch (err) {
      console.error("🔥 ERROR:", err);
      Alert.alert("Error", "Gagal menyimpan data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={80} 
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Tambah Wisata Baru</Text>

        {/* IMAGE PICKER */}
        <Pressable style={styles.imagePicker} onPress={pickImage}>
          {foto ? (
            <Image source={{ uri: foto }} style={styles.imagePreview} />
          ) : (
            <Text style={styles.imageText}>Pilih Gambar</Text>
          )}
        </Pressable>

        {/* INPUT FIELDS */}
        <TextInput
          style={styles.input}
          placeholder="Nama Wisata"
          placeholderTextColor="#888"
          value={nama}
          onChangeText={setNama}
        />

        <TextInput
          style={[styles.input, { height: 110 }]}
          placeholder="Deskripsi"
          placeholderTextColor="#888"
          multiline
          value={deskripsi}
          onChangeText={setDeskripsi}
        />

        <TextInput
          style={styles.input}
          placeholder="Harga Tiket"
          placeholderTextColor="#888"
          value={harga}
          onChangeText={setHarga}
        />

        <TextInput
          style={styles.input}
          placeholder="Google Maps (opsional)"
          placeholderTextColor="#aaa"
          value={maps}
          onChangeText={setMaps}
        />

        {/* 🔥 Latitude hanya angka */}
        <TextInput
          style={styles.input}
          placeholder="Latitude"
          placeholderTextColor="#888"
          keyboardType="numeric"
          value={lat}
          onChangeText={(text) => {
            const clean = text.replace(/[^0-9.-]/g, "");
            setLat(clean);
          }}
        />

        {/* 🔥 Longitude hanya angka */}
        <TextInput
          style={styles.input}
          placeholder="Longitude"
          placeholderTextColor="#888"
          keyboardType="numeric"
          value={lng}
          onChangeText={(text) => {
            const clean = text.replace(/[^0-9.-]/g, "");
            setLng(clean);
          }}
        />

        {/* BUTTON SIMPAN */}
        <Pressable
          style={[styles.button, loading && { opacity: 0.6 }]}
          onPress={saveData}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Menyimpan..." : "Simpan"}
          </Text>
        </Pressable>

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f7fa" },

  title: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 24,
    color: "#222",
  },

  imagePicker: {
    height: 220,
    backgroundColor: "#fafafa",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 18,
    marginBottom: 24,

    shadowColor: "#000",
    shadowOpacity: 0.09,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },

  imagePreview: {
    width: "100%",
    height: "100%",
    borderRadius: 18,
    resizeMode: "cover",
  },

  imageText: {
    color: "#999",
    fontSize: 16,
  },

  input: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    marginBottom: 16,
    fontSize: 16,
    color: "#000",

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },

  button: {
    backgroundColor: "#4A90E2",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",

    shadowColor: "#4A90E2",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
