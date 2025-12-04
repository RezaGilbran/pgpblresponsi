import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text, TextInput,
  View
} from "react-native";
import { db } from "../../firebase/firebaseConfig";




export default function InputPengunjung() {
  const [wisata, setWisata] = useState("");
  const [anak, setAnak] = useState("");
  const [dewasa, setDewasa] = useState("");
  const [petugas, setPetugas] = useState("");

  const hargaAnak = 10000;
  const hargaDewasa = 20000;

  const totalPendapatan =
    (Number(anak) * hargaAnak) + (Number(dewasa) * hargaDewasa);

  const today = new Date().toISOString().split("T")[0];

  const wisataList = [
    "Bukit Holbung",
    "Danau Toba",
    "Pantai Parbaba",
    "Huta Siallagan",
    "Bukit Sibea-bea",
  ];

  const saveData = async () => {
    if (!wisata || !anak || !dewasa || !petugas) {
      Alert.alert("Error", "Semua field harus diisi!");
      return;
    }

    try {
      await addDoc(collection(db, "pengunjung_harian"), {
        wisata,
        anak: Number(anak),
        dewasa: Number(dewasa),
        totalPendapatan,
        petugas,
        tanggal: today,
        createdAt: new Date().toISOString(),
      });

      Alert.alert("Berhasil", "Data pengunjung disimpan ke Firebase!");

      // RESET FORM
      setWisata("");
      setAnak("");
      setDewasa("");
      setPetugas("");

    } catch (error) {
      Alert.alert("Error", "Gagal menyimpan data!");
      console.error(error);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.container}>
        <Text style={styles.title}>Input Pengunjung Harian</Text>

        {/* PILIH WISATA */}
        <Text style={styles.label}>Nama Wisata</Text>
        <View style={styles.dropdown}>
          {wisataList.map((item, index) => (
            <Pressable
              key={index}
              style={styles.dropdownItem}
              onPress={() => setWisata(item)}
            >
              <Text style={[
                styles.dropdownText,
                wisata === item && styles.dropdownSelected
              ]}>{item}</Text>
            </Pressable>
          ))}
        </View>

        {/* ANAK */}
        <Text style={styles.label}>Jumlah Anak</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={anak}
          onChangeText={setAnak}
          placeholder="0"
        />

        {/* DEWASA */}
        <Text style={styles.label}>Jumlah Dewasa</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={dewasa}
          onChangeText={setDewasa}
          placeholder="0"
        />

        {/* PETUGAS */}
        <Text style={styles.label}>Nama Petugas</Text>
        <TextInput
          style={styles.input}
          value={petugas}
          onChangeText={setPetugas}
          placeholder="Nama petugas"
        />

        {/* TANGGAL */}
        <Text style={styles.label}>Tanggal</Text>
        <Text style={styles.dateBox}>{today}</Text>

        {/* TOTAL */}
        <Text style={styles.label}>Total Pendapatan</Text>
        <Text style={styles.total}>Rp {totalPendapatan.toLocaleString()}</Text>

        {/* SIMPAN */}
        <Pressable style={styles.button} onPress={saveData}>
          <Text style={styles.buttonText}>Simpan</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { 
    fontSize: 24, 
    fontWeight: "700", 
    marginBottom: 20,
    textAlign: "center"
  },

  label: { fontSize: 16, fontWeight: "600", marginTop: 15 },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginTop: 5,
    fontSize: 16,
  },

  dateBox: {
    backgroundColor: "#eee",
    padding: 12,
    borderRadius: 10,
    marginTop: 5,
    fontSize: 16,
  },

  total: {
    backgroundColor: "#4A90E2",
    padding: 12,
    borderRadius: 10,
    marginTop: 5,
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
  },

  button: {
    backgroundColor: "#27ae60",
    padding: 15,
    marginTop: 25,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  dropdown: {
    backgroundColor: "#f8f8f8",
    padding: 10,
    borderRadius: 10,
    marginTop: 5,
  },

  dropdownItem: { paddingVertical: 8 },

  dropdownText: { fontSize: 16 },

  dropdownSelected: { color: "#4A90E2", fontWeight: "700" },
});
