import { useTheme } from "@react-navigation/native";
import { Check } from "lucide-react-native";
import React, { createContext, useState, useContext, ReactNode } from "react";
import { Modal, View, Text, StyleSheet, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Reanimated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";
import {
  PapillonContextEnter,
  PapillonContextExit,
} from "@/utils/ui/animations";
import { BlurView } from "expo-blur";

type AlertAction = {
  title: string;
  onPress?: () => void;
  icon: React.ReactElement;
  primary?: boolean;
  danger?: boolean;
  backgroundColor?: string;
};

export type Alert = {
  title: string;
  message: string;
  icon: React.ReactElement;
  actions?: AlertAction[];
};

type AlertContextType = {
  showAlert: (alert: Alert) => void;
};

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};

type AlertProviderProps = {
  children: ReactNode;
};

const AlertProvider = ({ children }: AlertProviderProps) => {
  const [alert, setAlert] = useState<Alert | null>(null);
  const [visible, setVisible] = useState(false);

  const { dark, colors } = useTheme();
  const insets = useSafeAreaInsets();

  const showAlert = ({
    title,
    message,
    icon,
    actions = [
      {
        title: "Compris !",
        onPress: hideAlert,
        icon: <Check />,
        primary: true,
      },
    ],
  }: Alert) => {
    setAlert({ title, message, icon, actions });
    setVisible(true);
  };

  function hideAlert () {
    setAlert(null);
    setVisible(false);
  }

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}

      {visible && alert && (
        <Modal transparent onRequestClose={hideAlert} animationType="none">
          <Reanimated.View
            entering={FadeIn.duration(150)}
            exiting={FadeOut.duration(150)}
            style={styles.overlay}
          >
            <BlurView intensity={10} style={styles.blur} />
          </Reanimated.View>

          <Reanimated.View
            style={styles.modalContainer}
            layout={LinearTransition}
          >
            <Pressable style={styles.pressable} onPress={hideAlert} />
            <Reanimated.View
              style={[
                styles.alertBox,
                {
                  backgroundColor: dark ? "#333" : colors.card,
                  marginBottom: 10 + insets.bottom,
                },
              ]}
              entering={PapillonContextEnter}
              exiting={PapillonContextExit}
            >
              <View style={styles.contentContainer}>
                <View style={styles.titleContainer}>
                  {alert.icon &&
                    React.cloneElement(alert.icon, {
                      color: colors.text,
                      size: 24,
                    })}
                  <Text style={[styles.title, { color: colors.text }]}>
                    {alert.title}
                  </Text>
                </View>
                <Text style={[styles.message, { color: colors.text }]}>
                  {alert.message}
                </Text>
              </View>

              <View
                style={[
                  styles.buttons,
                  {
                    borderColor: colors.border,
                    flexDirection:
                      (alert.actions ?? []).length > 2 ? "column" : "row",
                    alignItems: "center",
                  },
                ]}
              >
                {alert.actions?.map(
                  ({
                    title,
                    onPress,
                    icon,
                    primary,
                    danger,
                    backgroundColor,
                  }) => (
                    <Pressable
                      key={title}
                      onPress={() => {
                        hideAlert();
                        onPress?.();
                      }}
                      style={({ pressed }) => [
                        styles.button,
                        {
                          width:
                            (alert.actions ?? []).length > 2 ? "100%" : "auto",
                          justifyContent: "center",
                          alignItems: "center",
                          opacity: pressed ? 0.6 : 1,
                        },
                        primary
                          ? styles.primaryButton
                          : styles.notPrimaryButton,
                        primary
                          ? {
                            backgroundColor:
                                backgroundColor ?? colors.primary,
                          }
                          : danger
                            ? { backgroundColor: "#FC1E0D" }
                            : { borderColor: "#CCC", borderWidth: 1 },
                      ]}
                    >
                      {icon &&
                        React.cloneElement(icon, {
                          color: primary ? "#ffffff" : colors.text,
                          size: 24,
                        })}
                      <Text
                        style={[
                          styles.buttonText,
                          { color: colors.text },
                          primary && styles.primaryButtonText,
                        ]}
                      >
                        {title}
                      </Text>
                    </Pressable>
                  )
                )}
              </View>
            </Reanimated.View>
          </Reanimated.View>
        </Modal>
      )}
    </AlertContext.Provider>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  blur: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  pressable: {
    flex: 1,
    width: "100%",
  },
  alertBox: {
    borderRadius: 16,
    padding: 20,
    paddingBottom: 5,
    maxWidth: "90%",
  },
  contentContainer: {
    gap: 6,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  title: {
    fontSize: 18,
    fontFamily: "semibold",
  },
  message: {
    fontSize: 16,
    fontFamily: "medium",
    opacity: 0.6,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingVertical: 12,
    paddingHorizontal: 5,
    marginTop: 16,
    paddingTop: 10,
    gap: 10,
    borderTopWidth: 1,
  },
  button: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 300,
    paddingVertical: 10,
    width: "100%",
  },
  buttonText: {
    fontSize: 16,
    fontFamily: "medium",
  },
  primaryButton: {
    paddingHorizontal: 14,
  },
  notPrimaryButton: {
    paddingHorizontal: 5,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontFamily: "semibold",
  },
});

export default AlertProvider;
