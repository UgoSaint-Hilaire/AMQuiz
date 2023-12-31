import { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, Image, SafeAreaView } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { useFirebase } from '../hooks/firebase';

interface UserData {
  id: number;
  username: string;
  profilePic: string;
  description: string;
}

const ProfileUserInfos: React.FC = () => {
  const { db, isInitialized, currentUser } = useFirebase();
  const [userData, setUserData] = useState<UserData | null>(null);

  const fetchUserData = useCallback(async () => {
    try {
      if (!isInitialized || !currentUser) return;

      const userDoc = await getDoc(doc(db, 'Users', currentUser.uid));
      if (userDoc.exists()) {
        const userDataFromDb = userDoc.data() as UserData;
        setUserData(userDataFromDb);
      }
    } catch (error) {
      console.error(error);
    }
  }, [isInitialized, currentUser, db]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);



  if (!userData) {
    return;
  }

  const USER = {
    id: userData.uid,
    nom: userData.username,
    image: userData.profilePic,
  };
  

  return (
    <SafeAreaView style={{ flex: 1, height:'100%' }}>
      <View style={{ flex: 1, alignItems: 'center', backgroundColor: '#DBE9EE', height:'100%' }}>
        <View style={styles.container}>
          <View style={styles.userProfileInfos}>
            <View style={styles.userProfileInfosText}>
              <Text style={styles.userProfileInfosTextFirstChild}>{USER.nom}</Text>
              <Text>{"\n"}</Text>
              <Text style={styles.userProfileInfosTextLastChild}>{USER.description}</Text>
            </View>
            <Image source={{ uri: USER.image }} style={styles.userProfileInfosPicture} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  userProfileInfos: {
    flexDirection: 'row',
    width: '100%',
  },
  userProfileInfosText: {
    fontSize: 24,
    width: '65%',
    paddingRight: 20,
    paddingTop: 20,
  },
  userProfileInfosTextFirstChild: {
    fontSize: 22,
  },
  userProfileInfosTextLastChild: {
    fontSize: 16,
  },
  userProfileInfosPicture: {
    display: 'flex',
    flex: 1,
    borderWidth: 2,
    aspectRatio: 1 / 1,
  },
});

export default ProfileUserInfos;
