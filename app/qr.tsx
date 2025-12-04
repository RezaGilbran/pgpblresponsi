import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';

export default function QrCodeScreen() {
  const ticket = useLocalSearchParams();

  const { id, nama, anak, dewasa, total, tanggal } = ticket;

  // Data for the QR code
  const qrData = JSON.stringify({
    id,
    nama,
    dewasa,
    anak,
    total,
  });

  // URL for the QR code image from an online API
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
    qrData
  )}&size=200x200`;

  return (
    <View style={styles.container}>
      <View style={styles.ticket}>
        <Text style={styles.header}>TIKET ANDA</Text>

        <Text style={styles.wisataName}>{nama}</Text>

        {/* QR CODE */}
        <View style={styles.qrContainer}>
          <Image source={{ uri: qrCodeUrl }} style={styles.qrCode} />
        </View>

        <Text style={styles.ticketId}>{id}</Text>

        <View style={styles.details}>
          <View style={styles.row}>
            <Text style={styles.label}>Tanggal</Text>
            <Text style={styles.value}>{new Date(String(tanggal)).toLocaleDateString('id-ID')}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Dewasa</Text>
            <Text style={styles.value}>{dewasa} orang</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Anak</Text>
            <Text style={styles.value}>{anak} orang</Text>
          </View>
          <View style={[styles.row, styles.totalRow]}>
            <Text style={[styles.label, styles.totalLabel]}>Total Bayar</Text>
            <Text style={[styles.value, styles.totalValue]}>
              Rp {Number(total).toLocaleString('id-ID')}
            </Text>
          </View>
        </View>

        <Text style={styles.footer}>
          Tunjukkan QR code ini di pintu masuk.
        </Text>
      </View>

      <Pressable style={styles.backButton} onPress={() => router.replace('/(tabs)')}>
        <Text style={styles.backButtonText}>Kembali ke Home</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  ticket: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  wisataName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#555',
    marginBottom: 20,
  },
  qrContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  qrCode: {
    width: 200,
    height: 200,
  },
  ticketId: {
    fontFamily: 'monospace',
    fontSize: 14,
    color: '#888',
    marginBottom: 20,
  },
  details: {
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    color: '#666',
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginTop: 10,
    paddingTop: 10,
  },
  totalLabel: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  totalValue: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#e67e22',
  },
  footer: {
    marginTop: 20,
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  backButton: {
    marginTop: 25,
    backgroundColor: '#4A90E2',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
