import { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, LayoutAnimation, Modal, ActivityIndicator, Animated, TouchableWithoutFeedback } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";
import { useVip, SUBSCRIPTION_PLANS, SubscriptionPlan } from "../contexts/VipContext";
import { LinearGradient } from "expo-linear-gradient";

export default function VipSubscriptionScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { isVip, subscription, subscribeToPlan, cancelSubscription, getSubscriptionStatus } = useVip();
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(["quarterly"]));
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const subscriptionStatus = getSubscriptionStatus();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSubscribe = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setShowConfirmModal(true);
  };

  const confirmSubscription = async () => {
    if (!selectedPlan) return;
    
    setShowConfirmModal(false);
    setIsLoading(true);

    try {
      const success = await subscribeToPlan(selectedPlan.id);
      if (success) {
        setIsLoading(false);
        // Success popup will be shown by UserModeToggle component
        router.back();
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Subscription failed:', error);
    }
  };

  const handleCancelSubscription = () => {
    setShowCancelModal(true);
  };

  const confirmCancellation = async () => {
    setShowCancelModal(false);
    setIsLoading(true);

    try {
      const success = await cancelSubscription();
      if (success) {
        setIsLoading(false);
        // User is now back to normal mode
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Cancellation failed:', error);
    }
  };


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#111827" />
        </TouchableOpacity>
        <View style={styles.headerTitleWrap}>
          <Ionicons name="star" size={18} color="#f59e0b" />
          <Text style={styles.headerTitle}>VIP Subscription</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }} showsVerticalScrollIndicator={false}>
        {isVip ? (
          // VIP User - Show current subscription details
          <>
            <View style={styles.currentPlanCard}>
              <View style={styles.vipBadge}>
                <Ionicons name="star" size={14} color="#fff" />
                <Text style={styles.vipBadgeText}>VIP ACTIVE</Text>
              </View>
              <Text style={styles.heroTitle}>Welcome to VIP!</Text>
              <Text style={styles.heroSubtitle}>You're enjoying premium benefits and exclusive savings.</Text>
              
              <View style={styles.planDetails}>
                <View style={styles.planDetailRow}>
                  <Text style={styles.planDetailLabel}>Current Plan:</Text>
                  <Text style={styles.planDetailValue}>{subscriptionStatus.planName}</Text>
                </View>
                <View style={styles.planDetailRow}>
                  <Text style={styles.planDetailLabel}>Days Remaining:</Text>
                  <Text style={styles.planDetailValue}>{subscriptionStatus.daysRemaining} days</Text>
                </View>
              </View>
            </View>

            <View style={styles.benefitsSection}>
              <Text style={styles.sectionTitle}>Your VIP Benefits</Text>
              {SUBSCRIPTION_PLANS.find(p => p.id === subscription?.planId)?.features.map((benefit, index) => (
                <View key={index} style={styles.benefitRow}>
                  <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                  <Text style={styles.benefitText}>{benefit}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity style={styles.cancelBtn} onPress={handleCancelSubscription}>
              <Ionicons name="close-circle" size={16} color="#ef4444" />
              <Text style={styles.cancelBtnText}>Cancel Subscription</Text>
            </TouchableOpacity>
          </>
        ) : (
          // Normal User - Show subscription plans
          <>
            <View style={styles.heroCard}>
              <View style={styles.vipBadge}>
                <Ionicons name="star" size={14} color="#fff" />
                <Text style={styles.vipBadgeText}>VIP</Text>
              </View>
              <Text style={styles.heroTitle}>Unlock Premium Savings</Text>
              <Text style={styles.heroSubtitle}>Get unlimited free requests, exclusive deals, and priority support.</Text>
            </View>

            <Text style={styles.sectionTitle}>Choose Your Plan</Text>

            {SUBSCRIPTION_PLANS.map((plan) => {
              const expanded = expandedIds.has(plan.id);
              return (
                <View key={plan.id} style={[styles.planCard, expanded && styles.planCardExpanded]}>
                  <TouchableOpacity activeOpacity={0.9} style={styles.planHeader} onPress={() => toggleExpand(plan.id)}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.planName}>{plan.name}</Text>
                      <Text style={styles.planDuration}>{plan.duration}</Text>
                    </View>
                    <View style={styles.planPriceWrap}>
                      <Text style={styles.planPrice}>₹{plan.price}</Text>
                    </View>
                    <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={18} color="#6b7280" />
                  </TouchableOpacity>

                  {plan.popular && (
                    <View style={styles.ribbon}><Text style={styles.ribbonText}>Most Popular</Text></View>
                  )}

                  {expanded && (
                    <View style={styles.planBody}>
                      {plan.features.map((feature, i) => (
                        <View key={i} style={styles.benefitRow}>
                          <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                          <Text style={styles.benefitText}>{feature}</Text>
                        </View>
                      ))}

                      <TouchableOpacity style={styles.ctaBtn} onPress={() => handleSubscribe(plan)}>
                        <Ionicons name="flash" size={16} color="#fff" />
                        <Text style={styles.ctaText}>Subscribe Now</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              );
            })}
          </>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Subscription Confirmation Modal */}
      <Modal visible={showConfirmModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModalCard}>
            <View style={styles.modalIconContainer}>
              <View style={styles.modalIconCircle}>
                <Ionicons name="star" size={32} color="#f59e0b" />
              </View>
            </View>

            <Text style={styles.modalTitle}>Confirm Subscription</Text>
            <Text style={styles.modalSubtitle}>
              You're about to subscribe to {selectedPlan?.name} for ₹{selectedPlan?.price}
            </Text>

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.modalButtonSecondary}
                onPress={() => setShowConfirmModal(false)}
              >
                <Text style={styles.modalButtonSecondaryText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalButtonPrimary}
                onPress={confirmSubscription}
              >
                <Ionicons name="checkmark-circle" size={18} color="#ffffff" />
                <Text style={styles.modalButtonPrimaryText}>Confirm & Pay</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>


      {/* Cancel Subscription Modal */}
      <Modal visible={showCancelModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.cancelModalCard}>
            <View style={styles.cancelModalIconContainer}>
              <View style={styles.cancelModalIconCircle}>
                <Ionicons name="warning" size={40} color="#ef4444" />
              </View>
            </View>

            <Text style={styles.cancelModalTitle}>Cancel VIP Subscription?</Text>
            <Text style={styles.cancelModalSubtitle}>
              You'll lose access to all premium benefits and exclusive features. This action cannot be undone.
            </Text>



            <View style={styles.cancelModalButtonContainer}>
              <TouchableOpacity
                style={styles.cancelModalButtonSecondary}
                onPress={() => setShowCancelModal(false)}
              >
                <Ionicons name="arrow-back" size={18} color="#6b7280" />
                <Text style={styles.cancelModalButtonSecondaryText}>Keep VIP</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelModalButtonPrimary}
                onPress={confirmCancellation}
              >
                {/* <Ionicons name="close-circle" size={18} color="#ffffff" /> */}
                <Text style={styles.cancelModalButtonPrimaryText}>Cancel Subscription</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Loading Modal */}
      <Modal visible={isLoading} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.loadingModalCard}>
            <ActivityIndicator size="large" color="#f59e0b" />
            <Text style={styles.loadingText}>Processing...</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingTop: 56, paddingBottom: 12, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#e5e7eb" },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center", backgroundColor: "#f3f4f6" },
  headerTitleWrap: { flexDirection: "row", alignItems: "center", gap: 8 },
  headerTitle: { fontSize: 16, fontWeight: "800", color: "#111827" },

  // Hero Cards
  heroCard: { backgroundColor: "#111827", borderRadius: 16, padding: 16, marginTop: 16, marginBottom: 16, shadowColor: "#000", shadowOpacity: 0.15, shadowOffset: { width: 0, height: 6 }, shadowRadius: 12, elevation: 4 },
  currentPlanCard: { backgroundColor: "#10b981", borderRadius: 16, padding: 16, marginTop: 16, marginBottom: 16, shadowColor: "#000", shadowOpacity: 0.15, shadowOffset: { width: 0, height: 6 }, shadowRadius: 12, elevation: 4 },
  vipBadge: { flexDirection: "row", alignItems: "center", backgroundColor: "#f59e0b", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, alignSelf: "flex-start" },
  vipBadgeText: { color: "#fff", fontWeight: "800", marginLeft: 6, fontSize: 12 },
  heroTitle: { color: "#fff", fontSize: 20, fontWeight: "800", marginTop: 10 },
  heroSubtitle: { color: "#d1d5db", fontSize: 13, marginTop: 6 },

  // Plan Details
  planDetails: { marginTop: 16, backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 12, padding: 12 },
  planDetailRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  planDetailLabel: { color: "#d1d5db", fontSize: 14, fontWeight: "600" },
  planDetailValue: { color: "#fff", fontSize: 14, fontWeight: "700" },

  // Benefits Section
  benefitsSection: { backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: "#000", shadowOpacity: 0.06, shadowOffset: { width: 0, height: 4 }, shadowRadius: 10, elevation: 2 },
  sectionTitle: { fontSize: 16, fontWeight: "800", color: "#111827", marginBottom: 10 },

  // Plan Cards
  planCard: { backgroundColor: "#fff", borderRadius: 16, borderWidth: 1, borderColor: "#e5e7eb", marginBottom: 12, shadowColor: "#000", shadowOpacity: 0.06, shadowOffset: { width: 0, height: 4 }, shadowRadius: 10, elevation: 2, position: "relative" },
  planCardExpanded: { borderColor: "#f59e0b" },
  planHeader: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 14, gap: 12 },
  planName: { fontSize: 16, fontWeight: "800", color: "#111827" },
  planDuration: { fontSize: 12, color: "#6b7280", marginTop: 2 },
  planPriceWrap: { alignItems: "flex-end", marginRight: 8 },
  planPrice: { fontSize: 18, fontWeight: "800", color: "#111827" },
  ribbon: { position: "absolute", top: -10, left: 16, backgroundColor: "#f59e0b", paddingHorizontal: 10, paddingVertical: 4, borderTopLeftRadius: 8, borderTopRightRadius: 8 },
  ribbonText: { color: "#fff", fontWeight: "800", fontSize: 10 },
  planBody: { paddingHorizontal: 16, paddingBottom: 16 },
  benefitRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 8 },
  benefitText: { fontSize: 13, color: "#374151" },
  ctaBtn: { marginTop: 14, height: 48, borderRadius: 12, backgroundColor: "#111827", alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 8 },
  ctaText: { color: "#fff", fontWeight: "800" },

  // Cancel Button
  cancelBtn: { marginTop: 16, height: 48, borderRadius: 12, backgroundColor: "#fef2f2", borderWidth: 1, borderColor: "#fecaca", alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 8 },
  cancelBtnText: { color: "#ef4444", fontWeight: "800" },

  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: "rgba(0, 0, 0, 0.5)", justifyContent: "center", alignItems: "center", padding: 16 },
  confirmModalCard: { backgroundColor: "#fff", borderRadius: 16, padding: 20, width: "100%", maxWidth: 360, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 8 },
  loadingModalCard: { backgroundColor: "#fff", borderRadius: 16, padding: 28, alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 8 },
  modalIconContainer: { alignItems: "center", marginBottom: 16 },
  modalIconCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: "#fef2f2", alignItems: "center", justifyContent: "center" },
  modalTitle: { fontSize: 20, fontWeight: "700", color: "#111827", textAlign: "center", marginBottom: 6 },
  modalSubtitle: { fontSize: 14, color: "#6b7280", textAlign: "center", marginBottom: 20 },

  // Cancel Modal Styles
  cancelModalCard: { backgroundColor: "#fff", borderRadius: 20, padding: 24, width: "100%", maxWidth: 380, shadowColor: "#000", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.25, shadowRadius: 16, elevation: 12 },
  cancelModalIconContainer: { alignItems: "center", marginBottom: 20 },
  cancelModalIconCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: "#fef2f2", alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: "#fecaca" },
  cancelModalTitle: { fontSize: 22, fontWeight: "800", color: "#111827", textAlign: "center", marginBottom: 8 },
  cancelModalSubtitle: { fontSize: 15, color: "#6b7280", textAlign: "center", marginBottom: 24, lineHeight: 22 },
  cancelBenefitsWarning: { backgroundColor: "#fef2f2", borderRadius: 12, padding: 16, marginBottom: 24, borderWidth: 1, borderColor: "#fecaca" },
  cancelWarningTitle: { fontSize: 16, fontWeight: "700", color: "#dc2626", marginBottom: 12 },
  cancelBenefitItem: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 8 },
  cancelBenefitText: { fontSize: 14, color: "#7f1d1d", fontWeight: "500" },
  cancelModalButtonContainer: { flexDirection: "row", gap: 12 },
  cancelModalButtonSecondary: { flex: 1, paddingVertical: 14, borderRadius: 12, backgroundColor: "#f8fafc", alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 6, borderWidth: 1, borderColor: "#e2e8f0" },
  cancelModalButtonSecondaryText: { fontSize: 15, fontWeight: "600", color: "#6b7280" },
  cancelModalButtonPrimary: { flex: 1, paddingVertical: 14, borderRadius: 12, backgroundColor: "#ef4444", alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 6 },
  cancelModalButtonPrimaryText: { fontSize: 15, fontWeight: "700", color: "#ffffff" },

  // Buttons
  modalButtonContainer: { flexDirection: "row", gap: 10 },
  modalButtonSecondary: { flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: "#f3f4f6", alignItems: "center" },
  modalButtonSecondaryText: { fontSize: 15, fontWeight: "600", color: "#6b7280" },
  modalButtonPrimary: { flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: "#f59e0b", alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 6 },
  modalButtonPrimaryText: { fontSize: 15, fontWeight: "700", color: "#ffffff" },
  loadingText: { fontSize: 16, fontWeight: "600", color: "#111827", marginTop: 12, textAlign: "center" },
});


