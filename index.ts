import { AppRegistry, Platform } from "react-native";
import App from "./App";

AppRegistry.registerComponent("main", () => App);

if (Platform.OS === "web" && typeof document !== "undefined") {
  const rootTag = document.getElementById("root");

  if (!rootTag) {
    throw new Error('Required HTML element with id "root" was not found.');
  }

  AppRegistry.runApplication("main", { rootTag });
}
