import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Image,
  Pressable,
} from "react-native";
import { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
// import axios from "axios";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import axios from "axios";

function HomePage({ navigation }) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fcd2d2",
      }}
    >
      <View>
        <Text style={homeStyles.headerText}>
          Age <Text style={homeStyles.innerText}>Estimator</Text>
        </Text>
      </View>
      <View>
        <Pressable
          style={homeStyles.button}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={homeStyles.text}>Get Started</Text>
        </Pressable>
      </View>
    </View>
  );
}

function HomeScreen() {
  const [fileName, setFile] = useState("ire");
  const [image, setImage] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    function createApi() {
      fetch("https://witler.pythonanywhere.com/api/v1.0/user/tester")
        .then((resp) => resp.json())
        .then((data) => {
          console.log(data);
        })
        .catch((error) => console.log("Error"));
    }
    createApi();
  }, []);

  const handleSubmit = () => {
    fetch("https://witler.pythonanywhere.com/api/v1.0/user/test", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image_uri: "https://witler.pythonanywhere.com/api/v1.0/user/test",
        title: "Post title",
      }),
    })
      .then((response) => response.json())
      .then((responseData) => {
        console.log(JSON.stringify(responseData));
      });
  };

  const clickHandler = () => {
    setFile("dev");
  };
  const imagePicker = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
      aspect: [4, 3],
      allowsEditing: false,
    });
    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
    let localuri = result.assets[0].uri;
    setImage(localuri);
    let filename = localuri.split("/").pop();
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;

    const formData = new FormData();
    formData.append("image_uri", { uri: localuri, type: type, name: filename });
    formData.append("title", fileName);
    // fetch("http://172.30.64.1:80/api/v1.0/user/test/", {
    //   method: "POST",
    //   headers: { "Content-Type": "multipart/form-data" },
    //   body: formData,
    // })
    //   .then((res) => checkStatus(res))
    //   .then((res) => res.json())
    //   .then((res) => {
    //     console.log("response" + JSON.stringify(res));
    //   })
    //   .catch((e) => console.log(e))
    //   .done();
    let uri = localuri;
    fetch("https://witler.pythonanywhere.com/api/v1.0/user/test", {
      method: "POST",
      headers: {
        "Content-Type":
          "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTr",
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((responseData) => {
        console.log(JSON.stringify(responseData));
      });
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <View style={styles.imageContainer}>
        {image && (
          <Image
            source={{ uri: image }}
            style={{ height: "100%", width: "100%" }}
          />
        )}
      </View>
      <View style={styles.header}>
        <Text style={styles.noteText}>Note: </Text>
        <Text style={styles.noteText}>
          <Text style={styles.list}>. </Text>Images should not exceed 500kb
        </Text>
        <Text style={styles.noteText}>
          <Text style={styles.list}>. </Text>jpg, png, jpegs format only
        </Text>

        <View style={styles.buttons}>
          <View style={styles.lefttButton}>
            <Button title="upload button" onPress={imagePicker} />
          </View>
          <View style={styles.rightButton}>
            <Button title="post image" onPress={handleSubmit} />
          </View>
        </View>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HomeScreen">
        <Stack.Screen name="HomeScreen" component={HomePage} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

const homeStyles = StyleSheet.create({
  container: {
    backgroundColor: "#fcd2d2",
  },
  button: {
    height: 40,
    backgroundColor: "#ba09ba",
    width: 120,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
  },
  text: {
    color: "#fff",
  },
  headerText: {
    fontSize: 30,

    fontWeight: "bold",
    letterSpacing: 0.25,
  },
  innerText: {
    color: "#c43f3b",
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    marginTop: 50,
  },
  list: {
    fontWeight: "bold",
    fontSize: 20,
    paddingBottom: 10,
    color: "#ba09ba",
  },
  imageContainer: {
    borderStyle: "dashed",
    height: "30%",
    width: "60%",
    borderWidth: 1,
    borderColor: "#ba09ba",
    borderRadius: 1,
  },
  noteText: {
    color: "#ba09ba",
  },

  buttons: {
    marginTop: "30%",
    flexDirection: "row",
  },

  lefttButton: {
    flex: 1,
    margin: 10,
  },
  rightButton: {
    flex: 1,
    margin: 10,
  },
});
