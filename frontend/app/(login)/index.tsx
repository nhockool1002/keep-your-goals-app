import React, { useEffect, useState } from "react";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedView } from "@/components/ThemedView";
import * as Device from "expo-device";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { Switch } from "react-native-elements";
import FormLogin from "../(component)/FormLogin";
import FormRegister from "../(component)/FormRegister";
import { getTheme } from "../../constants/theme";
import LanguageSelect from "../(component)/LanguageSelect";
import { getToken } from "@/utils/storageUtil";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [switchBtn, setSwitchBtn] = useState(true);
  const { t, i18n } = useTranslation();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const theme = getTheme(isDarkMode);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getToken();
      if (token) {
        console.log(">> Token granted !")
        router.replace("/Home");
      } else {
        setLoading(false);
      }
    };

    setDeviceId(Device.osInternalBuildId);
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
    checkAuth();
  }, []);

  return loading ? (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size={200} color="yellow" />
      <Text style={[{ color: "white", fontSize: 28 }]}>
        {t("welcome") + deviceId}
      </Text>
    </View>
  ) : (
    <>
      {/* Language Select Nằm Góc Phải Trên */}
      <LanguageSelect />

      <ParallaxScrollView
        headerBackgroundColor={{ light: theme.primary, dark: theme.primary }}
        headerImage={
          <Image
            source={require("@/assets/images/about-us-paraview.png")}
            style={styles.reactLogo}
          />
        }
      >
        <ThemedView style={styles.titleContainer}>
          {/* Toggle Switch + Text */}
          <View style={styles.switchContainer}>
            <Text style={[{ color: theme.primaryText }, styles.text]}>
              {switchBtn ? t("register") : ""}
            </Text>
            <Switch
              color={theme.colorBottomActive}
              value={switchBtn}
              onValueChange={() => setSwitchBtn(!switchBtn)}
            />
            <Text style={[{ color: theme.primaryText }, styles.text]}>
              {switchBtn ? "" : t("login")}
            </Text>
          </View>

          {/* Hiển thị FormLogin hoặc FormRegister */}
          <View style={styles.formContainer}>
            {switchBtn ? (
              <FormRegister onSwitch={() => setSwitchBtn(false)} theme={theme} />
            ) : (
              <FormLogin onSwitch={() => setSwitchBtn(true)} theme={theme} />
            )}
          </View>
        </ThemedView>
      </ParallaxScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(0, 0, 0)",
  },
  titleContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  reactLogo: {
    height: 208,
    width: 320,
    bottom: 0,
    left: 15,
    position: "absolute",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    width: "100%",
    marginBottom: 20,
  },
  text: {
    width: "33.33%",
    textAlign: "center",
    fontSize: 20,
    letterSpacing: 1.5,
    fontWeight: "bold",
  },
  formContainer: {
    width: "100%",
    alignSelf: "center",
    paddingVertical: 20,
  },
});
