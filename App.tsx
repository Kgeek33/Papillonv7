import "@/background/BackgroundTasks";
import Router from "@/router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { LogBox, AppState } from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAccounts, useCurrentAccount } from "@/stores/account";
import { AccountService } from "@/stores/account/types";
import { log } from "@/utils/logger/logger";
import { isExpoGo } from "@/utils/native/expoGoAlert";
import { atobPolyfill, btoaPolyfill } from "js-base64";
import { registerBackgroundTasks } from "@/background/BackgroundTasks";
import { SoundHapticsProvider } from "@/hooks/Theme_Sound_Haptics";
import { PapillonNavigation } from "@/router/refs";
import { findAccountByID } from "@/background/utils/accounts";
import * as Device from "expo-device";
import * as ScreenOrientation from "expo-screen-orientation";

SplashScreen.preventAutoHideAsync();

const DEFAULT_BACKGROUND_TIME = 15 * 60 * 1000; // 15 minutes

const BACKGROUND_LIMITS = {
  [AccountService.EcoleDirecte]: 15 * 60 * 1000,    // 15 minutes
  [AccountService.Pronote]: 5 * 60 * 1000,         // 5 minutes
  [AccountService.Skolengo]: 60 * 60 * 1000,  // 1 heure
};

export default function App () {
  const [appState, setAppState] = useState(AppState.currentState);
  const currentAccount = useCurrentAccount((store) => store.account);
  const switchTo = useCurrentAccount((store) => store.switchTo);
  const accounts = useAccounts((store) => store.accounts).filter(account => !account.isExternal);

  const [fontsLoaded] = useFonts({
    light: require("./assets/fonts/FixelText-Light.ttf"),
    regular: require("./assets/fonts/FixelText-Regular.ttf"),
    medium: require("./assets/fonts/FixelText-Medium.ttf"),
    semibold: require("./assets/fonts/FixelText-SemiBold.ttf"),
    bold: require("./assets/fonts/FixelText-Bold.ttf"),
  });

  useEffect(() => {
    const configureOrientation = async () => {
      try {
        const deviceType = await Device.getDeviceTypeAsync();
        if (deviceType === Device.DeviceType.TABLET) {
          await ScreenOrientation.unlockAsync();
        } else {
          await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
        }
      } catch (error) {
        log(`Error during orientation lock: ${error}`, "Orientation/App");
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
      }
    };

    configureOrientation();
  }, []);

  const handleNotificationPress = async (notification: any) => {
    if (notification?.data) {
      const accountID = notification.data.accountID;
      const account = findAccountByID(accountID);
      if (account) {
        await switchTo(account);
        PapillonNavigation.current?.reset({
          index: 0,
          routes: [{ name: "AccountStack" }],
        });
        setTimeout(() => {
          PapillonNavigation.current?.navigate(notification.data.page);
        }, 500);
      }
    }
  };

  const checkInitialNotification = async () => {
    const notifee = (await import("@notifee/react-native")).default;
    const initialNotification = await notifee.getInitialNotification();
    if (initialNotification) {
      await handleNotificationPress(initialNotification.notification);
    }
  };

  const getBackgroundTimeLimit = useCallback((service: keyof typeof BACKGROUND_LIMITS) => {
    return BACKGROUND_LIMITS[service] ?? DEFAULT_BACKGROUND_TIME;
  }, []);

  const handleBackgroundState = useCallback(async () => {
    const savedTimestamp = await AsyncStorage.getItem("@background_timestamp");
    if (!savedTimestamp || !currentAccount) return;

    const timeInBackground = Date.now() - parseInt(savedTimestamp, 10);
    const timeLimit =
      currentAccount.service in BACKGROUND_LIMITS
        ? getBackgroundTimeLimit(currentAccount.service as keyof typeof BACKGROUND_LIMITS)
        : DEFAULT_BACKGROUND_TIME;

    const timeInBackgroundSeconds = Math.floor(timeInBackground / 1000);
    if (timeInBackground >= timeLimit) {
      log(
        `⚠️ Refreshing current account ${currentAccount.studentName.first} after ${timeInBackgroundSeconds}s in background`,
        "RefreshToken"
      );
      for (const account of accounts) {
        if (account.localID === currentAccount.localID) {
          await switchTo(account).catch((error) => {
            log(`Error during switchTo: ${error}`, "RefreshToken");
          });
          break;
        }
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    await AsyncStorage.removeItem("@background_timestamp");
  }, [currentAccount, switchTo, getBackgroundTimeLimit]);


  useEffect(() => {
    if (!isExpoGo()) checkInitialNotification();
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", async (nextAppState) => {
      if (appState === nextAppState) return;

      if (nextAppState === "active") {
        if (!isExpoGo()) {
          const notifee = (await import("@notifee/react-native")).default;
          await notifee.setBadgeCount(0);
          await notifee.cancelAllNotifications();
        }
        await handleBackgroundState();
      } else if (nextAppState.match(/inactive|background/)) {
        const now = Date.now();
        await AsyncStorage.setItem("@background_timestamp", now.toString());
      }
      setAppState(nextAppState);
    });

    return () => subscription.remove();
  }, [appState, handleBackgroundState]);

  useEffect(() => {
    LogBox.ignoreLogs([
      "[react-native-gesture-handler]",
      "VirtualizedLists should never be nested",
      "TNodeChildrenRenderer: Support for defaultProps",
      "Service not implemented",
      "Linking found multiple possible",
      "[Reanimated] Property ",
    ]);

    if (!isExpoGo()) registerBackgroundTasks();

    const encoding = require("text-encoding");
    Object.assign(global, {
      TextDecoder: encoding.TextDecoder,
      TextEncoder: encoding.TextEncoder,
      atob: atobPolyfill,
      btoa: btoaPolyfill,
    });
  }, []);

  if (!fontsLoaded) return null;

  return (
    <SoundHapticsProvider>
      <Router />
    </SoundHapticsProvider>
  );
}