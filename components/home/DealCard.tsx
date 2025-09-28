import { View, Text, Image, StyleSheet, Dimensions, ImageSourcePropType, TouchableOpacity } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { Colors, FontSizes, Spacing, FontWeights } from "../../theme";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

type Deal = {
  id: number;
  image: ImageSourcePropType;
};

const deals: Deal[] = [
  {
    id: 1,
    image: { uri: "https://res.cloudinary.com/dhm5yx35q/image/upload/v1758884717/1_hj0mlp.jpg" },
  },
  {
    id: 2,
    image: { uri: "https://res.cloudinary.com/dhm5yx35q/image/upload/v1758884714/2_bolxxh.jpg" },
  },
  {
    id: 3,
    image: { uri: "https://res.cloudinary.com/dhm5yx35q/image/upload/v1758884719/3_h5xxtl.jpg" },
  },
  {
    id: 4,
    image: { uri: "https://res.cloudinary.com/dhm5yx35q/image/upload/v1758884736/4_fhom8u.png" },
  },
  {
    id: 5,
    image: { uri: "https://res.cloudinary.com/dhm5yx35q/image/upload/v1758884771/5_xrcjpv.png" },
  },
];

export default function DealCard() {
  const router = useRouter();

  const handleDealPress = (dealId: number) => {
    switch (dealId) {
      case 1:
        // Navigate to Vishala shopping mall details page
        router.push({
          pathname: "/shopping-detail",
          params: { id: "vishala-shopping-mall" }
        });
        break;
      case 2:
        // Navigate to food tab
        router.push("/food");
        break;
      case 3:
        // Navigate to LULU children's hospital details page
        router.push({
          pathname: "/hospital-detail",
          params: { id: "lulu-children" }
        });
        break;
      case 4:
        // Navigate to Hairzone makeover details page
        router.push({
          pathname: "/salon-detail",
          params: { 
            id: "hair-zone-makeover",
            name: "Hair Zone Makeover",
            address: "Near Gandhi Nagar, Subash Nagar Road, Sircilla",
            rating: "4.8",
            reviews: "234"
          }
        });
        break;
      case 5:
        // Navigate to Ultratech cement details page
        router.push({
          pathname: "/construction-detail",
          params: { 
            constructionId: "ultratech-cement"
          }
        });
        break;
      default:
        router.push("/food");
    }
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
          <TouchableOpacity style={styles.card} onPress={() => handleDealPress(item.id)} activeOpacity={0.8}>
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
    color: Colors.primary,
    marginBottom: Spacing.sm,
    fontFamily: FontWeights.semibold,
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
