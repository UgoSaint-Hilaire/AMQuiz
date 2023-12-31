import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, SafeAreaView, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFirebase } from '../hooks/firebase';
import { collection, getDocs, query, where, getDoc, doc, updateDoc } from 'firebase/firestore';
import ProfilScreen from '../screens/ProfileScreen';

const ProfileImgSelector: React.FC = () => {
  const [images, setImages] = useState<string[]>([]);
  const { db, isInitialized, currentUser } = useFirebase();
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserPics = async () => {
      if (!isInitialized || !currentUser) return;

      const userId = currentUser?.uid ?? null;
      const userPics: string[] = [];
      const fetchedImagesUrl: string[] = [];

      const userDoc = await getDoc(doc(db, "Users", userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();

        if (userData && userData.userPics) {
          userPics.push(...userData.userPics);
        }
      }

      const picQuery2 = query(collection(db, 'Pictures'), where('id', 'in', userPics));
      const picDocs2 = await getDocs(picQuery2);

      picDocs2.forEach((picDoc2) => {
        if (picDoc2.exists()) {
          const picData = picDoc2.data();
          if (picData && picData.url) {
            fetchedImagesUrl.push(picData.url);
          }
        }
      });

      setImages(fetchedImagesUrl);
    };

    fetchUserPics();
  }, [isInitialized, currentUser, db]);


  const [profilePicUpdated, setProfilePicUpdated] = useState(false);
  const updateProfilePic = async (imageUrl: string) => {
    if (!currentUser) return;

    const userId = currentUser.uid;
    const userRef = doc(db, 'Users', userId);

    try {
      await updateDoc(userRef, {
        profilePic: imageUrl, 
      });
      setProfilePicUpdated(true);
      console.log('Image de profil mise à jour ');
      navigation.navigate('Profile');
    } catch (error) {
      console.error('Erreur lors du changement de l\'image de profil :', error);
    }
  };

  const screenwidth = Dimensions.get('window').width;

  const renderItem = ({ item }: { item: string }) => (
    <TouchableOpacity key={item} onPress={() => updateProfilePic(item)}>
      <Image
        source={{ uri: item }}
        style={{
          width: screenwidth / 3,
          aspectRatio: 1 / 1,
          resizeMode: 'cover',
          marginRight: 30,
        }}
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView>
      <FlatList
        horizontal
        data={images}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    margin: 'auto',
    marginTop: 40,
  },
});

export default ProfileImgSelector;
