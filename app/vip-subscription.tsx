import { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, LayoutAnimation } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";

type Plan = {
  id: string;
  name: string;
  price: string;
  subtext?: string;
  savings?: string;
  benefits: string[];
  highlight?: string; // e.g., Most Popular
};

const PLANS: Plan[] = [
  {
    id: "trial",
    name: "1st Month Free",
    price: "₹1",
    subtext: "Try for free",
    savings: "Worth ₹199 - Absolutely Free!",
    benefits: [
      "Premium discounts on all categories",
      "Priority customer support",
      "Exclusive offers & deals",
      "No booking fees",
    ],
  },
  {
    id: "six-months",
    name: "6 Months",
    price: "₹699",
    subtext: "₹117/month",
    savings: "Save up to ₹4,200",
    benefits: [
      "Premium discounts on all categories",
      "Priority customer support",
      "Exclusive offers & deals",
      "No booking fees",
      "Free delivery on food orders",
      "VIP badge & recognition",
    ],
    highlight: "Most Popular",
  },
  {
    id: "one-year",
    name: "1 Year",
    price: "₹999",
    subtext: "₹83/month",
    savings: "Save up to ₹10,000",
    benefits: [
      "Premium discounts on all categories",
      "Priority customer support",
      "Exclusive offers & deals",
      "No booking fees",
      "Free delivery on food orders",
      "VIP badge & recognition",
      "Birthday & anniversary bonuses",
    ],
  },
];

export default function VipSubscriptionScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const [expandedId, setExpandedId] = useState<string | null>("one-year");

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(prev => (prev === id ? null : id));
  };

  const onSubscribe = (plan: Plan) => {
    // Placeholder: integrate payment / entitlement later
    // Navigate to confirmation or start checkout
    console.log("Subscribe pressed for plan:", plan.id);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#111827" />
        </TouchableOpacity>
        <View style={styles.headerTitleWrap}>
          <Ionicons name="sparkles" size={18} color="#f59e0b" />
          <Text style={styles.headerTitle}>VIP Subscription</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <View style={styles.vipBadge}>
            <Ionicons name="star" size={14} color="#fff" />
            <Text style={styles.vipBadgeText}>VIP</Text>
          </View>
          <Text style={styles.heroTitle}>Unlock Premium Savings</Text>
          <Text style={styles.heroSubtitle}>Extra discounts, priority support, exclusive deals and more.</Text>
        </View>

        <Text style={styles.sectionTitle}>Choose Your Plan</Text>

        {PLANS.map((plan) => {
          const expanded = expandedId === plan.id;
          return (
            <View key={plan.id} style={[styles.planCard, expanded && styles.planCardExpanded]}>
              <TouchableOpacity activeOpacity={0.9} style={styles.planHeader} onPress={() => toggleExpand(plan.id)}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.planName}>{plan.name}</Text>
                  {!!plan.savings && (
                    <Text style={styles.planSavings}>{plan.savings}</Text>
                  )}
                </View>
                <View style={styles.planPriceWrap}>
                  <Text style={styles.planPrice}>{plan.price}</Text>
                  {!!plan.subtext && <Text style={styles.planSubtext}>{plan.subtext}</Text>}
                </View>
                <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={18} color="#6b7280" />
              </TouchableOpacity>

              {plan.highlight && (
                <View style={styles.ribbon}><Text style={styles.ribbonText}>{plan.highlight}</Text></View>
              )}

              {expanded && (
                <View style={styles.planBody}>
                  {plan.benefits.map((b, i) => (
                    <View key={i} style={styles.benefitRow}>
                      <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                      <Text style={styles.benefitText}>{b}</Text>
                    </View>
                  ))}

                  <TouchableOpacity style={styles.ctaBtn} onPress={() => onSubscribe(plan)}>
                    <Ionicons name="flash" size={16} color="#fff" />
                    <Text style={styles.ctaText}>Subscribe</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        })}

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingTop: 56, paddingBottom: 12, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#e5e7eb" },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center", backgroundColor: "#f3f4f6" },
  headerTitleWrap: { flexDirection: "row", alignItems: "center", gap: 8 },
  headerTitle: { fontSize: 16, fontWeight: "800", color: "#111827" },

  heroCard: { backgroundColor: "#111827", borderRadius: 16, padding: 16, marginTop: 16, marginBottom: 16, shadowColor: "#000", shadowOpacity: 0.15, shadowOffset: { width: 0, height: 6 }, shadowRadius: 12, elevation: 4 },
  vipBadge: { flexDirection: "row", alignItems: "center", backgroundColor: "#f59e0b", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, alignSelf: "flex-start" },
  vipBadgeText: { color: "#fff", fontWeight: "800", marginLeft: 6, fontSize: 12 },
  heroTitle: { color: "#fff", fontSize: 20, fontWeight: "800", marginTop: 10 },
  heroSubtitle: { color: "#d1d5db", fontSize: 13, marginTop: 6 },

  sectionTitle: { fontSize: 16, fontWeight: "800", color: "#111827", marginBottom: 10 },
  planCard: { backgroundColor: "#fff", borderRadius: 16, borderWidth: 1, borderColor: "#e5e7eb", marginBottom: 12, shadowColor: "#000", shadowOpacity: 0.06, shadowOffset: { width: 0, height: 4 }, shadowRadius: 10, elevation: 2, position: "relative" },
  planCardExpanded: { borderColor: "#f59e0b" },
  planHeader: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 14, gap: 12 },
  planName: { fontSize: 16, fontWeight: "800", color: "#111827" },
  planSavings: { fontSize: 12, color: "#059669", fontWeight: "700", marginTop: 2 },
  planPriceWrap: { alignItems: "flex-end", marginRight: 8 },
  planPrice: { fontSize: 18, fontWeight: "800", color: "#111827" },
  planSubtext: { fontSize: 11, color: "#6b7280", marginTop: 2 },
  ribbon: { position: "absolute", top: -10, left: 16, backgroundColor: "#f59e0b", paddingHorizontal: 10, paddingVertical: 4, borderTopLeftRadius: 8, borderTopRightRadius: 8 },
  ribbonText: { color: "#fff", fontWeight: "800", fontSize: 10 },
  planBody: { paddingHorizontal: 16, paddingBottom: 16 },
  benefitRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 8 },
  benefitText: { fontSize: 13, color: "#374151" },
  ctaBtn: { marginTop: 14, height: 48, borderRadius: 12, backgroundColor: "#111827", alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 8 },
  ctaText: { color: "#fff", fontWeight: "800" },
});


