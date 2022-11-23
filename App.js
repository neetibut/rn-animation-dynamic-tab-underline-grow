import { StatusBar } from "expo-status-bar"
import {
  findNodeHandle,
  StyleSheet,
  Text,
  View,
  Image,
  Animated,
  Dimensions,
  TouchableOpacity,
} from "react-native"
import React, { useRef, createRef } from "react"
const { width, height } = Dimensions.get("screen")

const images = {
  london:
    "https://images.pexels.com/photos/10251917/pexels-photo-10251917.jpeg",
  paris: "https://images.pexels.com/photos/1125212/pexels-photo-1125212.jpeg",
  newyork: "https://images.pexels.com/photos/2224861/pexels-photo-2224861.png",
  losangeles:
    "https://images.pexels.com/photos/8783585/pexels-photo-8783585.jpeg",
  tokyo: "https://images.pexels.com/photos/2385210/pexels-photo-2385210.jpeg",
  bangkok: "https://images.pexels.com/photos/1374377/pexels-photo-1374377.jpeg",
}

const data = Object.keys(images).map((i) => ({
  key: i,
  title: i,
  image: images[i],
  ref: React.createRef(),
}))

const Tab = React.forwardRef(({ item, onItemPress }, ref) => {
  return (
    <TouchableOpacity onPress={onItemPress}>
      <View style={{ paddingHorizontal: 6, marginHorizontal: 4 }} ref={ref}>
        <Text
          style={{
            textTransform: "uppercase",
            fontSize: 76 / (data.length * 1.4),
            fontWeight: "700",
            color: "#fff",
          }}
        >
          {item.title}
        </Text>
      </View>
    </TouchableOpacity>
  )
})

const Indicator = React.memo(({ data, measures, scrollX }) => {
  const inputRange = data.map((_, index) => index * width)
  const translateX = scrollX.interpolate({
    inputRange,
    outputRange: data.map((_, index) => measures[index]?.x || 0),
  })
  const itemWidth = scrollX.interpolate({
    inputRange,
    outputRange: data.map((_, index) => measures[index]?.width || 0),
  })

  return (
    <Animated.View
      style={{
        height: 3,
        width: itemWidth,
        backgroundColor: "#fff",
        position: "absolute",
        bottom: -6,
        transform: [{ translateX: translateX }],
      }}
    />
  )
})

const Tabs = ({ data, scrollX, onItemPress }) => {
  const [measures, setMeasures] = React.useState([])
  const tabContainerRef = React.useRef()

  React.useEffect(() => {
    // const measures = [];
    let m = []
    data.forEach((item, index) => {
      item.ref.current.measureLayout(
        findNodeHandle(tabContainerRef.current),
        (x, y, width, height) => {
          m.push({
            x,
            y,
            width,
            height,
          })
          // Last item was measured. Set the state with all measures
          if (m.length === data.length) {
            setMeasures(m)
          }
        }
      )
    })
  }, [])

  return (
    <View
      style={{
        justifyContent: "center",
        position: "absolute",
        top: 100,
        width: width,
        left: 0,
      }}
    >
      <View
        style={{ flexDirection: "row", justifyContent: "center" }}
        ref={tabContainerRef}
      >
        {data.map((item, index) => {
          return (
            <Tab
              key={item.key}
              item={item}
              ref={item.ref}
              onItemPress={() => onItemPress(index)}
            />
          )
        })}
      </View>
      {measures.length === data.length && (
        <Indicator measures={measures} data={data} scrollX={scrollX} />
      )}
    </View>
  )
}

export default function App() {
  const scrollX = React.useRef(new Animated.Value(0)).current
  const ref = React.useRef()
  const onItemPress = React.useCallback((itemIndex) => {
    ref?.current?.scrollToOffset({
      offset: itemIndex * width,
    })
  })
  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <StatusBar hidden />
      <Animated.FlatList
        ref={ref}
        bounces={false}
        data={data}
        scrollEventThrottle={32}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          {
            useNativeDriver: false,
          }
        )}
        keyExtractor={(item) => item.key}
        pagingEnabled
        horizontal
        renderItem={({ item, index }) => {
          return (
            <View>
              <Image
                source={{ uri: item.image }}
                style={{ width, height, resizeMode: "cover" }}
              />
              <View
                style={[
                  StyleSheet.absoluteFillObject,
                  { backgroundColor: "#000", opacity: 0.5 },
                ]}
              />
            </View>
          )
        }}
      />
      <Tabs data={data} scrollX={scrollX} onItemPress={onItemPress} />
    </View>
  )
}
