import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { useCallback, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { db } from "../../firebase/firebaseConfig";


export default function ListPengunjung() {
  const [data, setData] = useState([]);

  const loadData = async () => {
    const querySnapshot = await getDocs(collection(db, "pengunjung_harian"));
    const list: any = [];
    querySnapshot.forEach(docSnap => {
      list.push({ id: docSnap.id, ...docSnap.data() });
    });
    setData(list);
  };

  // 🔥 Perbaikan: refresh data setiap kali screen aktif
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const deleteData = (id: string) => {
    Alert.alert(
      "Hapus Data",
      "Yakin ingin menghapus data ini?",
      [
        { text: "Batal" },
        { 
          text: "Hapus", 
          style: "destructive",
          onPress: async () => {
            await deleteDoc(doc(db, "pengunjung_harian", id));
            loadData(); // refresh setelah hapus
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
      <Text style={styles.title}>Data Pengunjung Harian</Text>

      {data.map((item: any) => (
        <View key={item.id} style={styles.card}>
          <Text style={styles.label}>Wisata: <Text style={styles.value}>{item.wisata}</Text></Text>
          <Text style={styles.label}>Anak: <Text style={styles.value}>{item.anak}</Text></Text>
          <Text style={styles.label}>Dewasa: <Text style={styles.value}>{item.dewasa}</Text></Text>
          <Text style={styles.label}>Pendapatan: <Text style={styles.value}>Rp {item.totalPendapatan?.toLocaleString()}</Text></Text>
          <Text style={styles.label}>Petugas: <Text style={styles.value}>{item.petugas}</Text></Text>
          <Text style={styles.label}>Tanggal: <Text style={styles.value}>{item.tanggal}</Text></Text>

          <View style={styles.buttonRow}>
            <Pressable 
              style={styles.editBtn}
              onPress={() => 
                router.push({
                  pathname: "/(tabs)/editPengunjung",
                  params: {
                    id: item.id,
                    wisata: item.wisata,
                    anak: item.anak,
                    dewasa: item.dewasa,
                    petugas: item.petugas
                  }
                })
              }
            >
              <Text style={styles.btnText}>Edit</Text>
            </Pressable>

            <Pressable 
              style={styles.deleteBtn}
              onPress={() => deleteData(item.id)}
            >
              <Text style={styles.btnText}>Hapus</Text>
            </Pressable>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "700",
    padding: 20
  },
  card: {
    backgroundColor: "#f5f5f5",
    marginHorizontal: 15,
    marginBottom: 15,
    padding: 20,
    borderRadius: 12
  },
  label: { fontSize: 16, fontWeight: "600" },
  value: { fontWeight: "400" },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15
  },
  editBtn: {
    backgroundColor: "#2980b9",
    padding: 12,
    borderRadius: 10,
    width: "48%",
    alignItems: "center"
  },
  deleteBtn: {
    backgroundColor: "#c0392b",
    padding: 12,
    borderRadius: 10,
    width: "48%",
    alignItems: "center"
  },
  btnText: { color: "#fff", fontWeight: "700" }
});
