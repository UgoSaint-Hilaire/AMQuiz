import React from 'react';
import { StyleSheet, View, Text, Dimensions, Modal, TouchableHighlight, Image } from 'react-native';

interface ChestUnboxProps {
  imageUrl: string | null;
  onClose: () => void;
}

const screenwidth: number = Dimensions.get('window').width;
const screenheight: number = Dimensions.get('window').height;

const ChestUnbox: React.FC<ChestUnboxProps> = ({ imageUrl, onClose }) => {
  return (
    <Modal 
      visible={!!imageUrl} 
      animationType="none"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.mainContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.text}>Nouvelle image débloquée !</Text>
          <View style={styles.imageContainer}>
            {imageUrl && (
              <Image 
                style={styles.image}
                source={{ uri: imageUrl }} 
              />
            )}
          </View>
          <View style={styles.buttonContainer}>
            <TouchableHighlight 
              style={styles.button} 
              underlayColor="#4F6D7A"
              onPress={onClose}
            >
              <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Fermer</Text>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    alignItems: 'center',
    flex: 0,
  },
  modalContent: {
    paddingTop: '25%',
    width: screenwidth,
    height: screenheight - 150,
    backgroundColor: '#DBE9EE',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 20,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: screenwidth * 0.7,
    aspectRatio: 1 / 1,
  },
  buttonContainer: {
    alignSelf: 'center',
    marginTop: 20,
  },
  button: {
    width: 200,
    paddingVertical: 15,
    borderRadius: 8,
    backgroundColor: '#4F6D7A',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChestUnbox;
