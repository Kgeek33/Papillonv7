import React, { useEffect, useLayoutEffect } from "react";
import { Dimensions, View } from "react-native";
import screens from ".";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { useCurrentAccount } from "@/stores/account";
import PapillonTabNavigator from "@/router/helpers/PapillonTabNavigator";
import { Screen } from "@/router/helpers/types";

import * as SplashScreen from "expo-splash-screen";
import * as Linking from "expo-linking";
import { PapillonNavigation } from "@/router/refs";

export const AccountStack = PapillonTabNavigator();
const screenOptions: NativeStackNavigationOptions = {
  headerBackTitleStyle: {
    fontFamily: "medium",
  },
  headerTitleStyle: {
    fontFamily: "semibold",
  },
  headerBackTitle: "Retour",
  // @ts-expect-error : not sure if the type object is correct
  tabBarStyle: {
    position: "absolute",
  },
};

function TabBarContainer () {
  return (
    <View />
  );
}

const AccountStackScreen: Screen<"AccountStack"> = () => {
  const account = useCurrentAccount(store => store.account);

  const navigatorRef = React.useRef();

  const url = Linking.useURL();
  const params = url && Linking.parse(url);

  useEffect(() => {
    if (params) {
      if (params.queryParams.method == "importIcal") {
        const ical = params.queryParams.ical;
        const title = params.queryParams.title;
        const autoAdd = params.queryParams.autoAdd;

        PapillonNavigation.current?.navigate("LessonsImportIcal", {
          ical,
          title,
          autoAdd,
        });
      }
    }
  }, [params]);

  const dims = Dimensions.get("screen");
  const tabletWidth = dims.width;
  const tabletHeight = dims.height;
  const tabletDiagl = (tabletWidth / tabletHeight) * 10;
  const tablet = tabletDiagl >= 6.9;

  let newAccountScreens = screens;

  if (account?.personalization.tabs) {
    let newTabs = account.personalization.tabs;
    if (!tablet) {
      newTabs = newTabs.filter(tab => tab.enabled);
    }

    newAccountScreens = newTabs.map(tab => {
      const tabData = screens.find(t => t.name === tab.name);
      if(tabData) {
        tabData.options = {
          ...tabData.options,
          tabEnabled: tab.enabled,
        };
        return tabData;
      }
    });
  }

  let mln = 5 - newAccountScreens.length;
  if (mln < 0) { mln = 0; }

  if (tablet) {
    mln = 0;
  }

  const mScreenLoop = new Array(mln).fill(0);

  let finalScreens = newAccountScreens;
  if (!tablet) {
    finalScreens = newAccountScreens.splice(0, 5);
  }

  useLayoutEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <AccountStack.Navigator screenOptions={screenOptions} tabBar={TabBarContainer}>
      {finalScreens.map((screen) => (
        // @ts-expect-error : type not compatible, but it works fine.
        <AccountStack.Screen
          key={screen.name}
          {...screen}
          initialParams={{
            outsideNav: false
          }}
        />
      ))}
      {/* pour ne pas casser les hooks */}
      {mScreenLoop.map((_, index) => (
        <AccountStack.Screen
          key={"usl_" + index}
          name={"usl_" + index}
          component={UslView}
        />
      ))}
    </AccountStack.Navigator>
  );
};

const UslView: React.FC = () => {
  return (
    <View />
  );
};

export default AccountStackScreen;