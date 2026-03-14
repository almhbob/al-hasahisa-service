import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  ImageBackground,
  Dimensions,
} from "react-native";
import Animated, { FadeInDown, FadeIn, FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { useAuth } from "@/lib/auth-context";
import AuthModal from "@/components/AuthModal";
import AnimatedPress from "@/components/AnimatedPress";
import { useLang } from "@/lib/lang-context";

const { width } = Dimensions.get("window");

type ServiceItem = {
  id: string;
  label: string;
  sub: string;
  icon: any;
  color: string;
  bg: string;
  route: any;
  iconType: "ionicons" | "material";
};

function ServiceGridItem({
  item,
  onPress,
  isRTL,
  index,
}: {
  item: ServiceItem;
  onPress: () => void;
  isRTL: boolean;
  index: number;
}) {
  return (
    <Animated.View entering={FadeInDown.delay(200 + index * 50).springify().damping(18)} style={styles.gridItemContainer}>
      <AnimatedPress onPress={onPress}>
        <View style={styles.gridItem}>
          <View style={[styles.gridIconWrap, { backgroundColor: item.bg }]}>
            {item.iconType === "ionicons" ? (
              <Ionicons name={item.icon} size={24} color={item.color} />
            ) : (
              <MaterialCommunityIcons name={item.icon} size={24} color={item.color} />
            )}
          </View>
          <Text style={styles.gridLabel} numberOfLines={1}>{item.label}</Text>
          <Text style={styles.gridSub} numberOfLines={1}>{item.sub}</Text>
        </View>
      </AnimatedPress>
    </Animated.View>
  );
}

export default function HomeScreen() {
  const { t, isRTL, lang } = useLang();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const auth = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  const SERVICES = useMemo(() => [
    {
      id: "medical",
      label: t('home','medical').label,
      sub: t('home','medical').sub,
      icon: "medkit",
      iconType: "ionicons" as const,
      color: "#3B82F6",
      bg: "#3B82F620",
      route: "/(tabs)/medical" as const,
    },
    {
      id: "lost",
      label: t('home','lost').label,
      sub: t('home','lost').sub,
      icon: "search",
      iconType: "ionicons" as const,
      color: "#F59E0B",
      bg: "#F59E0B20",
      route: "/(tabs)/missing" as const,
    },
    {
      id: "student",
      label: t('home','student').label,
      sub: t('home','student').sub,
      icon: "school",
      iconType: "ionicons" as const,
      color: "#8B5CF6",
      bg: "#8B5CF620",
      route: "/(tabs)/student" as const,
    },
    {
      id: "jobs",
      label: t('home','jobsService').label,
      sub: t('home','jobsService').sub,
      icon: "briefcase",
      iconType: "ionicons" as const,
      color: "#10B981",
      bg: "#10B98120",
      route: "/(tabs)/jobs" as const,
    },
    {
      id: "market",
      label: t('home','marketService').label,
      sub: t('home','marketService').sub,
      icon: "storefront",
      iconType: "ionicons" as const,
      color: "#F97316",
      bg: "#F9731620",
      route: "/(tabs)/market" as const,
    },
    {
      id: "sports",
      label: t('home','sports').label,
      sub: t('home','sports').sub,
      icon: "football",
      iconType: "ionicons" as const,
      color: "#22C55E",
      bg: "#22C55E20",
      route: "/(tabs)/sports" as const,
    },
    {
      id: "culture",
      label: t('home','culture').label,
      sub: t('home','culture').sub,
      icon: "palette",
      iconType: "material" as const,
      color: "#EC4899",
      bg: "#EC489920",
      route: "/(tabs)/culture" as const,
    },
    {
      id: "social",
      label: t('home','social').label,
      sub: t('home','social').sub,
      icon: "chatbubbles",
      iconType: "ionicons" as const,
      color: "#06B6D4",
      bg: "#06B6D420",
      route: "/(tabs)/social" as const,
    },
    {
      id: "calendar",
      label: t('home','calendarService').label,
      sub: t('home','calendarService').sub,
      icon: "calendar",
      iconType: "ionicons" as const,
      color: "#EAB308",
      bg: "#EAB30820",
      route: "/(tabs)/calendar" as const,
    },
    {
      id: "women",
      label: t('home','womenService').label,
      sub: t('home','womenService').sub,
      icon: "face-woman",
      iconType: "material" as const,
      color: "#F472B6",
      bg: "#F472B620",
      route: "/(tabs)/women" as const,
    },
    {
      id: "orgs",
      label: t('home','orgsService').label,
      sub: t('home','orgsService').sub,
      icon: "hand-heart",
      iconType: "material" as const,
      color: "#6366F1",
      bg: "#6366F120",
      route: "/(tabs)/orgs" as const,
    },
  ], [lang]);

  const handlePress = (route: string) => {
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(route as any);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: Platform.OS === "web" ? 100 : 120 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero Section with Landmark Image */}
      <ImageBackground
        source={require("@/assets/images/landmark.jpg")}
        style={[styles.hero, { paddingTop: topPad + 20 }]}
        imageStyle={styles.heroImage}
      >
        <LinearGradient
          colors={["rgba(7,13,20,0.4)", "rgba(7,13,20,0.95)"]}
          style={StyleSheet.absoluteFill}
        />
        
        <View style={styles.heroContent}>
          <Animated.View entering={FadeIn.delay(100).duration(800)}>
            <Text style={[styles.appTitle, { textAlign: isRTL ? "right" : "left" }]}>{t('home','appTitle')}</Text>
            <View style={[styles.accentLine, { alignSelf: isRTL ? "flex-end" : "flex-start" }]} />
            <Text style={[styles.appSubtitle, { textAlign: isRTL ? "right" : "left" }]}>{t('home','appSubtitle')}</Text>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(300).springify()} style={[styles.statsRow, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
            <View style={styles.statCard}>
              <Ionicons name="add-circle-outline" size={20} color={Colors.primary} />
              <Text style={styles.statNum}>١٢+</Text>
              <Text style={styles.statLabel}>{t('home','pharmacies')}</Text>
            </View>
            <View style={[styles.statCard, styles.statCardActive]}>
              <Ionicons name="briefcase-outline" size={20} color={Colors.accent} />
              <Text style={styles.statNum}>٤٨+</Text>
              <Text style={styles.statLabel}>{t('home','jobs')}</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="school-outline" size={20} color="#8B5CF6" />
              <Text style={styles.statNum}>٦</Text>
              <Text style={styles.statLabel}>{t('home','schools')}</Text>
            </View>
          </Animated.View>
        </View>
      </ImageBackground>

      <View style={styles.body}>
        {/* Services Section */}
        <View style={[styles.sectionHeader, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
          <Text style={styles.sectionTitle}>{t('home','services')}</Text>
          <View style={styles.sectionLine} />
        </View>

        <View style={styles.gridContainer}>
          {SERVICES.map((item, idx) => (
            <ServiceGridItem key={item.id} item={item} onPress={() => handlePress(item.route)} isRTL={isRTL} index={idx} />
          ))}
        </View>

        {/* User Auth / Admin Section */}
        <View style={styles.footerActions}>
          {auth.user ? (
            <AnimatedPress onPress={() => auth.logout()}>
              <View style={[styles.actionStrip, { borderColor: Colors.danger + "40" }]}>
                <Ionicons name="log-out-outline" size={20} color={Colors.danger} />
                <Text style={[styles.actionText, { color: Colors.danger }]}>{t('auth', 'logout')} ({auth.user.name})</Text>
              </View>
            </AnimatedPress>
          ) : (
            <AnimatedPress onPress={() => setShowAuth(true)}>
              <View style={styles.actionStrip}>
                <Ionicons name="person-outline" size={20} color={Colors.primary} />
                <Text style={styles.actionText}>{t('home', 'login')} / {t('home', 'register')}</Text>
              </View>
            </AnimatedPress>
          )}
          
          <AnimatedPress onPress={() => handlePress("/(tabs)/settings")}>
            <View style={[styles.actionStrip, { marginTop: 12, borderColor: Colors.accent + "40" }]}>
              <Ionicons name="shield-checkmark-outline" size={20} color={Colors.accent} />
              <Text style={[styles.actionText, { color: Colors.accent }]}>{t('admin', 'title')}</Text>
            </View>
          </AnimatedPress>
        </View>
      </View>

      <AuthModal visible={showAuth} onClose={() => setShowAuth(false)} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  hero: {
    height: 320,
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  heroImage: {
    resizeMode: "cover",
  },
  heroContent: {
    zIndex: 1,
  },
  appTitle: {
    fontFamily: "Cairo_700Bold",
    fontSize: 42,
    color: "#FFFFFF",
    lineHeight: 50,
  },
  accentLine: {
    width: 40,
    height: 4,
    backgroundColor: Colors.accent,
    borderRadius: 2,
    marginVertical: 8,
  },
  appSubtitle: {
    fontFamily: "Cairo_400Regular",
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 24,
  },
  statsRow: {
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 16,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  statCardActive: {
    borderColor: Colors.accent + "60",
    backgroundColor: Colors.accent + "15",
  },
  statNum: {
    fontFamily: "Cairo_700Bold",
    fontSize: 20,
    color: "#FFFFFF",
    marginTop: 4,
  },
  statLabel: {
    fontFamily: "Cairo_400Regular",
    fontSize: 12,
    color: "rgba(255,255,255,0.6)",
  },
  body: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  sectionHeader: {
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: "Cairo_700Bold",
    fontSize: 22,
    color: "#FFFFFF",
  },
  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.divider,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  gridItemContainer: {
    width: (width - 32 - 12) / 2,
    marginBottom: 4,
  },
  gridItem: {
    backgroundColor: Colors.cardBg,
    borderRadius: 20,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.divider,
    height: 140,
    justifyContent: "center",
  },
  gridIconWrap: {
    width: 50,
    height: 50,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  gridLabel: {
    fontFamily: "Cairo_700Bold",
    fontSize: 15,
    color: "#FFFFFF",
    textAlign: "center",
  },
  gridSub: {
    fontFamily: "Cairo_400Regular",
    fontSize: 11,
    color: Colors.textSecondary,
    textAlign: "center",
    marginTop: 2,
  },
  footerActions: {
    marginTop: 30,
    marginBottom: 20,
  },
  actionStrip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.divider,
    gap: 12,
  },
  actionText: {
    fontFamily: "Cairo_600SemiBold",
    fontSize: 15,
    color: Colors.primary,
    flex: 1,
  },
});
