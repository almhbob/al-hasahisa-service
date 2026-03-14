import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  ImageBackground,
  Dimensions,
  Image,
} from "react-native";
import Animated, {
  FadeInDown, FadeIn, FadeInUp, FadeInRight,
} from "react-native-reanimated";
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
const LOGO       = require("@/assets/images/logo.png");
const CITY_IMAGE = require("@/assets/images/hasahisa-city.jpg");

type ServiceItem = {
  id: string; label: string; sub: string; icon: any;
  color: string; bg: string; route: any; iconType: "ionicons" | "material";
};

function ServiceGridItem({
  item, onPress, index,
}: { item: ServiceItem; onPress: () => void; index: number }) {
  return (
    <Animated.View
      entering={FadeInDown.delay(180 + index * 45).springify().damping(16)}
      style={styles.gridItemContainer}
    >
      <AnimatedPress onPress={onPress}>
        <View style={styles.gridItem}>
          {/* توهج خلفي للبطاقة */}
          <View style={[styles.gridGlow, { backgroundColor: item.color + "12" }]} />
          <View style={[styles.gridIconWrap, { backgroundColor: item.color + "18", borderColor: item.color + "40" }]}>
            {item.iconType === "ionicons"
              ? <Ionicons name={item.icon} size={26} color={item.color} />
              : <MaterialCommunityIcons name={item.icon} size={26} color={item.color} />}
          </View>
          <Text style={styles.gridLabel} numberOfLines={1}>{item.label}</Text>
          <Text style={styles.gridSub} numberOfLines={1}>{item.sub}</Text>
          {/* حد نيوني سفلي */}
          <View style={[styles.gridBottomLine, { backgroundColor: item.color + "80" }]} />
        </View>
      </AnimatedPress>
    </Animated.View>
  );
}

