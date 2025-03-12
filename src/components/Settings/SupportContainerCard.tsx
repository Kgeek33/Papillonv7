import React from "react";

import { View } from "react-native";
import { NativeItem, NativeList, NativeText } from "../Global/NativeComponents";
import { MessageCircleQuestion } from "lucide-react-native";

const SupportContainerCard = ({ theme }: { theme: any }) => {
  const { colors } = theme;

  return (
    <NativeList>
      <View style={{
        height: 120,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        backgroundColor: colors.primary + "22",
      }}>
        <MessageCircleQuestion
          color={colors.primary}
          size={80}
        />
      </View>
      <NativeItem>
        <NativeText variant="title">
          Un problème, une question ?
        </NativeText>
        <NativeText variant="subtitle">
          Laissez-nous un message depuis cette page et nous vous répondrons dans les plus brefs délais !
        </NativeText>
      </NativeItem>
    </NativeList>
  );
};

export default SupportContainerCard;