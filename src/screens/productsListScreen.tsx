import React from 'react'
import { list } from '../data'
import CardComponent from '../components/cardComponent'
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

type Props = {}

const ProductsListScreen = ({ navigation }) => {

  function navigateWithData(item) {
    navigation.navigate('Details', {
      itemData: item
    })
  }

  return (
    // <SafeAreaView>
    <View style={{ backgroundColor: 'white' }} >
      <FlatList
        data={list}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigateWithData(item)} >
            <View style={styles.item}>
              <Image source={{ uri: item.image }} style={styles.image} />
              <View style={{ flex: 1 }} >
                <Text numberOfLines={1} ellipsizeMode='tail' style={styles.name}>{item.name}</Text>
                <Text style={styles.price}>${item.price}</Text>
                <Text style={styles.type}>{item.type}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}

      />
    </View>
    //   </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  item: {
    display: 'flex',
    flexDirection: 'row',
    gap: 31,
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: '#f0ece1',
    // borderWidth:0.5,
    // borderColor:'#c7c7c7',
    elevation: 5,
    borderRadius: 15,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  name: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    width: '100%'
  },
  price: {
    fontSize: 16,
    color: 'green',
  },
  type: {
    fontSize: 14,
    color: '#555',
  },
});

export default ProductsListScreen