import { StatusBar } from "expo-status-bar"
import {
  StyleSheet,
  Text,
  View,
  Image,
  Animated,
  Dimensions,
} from "react-native"
import React from "react"
const { width, height } = Dimensions.get("screen")

const images = {
  london:
    "https://images.pexels.com/photos/10251917/pexels-photo-10251917.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  paris:
    "https://images.pexels.com/photos/1125212/pexels-photo-1125212.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  newYork:
    "https://images.pexels.com/photos/2224861/pexels-photo-2224861.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  losAngeles:
    "https://images.pexels.com/photos/8783585/pexels-photo-8783585.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  tokyo:
    "https://images.pexels.com/photos/2385210/pexels-photo-2385210.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  bangkok:
    "https://images.pexels.com/photos/1374377/pexels-photo-1374377.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
}

const data = Object.keys(images).map((i) => ({
  key: i,
  title: i,
  image: images[i],
}))

const Tab = ({ item }) => {
  return (
    <View>
      <Text
        style={{
          color: "white",
          fontSize: (84 / data.length) * 0.75,
          fontWeight: "800",
          textTransform: "uppercase",
        }}
      >
        {item.title}
      </Text>
    </View>
  )
}

const Indicator = () => {
  return (
    <View
      style={{
        position: "absolute",
        height: 4,
        width: 100,
        backgroundColor: "white",
        bottom: -10,
      }}
    />
  )
}
const Tabs = ({ data, scrollX }) => {
  return (
    <View
      style={{
        position: "absolute",
        top: 100,
        width,
      }}
    >
      <View
        style={{
          justifyContent: "space-evenly",
          flex: 1,
          flexDirection: "row",
        }}
      >
        {data.map((item) => {
          return <Tab key={item.key} item={item} />
        })}
      </View>
      <Indicator />
    </View>
  )
}

export default function App() {
  const scrollX = React.useRef(new Animated.Value(0)).current
  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Animated.FlatList
        data={data}
        keyExtractor={(item) => item.key}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        bounces={false}
        renderItem={({ item }) => {
          return (
            <View style={{ width, height }}>
              <Image
                source={{ uri: item.image }}
                style={{ flex: 1, resizeMode: "cover" }}
              />
              <View
                style={[
                  StyleSheet.absoluteFillObject,
                  {
                    backgroundColor: "rgba(0,0,0,0.3",
                  },
                ]}
              />
              <Tabs scrollX={scrollX} data={data} />
            </View>
          )
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
})