export default function HomeScreen() {
  const { t, isRTL, lang } = useLang();
  const insets  = useSafeAreaInsets();
  const topPad  = Platform.OS === "web" ? 67 : insets.top;
  const auth    = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  const SERVICES = useMemo(() => [
    { id: "medical",   label: t('home','medical').label,         sub: t('home','medical').sub,         icon: "medkit",            iconType: "ionicons"  as const, color: "#00CFFF", bg: "#00CFFF20", route: "/(tabs)/medical"   as const },
    { id: "lost",      label: t('home','lost').label,            sub: t('home','lost').sub,             icon: "search",            iconType: "ionicons"  as const, color: Colors.accent, bg: Colors.accent+"20", route: "/(tabs)/missing"   as const },
    { id: "student",   label: t('home','student').label,         sub: t('home','student').sub,          icon: "school",            iconType: "ionicons"  as const, color: "#A855F7", bg: "#A855F720", route: "/(tabs)/student"   as const },
    { id: "jobs",      label: t('home','jobsService').label,     sub: t('home','jobsService').sub,      icon: "briefcase",         iconType: "ionicons"  as const, color: Colors.primary, bg: Colors.primary+"20", route: "/(tabs)/jobs"   as const },
    { id: "market",    label: t('home','marketService').label,   sub: t('home','marketService').sub,    icon: "storefront",        iconType: "ionicons"  as const, color: "#FF6B35", bg: "#FF6B3520", route: "/(tabs)/market"    as const },
    { id: "sports",    label: t('home','sports').label,          sub: t('home','sports').sub,           icon: "football",          iconType: "ionicons"  as const, color: "#00D68F", bg: "#00D68F20", route: "/(tabs)/sports"    as const },
    { id: "culture",   label: t('home','culture').label,         sub: t('home','culture').sub,          icon: "palette",           iconType: "material"  as const, color: "#FF4FA3", bg: "#FF4FA320", route: "/(tabs)/culture"   as const },
    { id: "social",    label: t('home','social').label,          sub: t('home','social').sub,           icon: "chatbubbles",       iconType: "ionicons"  as const, color: "#00CFFF", bg: "#00CFFF20", route: "/(tabs)/social"    as const },
    { id: "calendar",  label: t('home','calendarService').label, sub: t('home','calendarService').sub,  icon: "calendar",          iconType: "ionicons"  as const, color: Colors.accent, bg: Colors.accent+"20", route: "/(tabs)/calendar"  as const },
    { id: "women",     label: t('home','womenService').label,    sub: t('home','womenService').sub,     icon: "face-woman",        iconType: "material"  as const, color: "#FF4FA3", bg: "#FF4FA320", route: "/(tabs)/women"     as const },
    { id: "orgs",        label: t('home','orgsService').label,     sub: t('home','orgsService').sub,      icon: "hand-heart",        iconType: "material"  as const, color: "#A855F7", bg: "#A855F720", route: "/(tabs)/orgs"         as const },
    { id: "appointments",label: "حجز المواعيد",                    sub: "صحي وحكومي",                     icon: "calendar",          iconType: "ionicons"  as const, color: Colors.accent,  bg: Colors.accent+"20",    route: "/(tabs)/appointments" as const },
    { id: "numbers",   label: "أرقام مهمة",                       sub: "طوارئ وخدمات",                   icon: "call",              iconType: "ionicons"  as const, color: "#00CFFF",  bg: "#00CFFF20",    route: "/(tabs)/numbers"      as const },
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
      {/* ═══ HERO ═══ */}
      <ImageBackground
        source={CITY_IMAGE}
        style={[styles.hero, { paddingTop: topPad }]}
        imageStyle={styles.heroImage}
      >
        {/* طبقة التدرج الثلاثية المستقبلية */}
        <LinearGradient
          colors={[
            "rgba(4,13,24,0.15)",
            "rgba(0,214,143,0.08)",
            "rgba(4,13,24,0.7)",
            "rgba(4,13,24,0.98)",
          ]}
          locations={[0, 0.3, 0.65, 1]}
          style={StyleSheet.absoluteFill}
        />

        {/* شريط علوي: الشعار + اسم التطبيق */}
        <Animated.View
          entering={FadeIn.delay(80).duration(700)}
          style={[styles.topBar, { flexDirection: isRTL ? "row-reverse" : "row" }]}
        >
          {/* الشعار */}
          <View style={styles.logoWrap}>
            <Image source={LOGO} style={styles.logoImg} resizeMode="contain" />
            <LinearGradient
              colors={["transparent", Colors.primary + "20"]}
              style={StyleSheet.absoluteFill}
            />
          </View>
          {/* العنوان */}
          <View style={{ flex: 1, marginHorizontal: 12 }}>
            <Text style={[styles.appTitle, { textAlign: isRTL ? "right" : "left" }]}>
              حصاحيصاوي
            </Text>
            <Text style={[styles.appSubtitle, { textAlign: isRTL ? "right" : "left" }]}>
              {t('home','appSubtitle')}
            </Text>
          </View>
          {/* أيقونة الإشعارات */}
          <AnimatedPress onPress={() => handlePress("/(tabs)/settings")}>
            <View style={styles.topBarIcon}>
              <Ionicons name="notifications-outline" size={20} color={Colors.primary} />
              <View style={styles.notifDot} />
            </View>
          </AnimatedPress>
        </Animated.View>

        {/* الحد النيوني */}
        <View style={styles.heroDivider} />

        {/* إحصائيات المدينة */}
        <Animated.View
          entering={FadeInUp.delay(250).springify().damping(14)}
          style={[styles.statsRow, { flexDirection: isRTL ? "row-reverse" : "row" }]}
        >
          {[
            { num: "١٢+", label: t('home','pharmacies'), icon: "medkit-outline",    color: "#00CFFF" },
            { num: "٤٨+", label: t('home','jobs'),       icon: "briefcase-outline", color: Colors.accent },
            { num: "٦",   label: t('home','schools'),    icon: "school-outline",    color: Colors.primary },
          ].map((stat, i) => (
            <Animated.View
              key={i}
              entering={FadeInUp.delay(300 + i * 80).springify()}
              style={styles.statCard}
            >
              <LinearGradient
                colors={[stat.color + "18", stat.color + "06"]}
                style={StyleSheet.absoluteFill}
              />
              <View style={[styles.statIcon, { borderColor: stat.color + "40" }]}>
                <Ionicons name={stat.icon as any} size={16} color={stat.color} />
              </View>
              <Text style={[styles.statNum, { color: stat.color }]}>{stat.num}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
              <View style={[styles.statGlowLine, { backgroundColor: stat.color }]} />
            </Animated.View>
          ))}
        </Animated.View>
      </ImageBackground>

      {/* ═══ BODY ═══ */}
      <View style={styles.body}>

        {/* شريط الهوية — الشعار وسط + توهج */}
        <Animated.View entering={FadeIn.delay(100).duration(800)} style={styles.brandBanner}>
          <LinearGradient
            colors={[Colors.primary + "18", Colors.accent + "10", Colors.primary + "08"]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={styles.brandBannerGrad}
          >
            <View style={styles.brandGlowLeft} />
            <Image source={LOGO} style={styles.brandLogo} resizeMode="contain" />
            <View style={{ flex: 1, marginHorizontal: 14 }}>
              <Text style={styles.brandTitle}>حصاحيصاوي</Text>
              <Text style={styles.brandSub}>بوابتك الذكية لمدينة الحصاحيصا</Text>
            </View>
            <View style={[styles.brandBadge, { backgroundColor: Colors.primary }]}>
              <Text style={styles.brandBadgeText}>v1.0</Text>
            </View>
            <View style={styles.brandGlowRight} />
          </LinearGradient>
        </Animated.View>

        {/* بانر حجز المواعيد */}
        <Animated.View entering={FadeInDown.delay(120).springify()} style={{ marginHorizontal: 0, marginBottom: 16 }}>
          <AnimatedPress onPress={() => handlePress("/(tabs)/appointments")}>
            <LinearGradient
              colors={[Colors.accent + "22", Colors.primary + "18", Colors.accent + "10"]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={styles.apptBanner}
            >
              <View style={[styles.apptBannerIcon, { borderColor: Colors.accent + "50" }]}>
                <Ionicons name="calendar" size={26} color={Colors.accent} />
              </View>
              <View style={{ flex: 1, marginHorizontal: 12 }}>
                <Text style={styles.apptBannerTitle}>احجز موعدك الآن</Text>
                <Text style={styles.apptBannerSub}>مستشفيات · عيادات · سجل مدني · محلية</Text>
              </View>
              <View style={[styles.apptBannerArrow, { backgroundColor: Colors.accent }]}>
                <Ionicons name="arrow-forward" size={16} color="#000" />
              </View>
            </LinearGradient>
          </AnimatedPress>
        </Animated.View>

        {/* عنوان قسم الخدمات */}
        <Animated.View entering={FadeInRight.delay(150).springify()} style={[styles.sectionHeader, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
          <LinearGradient
            colors={[Colors.primary, Colors.accent]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={styles.sectionAccentBar}
          />
          <Text style={styles.sectionTitle}>{t('home','services')}</Text>
          <View style={styles.sectionLine} />
          <View style={[styles.sectionDot, { backgroundColor: Colors.accent }]} />
        </Animated.View>

        {/* شبكة الخدمات */}
        <View style={styles.gridContainer}>
          {SERVICES.map((item, idx) => (
            <ServiceGridItem key={item.id} item={item} onPress={() => handlePress(item.route)} index={idx} />
          ))}
        </View>

        {/* قسم المستخدم */}
        <View style={styles.footerActions}>
          {auth.user && !auth.isGuest ? (
            <AnimatedPress onPress={() => auth.logout()}>
              <View style={[styles.actionStrip, { borderColor: Colors.danger + "40" }]}>
                <Ionicons name="log-out-outline" size={20} color={Colors.danger} />
                <Text style={[styles.actionText, { color: Colors.danger }]}>{t('auth', 'logout')} ({auth.user.name})</Text>
              </View>
            </AnimatedPress>
          ) : auth.isGuest ? (
            <AnimatedPress onPress={() => { auth.logout(); setShowAuth(true); }}>
              <LinearGradient
                colors={[Colors.accent + "18", Colors.primary + "12"]}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={[styles.actionStrip, { borderColor: Colors.accent + "50" }]}
              >
                <Ionicons name="eye-outline" size={20} color={Colors.accent} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.actionText, { color: Colors.accent }]}>أنت تتصفح كزائر</Text>
                  <Text style={{ fontFamily: "Cairo_400Regular", fontSize: 11, color: Colors.textSecondary }}>اضغط لتسجيل الدخول والنشر</Text>
                </View>
                <Ionicons name="person-circle-outline" size={20} color={Colors.accent} />
              </LinearGradient>
            </AnimatedPress>
          ) : (
            <AnimatedPress onPress={() => setShowAuth(true)}>
              <LinearGradient
                colors={[Colors.primary + "22", Colors.cyber + "12"]}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={[styles.actionStrip, { borderColor: Colors.primary + "50" }]}
              >
                <Ionicons name="person-outline" size={20} color={Colors.primary} />
                <Text style={[styles.actionText, { color: Colors.primary }]}>{t('home', 'login')} / {t('home', 'register')}</Text>
                <Ionicons name="chevron-forward" size={16} color={Colors.primary + "80"} />
              </LinearGradient>
            </AnimatedPress>
          )}

          <AnimatedPress onPress={() => handlePress("/(tabs)/settings")}>
            <View style={[styles.actionStrip, { marginTop: 10, borderColor: Colors.violet + "40" }]}>
              <Ionicons name="shield-checkmark-outline" size={20} color={Colors.violet} />
              <Text style={[styles.actionText, { color: Colors.violet }]}>{t('admin', 'title')}</Text>
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

  /* ══ HERO ══ */
  hero: {
    minHeight: 340,
    justifyContent: "flex-end",
    paddingHorizontal: 18,
    paddingBottom: 24,
  },
  heroImage: { resizeMode: "cover" },

  /* Top Bar */
  topBar: {
    alignItems: "center",
    marginBottom: 16,
    paddingTop: 8,
  },
  logoWrap: {
    width: 52, height: 52, borderRadius: 16,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    borderWidth: 1.5, borderColor: Colors.primary + "60",
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.6, shadowRadius: 12, elevation: 8,
  },
  logoImg: { width: "100%", height: "100%" },
  appTitle: {
    fontFamily: "Cairo_700Bold", fontSize: 24, color: "#FFFFFF",
    textShadowColor: Colors.primary + "80", textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 10,
  },
  appSubtitle: {
    fontFamily: "Cairo_400Regular", fontSize: 12, color: Colors.textSecondary, marginTop: 1,
  },
  topBarIcon: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: Colors.primary + "18", borderWidth: 1, borderColor: Colors.primary + "40",
    justifyContent: "center", alignItems: "center",
  },
  notifDot: {
    position: "absolute", top: 8, right: 8,
    width: 7, height: 7, borderRadius: 4, backgroundColor: Colors.accent,
  },

  /* Hero Divider */
  heroDivider: {
    height: 1,
    marginBottom: 16,
    backgroundColor: Colors.primary + "30",
  },

  /* Stats */
  statsRow: { gap: 10 },
  statCard: {
    flex: 1, borderRadius: 16, padding: 12, alignItems: "center",
    borderWidth: 1, borderColor: Colors.divider,
    backgroundColor: Colors.cardBg,
    overflow: "hidden",
  },
  statIcon: {
    width: 32, height: 32, borderRadius: 10,
    borderWidth: 1, justifyContent: "center", alignItems: "center",
    marginBottom: 6,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  statNum: {
    fontFamily: "Cairo_700Bold", fontSize: 22,
    textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 8,
  },
  statLabel: {
    fontFamily: "Cairo_400Regular", fontSize: 10, color: Colors.textSecondary, marginTop: 1,
  },
  statGlowLine: {
    position: "absolute", bottom: 0, left: 0, right: 0, height: 2, opacity: 0.7,
  },

  /* ══ BODY ══ */
  body: { paddingHorizontal: 16, paddingTop: 20, backgroundColor: Colors.bg },

  /* Brand Banner */
  brandBanner: {
    borderRadius: 20, overflow: "hidden",
    borderWidth: 1, borderColor: Colors.primary + "30",
    marginBottom: 28,
  },
  brandBannerGrad: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 16, paddingVertical: 14,
  },
  brandGlowLeft: {
    position: "absolute", left: -20, top: "50%", marginTop: -30,
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: Colors.primary, opacity: 0.12,
  },
  brandGlowRight: {
    position: "absolute", right: -20, top: "50%", marginTop: -30,
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: Colors.accent, opacity: 0.12,
  },
  brandLogo: { width: 44, height: 44, borderRadius: 10 },
  brandTitle: {
    fontFamily: "Cairo_700Bold", fontSize: 17, color: Colors.textPrimary,
  },
  brandSub: {
    fontFamily: "Cairo_400Regular", fontSize: 11, color: Colors.textSecondary, marginTop: 2,
  },
  brandBadge: {
    borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4,
  },
  brandBadgeText: {
    fontFamily: "Cairo_700Bold", fontSize: 11, color: "#000",
  },

  /* Section Header */
  sectionHeader: {
    alignItems: "center", gap: 10, marginBottom: 18,
  },
  sectionAccentBar: {
    width: 4, height: 22, borderRadius: 2,
  },
  sectionTitle: {
    fontFamily: "Cairo_700Bold", fontSize: 20, color: Colors.textPrimary,
  },
  sectionLine: {
    flex: 1, height: 1, backgroundColor: Colors.divider,
  },
  sectionDot: {
    width: 6, height: 6, borderRadius: 3,
  },

  /* Grid */
  gridContainer: {
    flexDirection: "row", flexWrap: "wrap",
    justifyContent: "space-between", gap: 12,
  },
  gridItemContainer: {
    width: (width - 32 - 12) / 2, marginBottom: 4,
  },
  gridItem: {
    backgroundColor: Colors.cardBg,
    borderRadius: 20, padding: 16,
    alignItems: "center", height: 148,
    justifyContent: "center",
    borderWidth: 1, borderColor: Colors.divider,
    overflow: "hidden",
  },
  gridGlow: {
    position: "absolute", bottom: 0, left: 0, right: 0, height: 60, borderRadius: 20,
  },
  gridIconWrap: {
    width: 54, height: 54, borderRadius: 16,
    justifyContent: "center", alignItems: "center",
    marginBottom: 10, borderWidth: 1,
  },
  gridLabel: {
    fontFamily: "Cairo_700Bold", fontSize: 14,
    color: Colors.textPrimary, textAlign: "center",
  },
  gridSub: {
    fontFamily: "Cairo_400Regular", fontSize: 10,
    color: Colors.textSecondary, textAlign: "center", marginTop: 2,
  },
  gridBottomLine: {
    position: "absolute", bottom: 0, left: 16, right: 16, height: 2, borderRadius: 1, opacity: 0.6,
  },

  /* Appointments Banner */
  apptBanner: {
    flexDirection: "row", alignItems: "center", borderRadius: 18,
    padding: 16, borderWidth: 1, borderColor: Colors.accent + "40",
    overflow: "hidden",
  },
  apptBannerIcon: {
    width: 50, height: 50, borderRadius: 14,
    backgroundColor: Colors.accent + "20",
    justifyContent: "center", alignItems: "center",
    borderWidth: 1,
  },
  apptBannerTitle: {
    fontFamily: "Cairo_700Bold", fontSize: 16, color: Colors.textPrimary,
  },
  apptBannerSub: {
    fontFamily: "Cairo_400Regular", fontSize: 12, color: Colors.textSecondary, marginTop: 2,
  },
  apptBannerArrow: {
    width: 32, height: 32, borderRadius: 10,
    justifyContent: "center", alignItems: "center",
  },

  /* Footer */
  footerActions: { marginTop: 28, marginBottom: 20, gap: 10 },
  actionStrip: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: Colors.cardBg, borderRadius: 16,
    padding: 16, borderWidth: 1, borderColor: Colors.divider, gap: 12,
  },
  actionText: {
    fontFamily: "Cairo_600SemiBold", fontSize: 15,
    color: Colors.textPrimary, flex: 1,
  },
});
