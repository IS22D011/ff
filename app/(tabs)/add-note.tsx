import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';

export default function AddNote() {
  const [nTitle, setNTitle] = useState('');
  const [nContent, setNContent] = useState('');
  const router = useRouter();

  const saveNote = async () => {
    await axios.post('http://127.0.0.1:8000/apinote/', {
      action: 'addnote',  // Тэмдэглэл нэмэх хүсэлт
      nTitle,
      nContent,
    });
    router.push('/');  // Хадгалаад гол хуудсанд шилжих
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Шинэ тэмдэглэл</Text>
      <TextInput
        placeholder="Гарчиг"
        style={styles.input}
        value={nTitle}
        onChangeText={setNTitle}
      />
      <TextInput
        placeholder="Агуулга"
        style={[styles.input, { height: 120 }]}
        value={nContent}
        onChangeText={setNContent}
        multiline
      />
      <Button title="Хадгалах" onPress={saveNote} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: {
    borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15,
    borderRadius: 8, backgroundColor: '#f2f2f2'
  },
});
