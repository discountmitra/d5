import { ScrollView, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import Header from "@/components/home/Header";
import DealCard from "../../components/home/DealCard";
import CategoryPreview from "../../components/home/CategoryPreview";
import UserModeToggle from "../../components/common/UserModeToggle";
import { Spacing, Colors } from "../../theme";
import { useNavigation, useRouter } from "expo-router";
import { useEffect } from "react";
import CustomTopBar from "@/components/home/CustomTopBar";
import { Ionicons } from "@expo/vector-icons";
import { useVip } from "../../contexts/VipContext";

export default function HomeScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const { isVip } = useVip();

  useEffect(() => {
    navigation.setOptions({ headerShown: false }); // Hide default header
  }, [navigation]);

  const handleUpgrade = () => {
    router.push('/vip-subscription');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* VIP Toggle - Moved to top */}
      <UserModeToggle onModeChange={(mode) => {
        console.log('Mode changed to:', mode);
      }} />

      {/* Greeting + Search */}
      <CustomTopBar />

      {/* VIP Upgrade Section - Below search bar */}
      {!isVip && (
        <View style={styles.upgradeSection}>
          <View style={styles.upgradeBanner}>
            <View style={styles.bannerContent}>
              <Ionicons name="flash" size={16} color="#f59e0b" />
              <Text style={styles.bannerText}>
                Upgrade to VIP and unlock 2X discounts on all services
              </Text>
            </View>
            <TouchableOpacity onPress={handleUpgrade} style={styles.subscribeButton}>
              <Text style={styles.subscribeText}>Subscribe Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Hot Deal (static for now) */}
      <DealCard />

      {/* Categories Preview (only 4 shown here) */}
      <CategoryPreview />

      {/* Recent Activity */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  upgradeSection: {
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  upgradeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 6,
  },
  bannerText: {
    fontSize: 12,
    color: '#92400e',
    fontWeight: '500',
    flex: 1,
  },
  subscribeButton: {
    backgroundColor: '#f59e0b',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  subscribeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});
