import type { Personalization } from "@/stores/account/types";
import downloadAsBase64 from "@/utils/external/download-as-base64";
import { defaultTabs } from "@/consts/DefaultTabs";
import type { Account } from "pawdirecte";

import colors from "@/utils/data/colors.json";

const defaultLocalTabs = [
  "Home",
  "Lessons",
  "Homeworks",
  "Grades",
  "News",
  "Attendance",
  "Messages",
  "Menu"
] as typeof defaultTabs[number]["tab"][];

export default async function defaultPersonalization (customDefaults?: Partial<Personalization>): Promise<Partial<Personalization>> {
  return {
    color: colors[0],
    MagicHomeworks: true,
    MagicNews: true,
    profilePictureB64: undefined,
    tabs: defaultTabs.filter(current => defaultLocalTabs.includes(current.tab)).map((tab, index) => ({
      name: tab.tab,
      enabled: index <= 4
    })),
    ...customDefaults
  };
}
