import { formatDistanceToNow, isYesterday, isToday, isTomorrow } from "date-fns";
import { fr } from "date-fns/locale";

function formatDate (date: string): string {
  const messageDate = new Date(date);

  if (Number.isNaN(messageDate.getTime())) {
    return "Date invalide";
  }
  let formattedDate = formatDistanceToNow(messageDate, { addSuffix: true, locale: fr });

  if (isYesterday(messageDate)) {
    return "hier";
  }

  if (isToday(messageDate)) {
    return "aujourd’hui";
  }

  if (isTomorrow(messageDate)) {
    return "demain";
  }

  return formattedDate;
}

export default formatDate;
