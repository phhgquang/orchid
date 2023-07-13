import {
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import { LogBox } from "react-native";

// LogBox.ignoreLogs([
//   "Non-serializable values were found in the navigation state",
// ]);

const Detail = ({ navigation, route }) => {
  const { orchid, favList, setFavList } = route.params;
  const [favDetailList, setFavDetailList] = useState(favList);
  console.log(favList);

  const addToFavourite = () => {
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
        console.log(newfavouriteList);
        setFavList(newfavouriteList);
        setFavDetailList(newfavouriteList);
        await AsyncStorage.setItem("favList", JSON.stringify(newfavouriteList));
      } catch (error) {
        console.log("error");
      }
    })();
  };

  const removeFromFavourite = () => {
    (async () => {
      try {
        let oldfavouriteList = await AsyncStorage.getItem("favList");
        let newfavouriteList = JSON.parse(oldfavouriteList);
        newfavouriteList = newfavouriteList.filter(
          (item) => item.name !== orchid.name
        );
        console.log(newfavouriteList);
        setFavList(newfavouriteList);
        setFavDetailList(newfavouriteList);
        await AsyncStorage.setItem("favList", JSON.stringify(newfavouriteList));
      } catch (error) {
        console.log(error);
      }
    })();
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <StatusBar backgroundColor="#FFFFFF" />
      <View style={{ height: 400, backgroundColor: "#D3D3D3" }}>
        <ImageBackground
          resizeMode="contain"
          style={{ height: 280, top: 20 }}
          source={{
            uri: `${orchid?.image}`,
          }}
        >
          <View style={styles.header}>
            <Icon
              name="arrow-left"
              size={28}
              color="#4d4d4d"
              onPress={() => navigation.goBack()}
            />
            <Icon name="dots-vertical" size={28} color="#4d4d4d" />
          </View>
        </ImageBackground>
        <View style={styles.detailContainer}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text
              style={{ fontSize: 20, color: "#4d4d4d", fontWeight: "bold" }}
            >
              {orchid?.name}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 5,
            }}
          >
            <Text style={{ fontSize: 12, color: "#4d4d4d" }}>
              Rating: {orchid?.rating}
            </Text>
            <Text style={{ fontSize: 12, color: "#4d4d4d" }}>
              Price: {orchid?.price}$
            </Text>
          </View>
          <View style={{ marginTop: 5, flexDirection: "row" }}>
            <Icon name="map-marker" size={20} color="#228B22" />
            <Text style={{ fontSize: 14, marginLeft: 5, color: "#666666" }}>
              Origin: {orchid?.origin}
            </Text>
          </View>
        </View>
      </View>
      <View style={{ marginTop: 80, justifyContent: "space-between", flex: 1 }}>
        <View>
          <View style={{ flexDirection: "row", paddingHorizontal: 20 }}>
            <Image
              source={require("../assets/quang.jpeg")}
              style={{ height: 40, width: 40, borderRadius: 20 }}
            />
            <View style={{ flex: 1, paddingLeft: 10, height: 20 }}>
              <Text
                style={{ color: "#4d4d4d", fontSize: 12, fontWeight: "bold" }}
              >
                PHAM QUANG
              </Text>
              <Text
                style={{
                  color: "#666666",
                  fontSize: 11,
                  fontWeight: "bold",
                  marginTop: 2,
                }}
              >
                Owner
              </Text>
            </View>
            <Text style={{ color: "#666666", fontSize: 12 }}>Jul 10, 2023</Text>
          </View>
          <Text style={styles.comment}>
            My job requires moving to another country. I don't have the
            oppotunity to take care of them. I am looking for good people who
            will take care of my orchid.
          </Text>
        </View>
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.iconCon}
            onPress={() => {
              if (favDetailList.some((item) => item.name === orchid.name)) {
                removeFromFavourite();
              } else {
                addToFavourite();
              }
            }}
          >
            {favDetailList.some((item) => item.name === orchid.name) ? (
              <Icon name="heart" size={22} color="red" />
            ) : (
              <Icon name="heart-outline" size={22} color="#FFFFFF" />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => navigation.navigate("Home")}
          >
            <Text style={{ color: "#ffffff", fontWeight: "bold" }}>HOME</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Detail;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
  },
  detailContainer: {
    height: 120,
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 20,
    marginHorizontal: 20,
    bottom: -60,
    elevation: 10,
    borderRadius: 18,
    justifyContent: "center",
  },
  comment: {
    marginTop: 10,
    fontSize: 12.5,
    color: "#4d4d4d",
    lineHeight: 20,
    marginHorizontal: 20,
  },
  footer: {
    height: 100,
    backgroundColor: "#D3D3D3",
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  iconCon: {
    backgroundColor: "#228B22",
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  btn: {
    backgroundColor: "#228B22",
    flex: 1,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    height: 50,
  },
});
