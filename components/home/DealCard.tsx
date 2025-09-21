import { View, Text, Image, StyleSheet, Dimensions, ImageSourcePropType, TouchableOpacity } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { Colors, FontSizes, Spacing } from "../../theme";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

type Deal = {
  id: number;
  image: ImageSourcePropType;
};

const deals: Deal[] = [
  {
    id: 1,
    image: require("../../assets/c1.png"),
  },
  {
    id: 2,
    image: require("../../assets/c2.jpg"),
  },
  {
    id: 3,
    image: require("../../assets/c3.jpg"),
  },
];

export default function DealCard() {
  const router = useRouter();

  const handleDealPress = () => {
    router.push("/food");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>🔥 Hot Deals</Text>
      <Carousel
        loop
        width={width - Spacing.lg}
        height={180}
        autoPlay
        autoPlayInterval={3000}
        data={deals}
        scrollAnimationDuration={800}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={handleDealPress} activeOpacity={0.8}>
            <Image source={item.image} style={styles.image} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
  },
  heading: {
    fontSize: FontSizes.subtitle,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: Spacing.sm,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    marginBottom: Spacing.md,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});
