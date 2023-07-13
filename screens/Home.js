import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  Dimensions,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { ScrollView } from "react-native-virtualized-view";
import React, { useState, useEffect, useCallback, useRef } from "react";
import Categories from "../data/db";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const { height } = Dimensions.get("window");
const orchidCategories = [
  { name: "CATTLEYA" },
  { name: "DENDROBIUM" },
  { name: "PHALAENOPSIS" },
];

const Card = ({ orchid, navigation }) => {
  const [favList, setFavList] = useState([]);
  // console.log(favList);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          let favouriteList = await AsyncStorage.getItem("favList");
          favouriteList =
            favouriteList === null ? [] : JSON.parse(favouriteList);
          setFavList(favouriteList);
          // console.log(favouriteList);
        } catch (error) {
          console.log("error");
        }
      })();
    }, [orchid])
  );

  const removeFavOrchid = () => {
    (async () => {
      try {
        let oldfavouriteList = await AsyncStorage.getItem("favList");
        let newfavouriteList = JSON.parse(oldfavouriteList);
        newfavouriteList = newfavouriteList.filter(
          (item) => item.name !== orchid.name
        );
        setFavList(newfavouriteList);
        await AsyncStorage.setItem("favList", JSON.stringify(newfavouriteList));
      } catch (error) {
        console.log(error);
      }
    })();
  };

  const addFavOrchid = () => {
    (async () => {
      try {
        let oldfavouriteList = await AsyncStorage.getItem("favList");
        let newfavouriteList;
        if (oldfavouriteList === null) {
          newfavouriteList = [];
        } else {
          newfavouriteList = JSON.parse(oldfavouriteList);
        }
        newfavouriteList.push(orchid);
        setFavList(newfavouriteList);
        await AsyncStorage.setItem("favList", JSON.stringify(newfavouriteList));
      } catch (error) {
        console.log("error");
      }
    })();
  };
  // console.log(orchid.name);
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() =>
        navigation.navigate("DetailScreen", {
          orchid: orchid,
          favList: favList,
          setFavList: setFavList,
        })
      }
    >
      <View style={styles.cardContainer}>
        <View style={styles.cardImageContainer}>
          <Image
            style={{ width: "90%", height: "90%", resizeMode: "contain" }}
            source={{
              uri: `${orchid.image}`,
            }}
          />
        </View>
        <View style={styles.cardDetailContainer}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text
              style={{ fontWeight: "bold", color: "#4d4d4d", fontSize: 20 }}
            >
              {orchid?.name}
            </Text>
            <TouchableOpacity
              style={{ zIndex: 100 }}
              onPress={() => {
                if (favList.some((item) => item.name === orchid.name)) {
                  removeFavOrchid();
                } else {
                  addFavOrchid();
                }
              }}
            >
              {favList.some((item) => item.name === orchid.name) ? (
                <Icon name="heart" size={22} color="red" />
              ) : (
                <Icon name="heart" size={22} color="#C0C0C0" />
              )}
            </TouchableOpacity>
          </View>
          <Text style={{ fontSize: 12, marginTop: 5, color: "#4d4d4d" }}>
            Rating: {orchid?.rating}
          </Text>
          <Text style={{ fontSize: 10, marginTop: 5, color: "#666666" }}>
            Price: {orchid?.price}$
          </Text>
          <View style={{ marginTop: 5, flexDirection: "row" }}>
            <Icon name="map-marker" size={18} color="#228B22" />
            <Text style={{ fontSize: 12, marginLeft: 5, color: "#666666" }}>
              Origin: {orchid?.origin}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const Home = ({ navigation }) => {
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
  const [filteredOrchids, setFilteredOrchids] = useState([]);

  const filterOrchid = (index) => {
    const currentOrchids = Categories.filter(
      (item) => item?.name?.toUpperCase() == orchidCategories[index].name
    )[0].items;
    // console.log(currentOrchids);
    setFilteredOrchids(currentOrchids);
  };

  useEffect(() => {
    filterOrchid(0);
  }, []);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F8FF" }}>
      <View style={styles.header}>
        <Icon name="sort-variant" size={28} />
        <Text style={{ color: "#228B22", fontWeight: "bold", fontSize: 16 }}>
          PHAM QUANG
        </Text>
        <TouchableOpacity
          onPress={() => {
            console.log(filteredOrchids);
          }}
        >
          <Image
            source={require("../assets/quang.jpeg")}
            style={{ height: 30, width: 30, borderRadius: 15 }}
          />
        </TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.mainContainer}>
          <View style={styles.searchInputContainer}>
            <Icon name="magnify" size={24} color="#C0C0C0" />
            <TextInput
              placeholder="Search orchid"
              style={{ flex: 1 }}
              placeholderTextColor="#C0C0C0"
            />
            <Icon name="sort-ascending" size={24} color="#C0C0C0" />
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 20,
            }}
          >
            {orchidCategories.map((item, index) => (
              <View key={"orchid" + index}>
                <TouchableOpacity
                  onPress={() => {
                    filterOrchid(index);
                    setSelectedCategoryIndex(index);
                  }}
                  style={[
                    styles.categoryBtn,
                    {
                      backgroundColor:
                        selectedCategoryIndex == index ? "#228B22" : "#FFFFFF",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryBtnName,
                      {
                        color:
                          selectedCategoryIndex == index
                            ? "#FFFFFF"
                            : "#228B22",
                      },
                    ]}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
          <View style={{ marginTop: 20 }}>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={filteredOrchids}
              renderItem={({ item }) => (
                <Card orchid={item} navigation={navigation} />
              )}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  header: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mainContainer: {
    minHeight: height,
    backgroundColor: "#D3D3D3",
    marginTop: 20,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  searchInputContainer: {
    height: 50,
    backgroundColor: "#FFFFFF",
    borderRadius: 7,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  categoryBtn: {
    height: 60,
    width: 110,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    // backgroundColor: "#228B22",
  },
  categoryBtnName: {
    fontWeight: "bold",
    // color: "#FFFAFA",
    fontSize: 12,
  },
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  cardImageContainer: {
    height: 150,
    width: 140,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F0FFF0",
    borderRadius: 20,
  },
  cardDetailContainer: {
    height: 120,
    backgroundColor: "#FFFFFF",
    flex: 1,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    padding: 20,
    justifyContent: "center",
  },
});
