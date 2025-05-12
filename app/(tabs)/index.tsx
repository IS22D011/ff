import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Button } from 'react-native';
import { useState, useCallback } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import axios from 'axios';

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const API_URL = 'http://127.0.0.1:8000/apinote/';

  const fetchNotes = async () => {
    try {
      const res = await axios.post(API_URL, { action: 'getnote' });
      console.log('Ирсэн өгөгдөл:', res.data); 
      if (res.data && Array.isArray(res.data.data)) {
        setNotes(res.data.data);
      } else {
        setNotes([]);
        console.warn('Ирсэн өгөгдөл буруу форматтай байна');
      }
    } catch (e) {
      console.log('Алдаа:', e.message);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchNotes();
    }, [])
  );

  const filteredNotes = notes.filter((note) =>
    note.nTitle?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Тэмдэглэлүүд ачааллаж байна...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📝 Миний тэмдэглэлүүд</Text>

      <TextInput
        style={styles.search}
        placeholder="🔍 Хайлт хийх..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholderTextColor="#888"
      />

      <Button title="➕ Шинэ тэмдэглэл нэмэх" onPress={() => router.push('/add-note')} />

      <FlatList
        data={filteredNotes}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        keyExtractor={(item, index) =>
          item.noteID ? item.noteID.toString() : index.toString()
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.nTitle}</Text>
            <Text style={styles.cardContent} numberOfLines={4}>
              {item.nContent}
            </Text>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() =>
                  router.push({
                    pathname: '/edit/[noteID] ',
                    params: { noteID: item.noteID },
                  })
                }
              >
                <Text style={styles.buttonText}>✏️ Засах</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={async () => {
                  try {
                    await axios.post(API_URL, { action: 'deletenote', noteID: item.noteID });
                    fetchNotes(); 
                  } catch (err) {
                    console.error('Устгах үед алдаа:', err);
                  }
                }}
              >
                <Text style={styles.buttonText}>🗑 Устгах</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ marginTop: 20, textAlign: 'center' }}>
            Одоогоор тэмдэглэл алга байна.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: '#fff' },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  search: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#f0f0f0',
  },
  card: {
    width: '48%',
    backgroundColor: '#fffefc',
    padding: 15,
    marginBottom: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
    color: '#333',
  },
  cardContent: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  deleteButton: {
    backgroundColor: '#f44336',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
