import { NativeListHeader } from "@/components/Global/NativeComponents";
import { animPapillon } from "@/utils/ui/animations";
import Reanimated, { LinearTransition } from "react-native-reanimated";
import GradesLatestItem from "./LatestGradesItem";

const GradesLatestList = (props: GradesLatestListProps) => {
  const { latestGrades, navigation, allGrades } = props;
  return (
    <>
      <NativeListHeader animated label="Dernières notes" />

      <Reanimated.ScrollView
        layout={animPapillon(LinearTransition)}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{
          marginHorizontal: -16,
          marginBottom: -2,
        }}
        contentContainerStyle={{
          paddingBottom: 6,
          paddingHorizontal: 16,
          flexDirection: "row",
          gap: 10,
        }}
      >
        {latestGrades.map((grade, index) => (
          <GradesLatestItem
            key={index}
            grade={grade}
            i={index}
            navigation={navigation}
            allGrades={allGrades}
          />
        ))}
      </Reanimated.ScrollView>
    </>
  );
};

export default GradesLatestList;
