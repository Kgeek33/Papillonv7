import { UphfAccount } from "@/stores/account/types";
import { Information } from "../../shared/Information";
import { type ActualitiesResponse, UPHF } from "uphf-api";
import { AttachmentType } from "@/services/shared/Attachment";

const parseInformation = (i: ActualitiesResponse): Information => ({
  id: i.pubDate,
  title: i.title,
  date: new Date(i.pubDate),
  acknowledged: false,
  attachments: [{"name": i.title,"type":"link" as AttachmentType, "url": i.link}],
  content: i.content,
  author: "UPHF Actualités",
  category: "Actualités",
  read: false,
  ref: i,
});

export const getNews = async (account: UphfAccount): Promise<Information[]> => {
  const news = await UPHF.getActualities();
  return news.map(parseInformation);
};
