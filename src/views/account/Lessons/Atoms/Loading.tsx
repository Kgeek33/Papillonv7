import PapillonLoading from "@/components/Global/PapillonLoading";
import { useTheme } from "@react-navigation/native";

const LessonsLoading = () => {
  const colors = useTheme().colors;

  return (
    <PapillonLoading
      title="Chargement de l'emlpoi du temps"
    />
  );
};

export default LessonsLoading;
