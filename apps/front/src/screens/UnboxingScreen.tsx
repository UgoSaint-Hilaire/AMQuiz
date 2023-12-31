import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, SafeAreaView, Image, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { doc, getDoc } from 'firebase/firestore';
import { useFirebase } from '../hooks/firebase';
import { useMutation } from 'react-query';
import { postUnboxChests } from '../api/endpoints';
import ChestUnbox from '../components/ChestUnbox';
import ChestUnboxLoading from '../components/ChestUnboxLoading';




export default function OuvertureScreen() {
  const screenwidth: number = Dimensions.get('window').width;
  const screenheight: number = Dimensions.get('window').height;

  const [imageDebloquee, setImageDebloquee] = useState<string | null>(null);
  const [chests, setchests] = useState("");
  const [isGifComplete, setIsGifComplete] = useState(false);

  const { db, isInitialized, currentUser } = useFirebase();

  const fetchUserData = useCallback(async () => {
    try {
      if (!isInitialized || !currentUser) return;

      const userDoc = await getDoc(doc(db, 'Users', currentUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        let nbrChests = userData.comChestCount;
        setchests(nbrChests);
      }
    } catch (error) {
      console.error('Error fetching user data', error);
    }
  }, [isInitialized, currentUser, db]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]); 

  const { mutate: unlockChest, isLoading: isUnlockingChest } = useMutation(postUnboxChests, {
    onSuccess: async (data: any) => {
      console.log(data);

      await new Promise(resolve => setTimeout(resolve, 2000));

      if (data.data && data.data.newPicUrl) {
        setImageDebloquee(data.data.newPicUrl);
      } else {
        console.log('Aucune image débloquée ou structure de réponse incorrecte.');
      }

      setIsGifComplete(true);
      fetchUserData(); // Mettre le nombre d coffre à jour après fermeture de la modal
    },
    onError: (error) => {
      console.error('Erreur lors du déblocage de l\'image', error);
    }
  });

  const handleCloseModal = () => {
    setImageDebloquee(null);
    setIsGifComplete(false);
    fetchUserData(); // Mettre le nombre d coffre à jour après fermeture de la modal
  };

  return (
    <SafeAreaView>
      <View style={{ backgroundColor: '#DBE9EE', height: screenheight, display: 'flex', alignItems: 'center' }}>
        <View style={styles.mainContainer}>
          <Text style={styles.text}>Nombre de coffres à ouvrir : {chests}</Text>

          <FlatList
            data={Array.from({ length: chests }, (_, index) => index + 1)}
            renderItem={({ item }) => (
              <View key={item} style={{ width: screenwidth * 0.9, height: screenwidth * 0.8 }}>

                <Image
                  source={{ uri: 'https://media.discordapp.net/attachments/1176111895548285038/1186721190883106928/coffreCommun.png?ex=659d81bc&is=658b0cbc&hm=6d5a21d082e2978e6aeeff903dab38e98f04ab00bf44220de917f5ef1a1ef122&=&format=webp&quality=lossless' }}
                  style={{
                    width: '100%',
                    height: '90%',
                    aspectRatio: 1 / 1,
                  }}
                />

                <TouchableOpacity
                  onPress={() => unlockChest()}
                >
                  {isUnlockingChest ? (
                    <ChestUnboxLoading />
                  ) : (
                    <View>
                      <Text style={styles.button}>Débloquer</Text>
                    </View>
                  )}
                </TouchableOpacity>

              </View>
            )}
            keyExtractor={(item) => item.toString()}
            horizontal
            pagingEnabled
            scrollEnabled
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.flatListContainer}
          />

          {isGifComplete && (
            <ChestUnbox imageUrl={imageDebloquee} onClose={handleCloseModal} />
          )}

        </View>
      </View>
    </SafeAreaView>
  );
}



const styles = StyleSheet.create({
  mainContainer: {
    marginTop: '30%',
    width: '90%',
    flex: 1,
  },
  text: {
    fontSize: 22,
    fontWeight: 'Bold',
    marginBottom: 40,
    textAlign: 'center'
  },
  flatListContainer: {
    width: '100%',
  },
  button: {
    alignSelf: 'center',
    flex: 1,
    marginTop: 20,
    width: 200,
    paddingVertical: 30,
    borderRadius: 8,
    backgroundColor: "#4F6D7A",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    border: 'none',
    height: 50,
    textAlign: 'center'
  },
});
