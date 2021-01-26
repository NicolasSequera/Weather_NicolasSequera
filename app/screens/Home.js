import React, { useState, useEffect } from "react";
import {
  FlatList,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ImageBackground,
  Dimensions,
  RefreshControl,
  ScrollView,
} from "react-native";
import { Card } from "native-base";
import Modal from "react-native-modal";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { API_KEY, API_CITIES } from "../utils/ApiKey";
import { Conditions } from "../utils/Conditions";
const { height } = Dimensions.get("window");
import * as theme from "../utils/Theme";
import { TabRouter } from "react-navigation";

const Home = () => {
  const [data, setData] = useState([]);
  const [dataList, setDataList] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [pageCurrent, setpageCurrent] = useState(false);
  const [error, setError] = useState(false);
  const [activeModal, setisActiveModal] = useState(false);
  const [latitud, setisLatitud] = useState(null);
  const [longitud, setisLongitud] = useState(null);
  const [country, setCountry] = useState("");
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  useEffect(() => {
    setisLoading(true);
    fetch(
      `http://api.openweathermap.org/data/2.5/group?id=${API_CITIES}&units=metric&appid=${API_KEY}`
    )
      .then((res) => res.json())
      .then((resJson) => {
        setData(resJson.list);
        setisLoading(false);
        setpageCurrent(false);
      })
      .catch((err) => {
        setIsLoading(false);
        setpageCurrent(false);
        setError(true);
      });
  }, [pageCurrent]);

  const renderItem = ({ item }) => {
    let picture = Conditions[item.weather[0].main].image;
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => changeActiveModal(item)}>
          <ImageBackground style={styles.picture} source={{ uri: picture }}>
            <View style={styles.headerContainer}>
              <Text style={styles.tempText}>{item.main.temp}˚C</Text>
            </View>
            <View style={styles.subHeaderContainer}>
              <Text style={styles.subText}>
                {item.name}, {item.sys.country}
              </Text>
            </View>
            <View style={styles.bodyContainer}>
              <Text style={styles.title}>
                {Conditions[item.weather[0].main].title}
              </Text>
              <Text style={styles.subtitle}>
                {Conditions[item.weather[0].main].subtitle}
              </Text>
            </View>
          </ImageBackground>
        </TouchableOpacity>
      </View>
    );
  };

  const ListWeather = () => {
    return (
      <Modal
        isVisible={activeModal}
        useNativeDriver
        backdropOpacity={0.3}
        style={styles.modalContainer}
        backdropColor={theme.colors.overlay}
        onBackButtonPress={() => setisActiveModal(false)}
        onBackdropPress={() => setisActiveModal(false)}
        onSwipeComplete={() => setisActiveModal(false)}
      >
        <View style={styles.modal}>
          <Text style={styles.modalText}>Pronóstico de Próximos días </Text>
          <FlatList
            style={styles.container}
            data={dataList}
            renderItem={renderModal}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </Modal>
    );
  };

  const renderModal = ({ item }) => {
    let unixTime = item.dt;
    let date = new Date(unixTime * 1000);
    date = date.toLocaleDateString("es-AR", options);
    return (
      <Card>
        <View style={styles.modalDay}>
          <Text style={styles.modalDayText}>{date}</Text>
        </View>
        <View style={styles.modalTemp}>
          <Text style={styles.modalStatusMax}>
            {" "}
            {Conditions[item.weather[0].main].title}
          </Text>
          <MaterialCommunityIcons
            size={30}
            name={Conditions[item.weather[0].main].icon}
            color={"#498bc8"}
          />
          <Text style={styles.modalStatusMax}>{item.temp.max}°</Text>
          <Text style={styles.modalStatusMin}>{item.temp.min}°</Text>
        </View>
      </Card>
    );
  };

  const changeActiveModal = (item) => {
    getDataList();
    setisLatitud(item.coord.lat);
    setisLongitud(item.coord.lon);
  };

  const getDataList = async () => {
    if (latitud != null && longitud != null) {
      setisLoading(true);
      const apiURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitud}&lon=${longitud}&exclude=hourly,minutely,current&cnt=5&units=metric&appid=${API_KEY}`;
      await fetch(apiURL)
        .then((res) => res.json())
        .then((resJson) => {
          setDataList(resJson.daily);
          setisLoading(false);
          setisActiveModal(true);
        })
        .catch((err) => {
          setisLoading(false);
          setisActiveModal(false);
          setError(err);
        });
    }
  };

  const handleLoadMore = () => {
    setpageCurrent(true);
    setisLoading(true);
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#5500dc" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>
          Error al obtener datos... ¡Verifique su conexión de red!
        </Text>
      </View>
    );
  }

  return (
    <View>
      <FlatList
        style={styles.container}
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        refreshControl={
          <RefreshControl refreshing={pageCurrent} onRefresh={handleLoadMore} />
        }
        removeClippedSubviews={false}
      />
      {activeModal ? (
        <ListWeather
          isActiveModal={activeModal}
          isLat={latitud}
          isLon={longitud}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: theme.sizes.padding,
    backgroundColor: theme.colors.gray4,
  },
  picture: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
    borderRadius: theme.sizes.border,
    overflow: "hidden",
    opacity: 0.8,
  },
  headerContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingLeft: theme.sizes.padding,
    paddingTop: theme.sizes.padding,
    paddingBottom: 0,
  },
  subHeaderContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingLeft: 10,
    paddingTop: 0,
  },
  bodyContainer: {
    flex: 2,
    alignItems: "flex-start",
    justifyContent: "flex-end",
    paddingLeft: 25,
  },
  tempText: {
    fontSize: theme.sizes.h3,
    color: theme.colors.tertiary,
    fontWeight: "bold",
    paddingLeft: 10,
  },
  title: {
    fontSize: theme.colors.title,
    color: theme.colors.tertiary,
    paddingLeft: 10,
    fontWeight: "bold",
  },
  subText: {
    fontSize: theme.colors.h2,
    color: theme.colors.tertiary,
    fontWeight: "bold",
    paddingLeft: 10,
  },
  subtitle: {
    fontSize: theme.colors.h2,
    color: theme.colors.tertiary,
    fontWeight: "bold",
    margin: 10,
  },
  itemText: {
    fontSize: theme.colors.font,
    color: theme.colors.black,
    fontWeight: "bold",
    paddingLeft: 10,
  },
  loader: {
    marginTop: 10,
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.tertiary,
  },
  loadingText: {
    fontSize: theme.colors.font,
  },
  modalContainer: {
    flex: 1,
    margin: 0,
    justifyContent: "flex-end",
    flexDirection: "column",
  },
  modal: {
    flexDirection: "column",
    height: height * 0.85,
    //padding: theme.sizes.base,
    backgroundColor: theme.colors.white,
    borderTopLeftRadius: theme.sizes.base,
    borderTopRightRadius: theme.sizes.base,
  },
  modalText: {
    justifyContent: "center",
    alignSelf: "auto",
    fontSize: theme.sizes.header,
    textAlign: "center",
    color: theme.colors.primary,
  },
  modalDay: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
  },
  modalDayText: {
    justifyContent: "center",
    alignSelf: "auto",
    flex: 1,
    paddingTop: 10,
    fontSize: theme.colors.title,
    textAlign: "center",
    color: theme.colors.primary,
  },
  modalStatus: {
    fontSize: 14,
    textAlign: "center",
    paddingLeft: 10,
    color: theme.colors.orange,
  },
  modalCurrent: {
    textAlign: "center",
    fontSize: theme.colors.font,
    paddingLeft: 10,
    color: theme.colors.gray3,
    flex: 2,
  },
  modalTemp: {
    flex: 1,
    flexDirection: "row",
    textAlign: "center",
    alignItems: "center",
    justifyContent: "space-between",
    alignSelf: "auto",
    padding: 10,
  },
});

export default Home;
