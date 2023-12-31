import { useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, SafeAreaView, ScrollView, FlatList, Dimensions} from 'react-native';


const ProfileUserEdit: React.FC = () => {

const screenwidth = Dimensions.get('window').width;
const screenheight = Dimensions.get('window').height;
  

interface SKILLS {
  id: number,
  nom: string,
  description: string,
  image: string
}

const SKILL = 
  {
    id: 1,
    nom: 'Nauséabombe',
    description: 'Intoxiquer vos adversaires avec les champignons du golem Tristan',
    image: 'https://static.vecteezy.com/system/resources/previews/012/629/299/original/realistic-brown-smoke-effect-png.png'
}

interface ATTAQUES {
  id: number,
  nom: string,
  description: string,
  image: string
}

const ATTAQUES = [
  {
    id:1,
    nom: 'Genjutsu de konoka',
    description: 'Genjutsu aveuglant du village caché de Konoka',
    image: 'https://media.tenor.com/6y_92TOocysAAAAC/huh-sus.gif',
  },
  {
    id:2,
    nom: 'Genjutsu de konoka',
    description: 'Genjutsu aveuglant du village caché de Konoka',
    image: 'https://media.tenor.com/6y_92TOocysAAAAC/huh-sus.gif',
  },
  {
    id:3,
    nom: 'Genjutsu de konoka',
    description: 'Genjutsu aveuglant du village caché de Konoka',
    image: 'https://media.tenor.com/6y_92TOocysAAAAC/huh-sus.gif',
  }
]

interface DEFENSES {
  id: number,
  nom: string,
  description: string,
  image: string
}
  
const DEFENSES = [
  {
    id:1,
    nom: '',
    description: '',
    image: 'https://wallpapers-clan.com/wp-content/uploads/2022/07/funny-cat-3.jpg'
  },
  {
    id:2,
    nom: '',
    description: '',
    image: 'https://wallpapers-clan.com/wp-content/uploads/2022/07/funny-cat-3.jpg'
  },
  {
    id:3,
    nom: '',
    description: '',
    image: 'https://wallpapers-clan.com/wp-content/uploads/2022/07/funny-cat-3.jpg'
  },
]

return (

  <SafeAreaView>
        <ScrollView>
        <View style={styles.container}>

          <View style={styles.skillContainer}>
              <Image source={{uri:SKILL.image}} style={{borderWidth: 2,aspectRatio: '1/1', width:screenwidth/4}}/>

              <View style={{marginLeft:20,  flex:1}}>
                  <Text style={{fontWeight:'bold', marginBottom:15, fontSize:24}}>
                      {SKILL.nom}
                  </Text>
                  <Text>
                      {SKILL.description}
                  </Text>
              </View>

          </View>    

          <View>
            <Text style={{fontWeight:'bold', marginTop:50 , fontSize:24, textAlign:'center'}}>ATTAQUES</Text>
            <View>
              <ScrollView 
              snapToInterval={screenwidth} 
              decelerationRate='fast'
              alwaysBounceHorizontal={true}
              showsHorizontalScrollIndicator={false}
              horizontal
              style={{marginTop:40}}>
              {ATTAQUES.map(item => (
                  <View key={item.nom}>
                  {/* <Text>{item.nom}</Text> */}
                  <Image
                  source={{uri:item.image}}
                  style={{
                      width: screenwidth/3,
                      aspectRatio: 1/1,  
                      resizeMode: 'cover',
                      marginRight: 30
                  }}
                  />
                  </View>
              ))}
              </ScrollView>
            </View>
          </View>    

          <View>
            <Text style={{fontWeight:'bold', marginTop:50, fontSize:24, textAlign:'center'}}>DEFENSES</Text>
            <View>
              <ScrollView 
              snapToInterval={screenwidth} 
              decelerationRate='fast'
              alwaysBounceHorizontal={true}
              showsHorizontalScrollIndicator={false}
              horizontal
              style={{marginTop:40}}>
              {DEFENSES.map(item => (
                  <View key={item.nom}>
                  {/* <Text>{item.nom}</Text> */}
                  <Image
                  source={{uri:item.image}}
                  style={{
                      width: screenwidth/3,
                      aspectRatio: 1/1,  
                      resizeMode: 'cover',
                      marginRight: 30
                  }}
                  />
                  </View>
              ))}
              </ScrollView>
            </View>
          </View>    

        
        </View>
        </ScrollView>          
    </SafeAreaView>

)}

/* Pour CSS */
const styles = StyleSheet.create({
  /* TODO */
  container: {
    width:'100%',
  },

  skillContainer: {
    marginTop:40,
    flexDirection:'row',
  }
})

export default ProfileUserEdit;