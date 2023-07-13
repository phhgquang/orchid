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
  Alert,
} from "react-native";
import { ScrollView } from "react-native-virtualized-view";
import React, { useState, useCallback } from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const { height } = Dimensions.get("window");

const Favorites = ({ navigation }) => {
  const [favList, setFavList] = useState([]);

  const removeAllStorage = async () => {
    Alert.alert("Are you sure?", "You are removing all your favorite", [
      {
        text: "No",
        onPress: () => {},
        style: "destructive",
      },
      {
        text: "Yes",
        onPress: () => {
          deleteAllItem();
        },
      },
    ]);
  };

  deleteAllItem = () => {
    (async () => {
      try {
        let newfavouriteList = [];
        setFavList([]);
        await AsyncStorage.setItem("favList", JSON.stringify(newfavouriteList));
      } catch (error) {
        console.log(error);
      }
    })();
  };

  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          let favouriteList = await AsyncStorage.getItem("favList");
          favouriteList =
            favouriteList === null ? [] : JSON.parse(favouriteList);
          // console.log(favouriteList);
          setFavList(favouriteList);
        } catch (error) {
          console.log("error");
        }
      })();
    }, [])
  );
  const removeFavOrchid = (orchid) => {
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
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F8FF" }}>
      <View style={styles.header}>
        <Icon name="sort-variant" size={28} />
        <Text style={{ color: "#228B22", fontWeight: "bold", fontSize: 16 }}>
          PHAM QUANG
        </Text>
        <TouchableOpacity
          onPress={() => {
            console.log(favList);
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
          {favList.length === 0 ? (
            <>
              <View style={styles.emptyContainer}>
                <Image
                  style={styles.emptyImage}
                  source={require("../assets/empty.png")}
                />
                <Text style={styles.emptyText}>
                  What is your favorite Orchid?
                </Text>
              </View>
            </>
          ) : (
            <>
              <View style={{ marginTop: 20 }}>
                <TouchableOpacity
                  style={{ marginLeft: 5, paddingBottom: 10 }}
                  onPress={() => {
                    removeAllStorage();
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      color: "rgba(0, 0, 0, 0.5)",
                      marginBottom: 10,
                    }}
                  >
                    Clear all
                  </Text>
                </TouchableOpacity>
                <FlatList
                  showsVerticalScrollIndicator={false}
                  data={favList}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() =>
                        navigation.navigate("DetailScreen", {
                          orchid: item,
                          favList: favList,
                          setFavList: setFavList,
                        })
                      }
                    >
                      <View style={styles.cardContainer}>
                        <View style={styles.cardImageContainer}>
                          <Image
                            style={{
                              width: "90%",
                              height: "90%",
                              resizeMode: "contain",
                            }}
                            source={{
                              uri: `${item?.image}`,
                            }}
                          />
                        </View>
                        <View style={styles.cardDetailContainer}>
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                            }}
                          >
                            <Text
                              style={{
                                fontWeight: "bold",
                                color: "#4d4d4d",
                                fontSize: 20,
                              }}
                            >
                              {item?.name}
                            </Text>
                            <TouchableOpacity
                              style={{ zIndex: 100 }}
                              onPress={() => {
                                removeFavOrchid(item);
                              }}
                            >
                              {favList.some(
                                (orchid) => orchid.name === item?.name
                              ) ? (
                                <Icon name="heart" size={22} color="red" />
                              ) : (
                                <Icon name="heart" size={22} color="#C0C0C0" />
                              )}
                            </TouchableOpacity>
                          </View>
                          <Text
                            style={{
                              fontSize: 12,
                              marginTop: 5,
                              color: "#4d4d4d",
                            }}
                          >
                            Rating: {item?.rating}
                          </Text>
                          <Text
                            style={{
                              fontSize: 10,
                              marginTop: 5,
                              color: "#666666",
                            }}
                          >
                            Price: {item?.price}$
                          </Text>
                          <View style={{ marginTop: 5, flexDirection: "row" }}>
                            <Icon name="map-marker" size={18} color="#228B22" />
                            <Text
                              style={{
                                fontSize: 12,
                                marginLeft: 5,
                                color: "#666666",
                              }}
                            >
                              Origin: {item?.origin}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Favorites;

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
  emptyContainer: {
    height: 500,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyImage: {
    height: "40%",
    width: "50%",
  },
  emptyText: {
    color: "green",
    fontSize: 20,
    fontFamily: "Chalkboard SE",
  },
});
