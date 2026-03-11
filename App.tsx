import "./global.css";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "./src/types/navigation";

import SearchScreen from "./src/screens/SearchScreen";
import MapScreen from "./src/screens/MapScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Search"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="Map" component={MapScreen} />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
