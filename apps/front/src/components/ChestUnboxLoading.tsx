import { StyleSheet, View, Dimensions, Image, Modal } from 'react-native';


const ChestUnboxLoading: React.FC = () => {

const screenwidth = Dimensions.get('window').width;
const screenheight = Dimensions.get('window').height;


return (

    <Modal visible={true} style={{height:screenheight}}>
      <View style={styles.mainContainer}>
        <Image
          style={{ width: screenwidth * 0.7, aspectRatio: 1 / 1 }}
          source={{
            uri:
              'https://media.discordapp.net/attachments/1176111895548285038/1186721936575836160/02_common.gif?ex=659d826d&is=658b0d6d&hm=a5fa5ecebadfd75c7a6b86433fe4c47181ef0854d2cfb7b122ca623152fef5b9&',
          }}
        />
      </View>
    </Modal>

)
}

    
const styles = StyleSheet.create({
  mainContainer: {
    paddingTop: '25%',
    width:'100%',
    backgroundColor: "#DBE9EE",
    flex:1,
    justifyContent:'center',
    alignContent:'center',
    alignItems:'center',
  },
})


export default ChestUnboxLoading;