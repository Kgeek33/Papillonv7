function formatDate (date: string): string {
  const currentDate = new Date();
  const messageDate = new Date(date);
  const diffTime = Math.abs(currentDate.getTime() - messageDate.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const diffMonths = Math.floor(diffDays / 30);

  if (diffDays < 1) {
    return "Aujourd'hui";
  } else if (diffDays < 30) {
    return `Il y a ${diffDays} jour${diffDays !== 1 ? "s" : ""}`;
  } else if (diffMonths === 1) {
    return "Il y a 1 mois";
  } else {
    return `Le ${messageDate.getDay().toString().padStart(2, "0")}/${(
      messageDate.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${messageDate.getFullYear()}`;
  }
}

export default formatDate;
