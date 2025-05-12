import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';

export default function EditNote() {
  const { noteID } = useLocalSearchParams();
  const router = useRouter();

  const [nTitle, setNTitle] = useState('');
  const [nContent, setNContent] = useState('');

  useEffect(() => {
    if (noteID) {
        axios.post('http://127.0.0.1:8000/apinote/', {
            action: 'getnote',
            noteID,
        }).then((res) => {
            if (res.data && res.data.data) {
                const notes = res.data.data;
                // Хүссэн тэмдэглэлийг авна (жишээ нь, noteID-тай)
                const currentNote = notes.find(note => note.noteID == noteID);
                if (currentNote) {
                    setNTitle(currentNote.nTitle);
                    setNContent(currentNote.nContent);
                }
            }
            console.log('==== Хариу ====');
            console.log(res.data);
        }).catch(console.error);
    }
}, [noteID]);


  const saveNote = async () => {
    await axios.post('http://127.0.0.1:8000/apinote/', {
      action: 'editnote',  // Тэмдэглэл засах
      noteID,
      nTitle,
      nContent,
    });
    router.push('/');  // Зассан тэмдэглэлийг хадгалаад гол хуудсанд шилжих
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Тэмдэглэл засах</Text>
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
