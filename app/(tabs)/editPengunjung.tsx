import { useLocalSearchParams, router } from "expo-router";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
  ScrollView,
} from "react-native";

export default function EditPengunjung() {
  const params = useLocalSearchParams();

  const [wisata, setWisata] = useState(params.wisata as string);
  const [anak, setAnak] = useState(String(params.anak));
  const [dewasa, setDewasa] = useState(String(params.dewasa));
  const [petugas, setPetugas] = useState(params.petugas as string);

  const submitEdit = async () => {
    try {
      await updateDoc(doc(db, "pengunjung_harian", params.id as string), {
        wisata,
        anak: Number(anak),
        dewasa: Number(dewasa),
        petugas,
      });

      Alert.alert("Berhasil", "Data berhasil diperbarui!", [
        {
          text: "OK",
          onPress: () => {
            // Cek apakah bisa kembali
            if (router.canGoBack()) {
              router.back();
            } else {
              // Arahkan ke halaman list pengunjung (path valid)
              router.replace("/(tabs)/listPengunjung");
            }
          },
        },
      ]);

    } catch (err) {
      Alert.alert("Error", "Gagal update data!");
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.title}>Edit Data Pengunjung</Text>

      <Text style={styles.label}>Wisata</Text>
      <TextInput
        style={styles.input}
        value={wisata}
        onChangeText={setWisata}
        placeholder="Nama wisata"
        placeholderTextColor="#999"
      />

      <Text style={styles.label}>Jumlah Anak</Text>
      <TextInput
        style={styles.input}
        value={anak}
        onChangeText={setAnak}
        keyboardType="numeric"
        placeholder="0"
        placeholderTextColor="#999"
      />

      <Text style={styles.label}>Jumlah Dewasa</Text>
      <TextInput
        style={styles.input}
        value={dewasa}
        onChangeText={setDewasa}
        keyboardType="numeric"
        placeholder="0"
        placeholderTextColor="#999"
      />

      <Text style={styles.label}>Petugas</Text>
      <TextInput
        style={styles.input}
        value={petugas}
        onChangeText={setPetugas}
        placeholder="Nama petugas"
        placeholderTextColor="#999"
      />

      <Pressable style={styles.saveBtn} onPress={submitEdit}>
        <Text style={styles.saveText}>Simpan Perubahan</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 20,
    color: "#222",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    padding: 14,
    borderRadius: 12,
    marginTop: 5,
    backgroundColor: "#fff",
    color: "#000",
    fontSize: 16,
  },
  saveBtn: {
    marginTop: 30,
    backgroundColor: "#27ae60",
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
    elevation: 2,
  },
  saveText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
  },
});
