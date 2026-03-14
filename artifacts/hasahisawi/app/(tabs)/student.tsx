import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Linking,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { useFocusEffect } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import AnimatedPress from "@/components/AnimatedPress";
import Colors from "@/constants/colors";

import { useLang } from "@/lib/lang-context";

// ─── School ───────────────────────────────────────────────────────────────────

export type School = {
  id: string;
  name: string;
  type: "primary" | "secondary" | "institute" | "university";
  address: string;
  phone: string;
  grades?: string;
  shifts?: string;
};

export const SCHOOLS_KEY = "schools_v1";
const SCHOOLS_INIT_KEY = "schools_initialized";

const SEED_SCHOOLS: School[] = [
  { id: "sch1", name: "مدرسة حصاحيصا الأساسية الأولى", type: "primary", address: "حي الضحى، حصاحيصا", phone: "+249912345700", grades: "الصف الأول - الثامن", shifts: "صباحية" },
  { id: "sch2", name: "مدرسة البنات الأساسية", type: "primary", address: "حي السلام، حصاحيصا", phone: "+249912345701", grades: "الصف الأول - الثامن", shifts: "صباحية" },
  { id: "sch3", name: "ثانوية حصاحيصا الكبرى", type: "secondary", address: "المنطقة المركزية، حصاحيصا", phone: "+249912345702", grades: "الصف التاسع - الثاني عشر", shifts: "صباحية ومسائية" },
  { id: "sch4", name: "ثانوية البنات بحصاحيصا", type: "secondary", address: "شارع المدارس، حصاحيصا", phone: "+249912345703", grades: "الصف التاسع - الثاني عشر", shifts: "صباحية" },
  { id: "sch5", name: "معهد التقنية والحاسوب", type: "institute", address: "شارع السوق، حصاحيصا", phone: "+249912345704", grades: "شهادة تقنية", shifts: "صباحية ومسائية" },
  { id: "sch6", name: "كلية حصاحيصا الجامعية", type: "university", address: "جنوب حصاحيصا", phone: "+249912345705", grades: "بكالوريوس", shifts: "صباحية" },
];

export async function loadSchools(): Promise<School[]> {
  const init = await AsyncStorage.getItem(SCHOOLS_INIT_KEY);
  if (!init) {
    await AsyncStorage.setItem(SCHOOLS_KEY, JSON.stringify(SEED_SCHOOLS));
    await AsyncStorage.setItem(SCHOOLS_INIT_KEY, "1");
    return SEED_SCHOOLS;
  }
  const raw = await AsyncStorage.getItem(SCHOOLS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function getSchoolTypeLabel(type: School["type"], t: any) {
  switch (type) {
    case "primary": return t('student', 'schoolTypes').primary;
    case "secondary": return t('student', 'schoolTypes').secondary;
    case "institute": return t('student', 'schoolTypes').institute;
    case "university": return t('student', 'institutionTypes').university;
  }
}

export function getSchoolTypeColor(type: School["type"]) {
  switch (type) {
    case "primary": return Colors.primary;
    case "secondary": return "#2E7D9A";
    case "institute": return "#6A5ACD";
    case "university": return Colors.accent;
  }
}

export function getSchoolTypeIcon(type: School["type"]) {
  switch (type) {
    case "primary": return "school-outline";
    case "secondary": return "library-outline";
    case "institute": return "hardware-chip-outline";
    case "university": return "book-outline";
  }
}

// ─── Institution ──────────────────────────────────────────────────────────────

export type Institution = {
  id: string;
  name: string;
  type: "kindergarten" | "primary" | "secondary" | "university" | "institute" | "training" | "quran" | "other";
  address: string;
  phone: string;
  description?: string;
  website?: string;
};

export const INSTITUTIONS_KEY = "institutions_v1";

export async function loadInstitutions(): Promise<Institution[]> {
  const raw = await AsyncStorage.getItem(INSTITUTIONS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function getInstitutionTypeLabel(type: Institution["type"], t: any) {
  switch (type) {
    case "kindergarten": return t('student', 'schoolTypes').khalwa; // Closest match if kindergarten missing or use common
    case "primary":      return t('student', 'schoolTypes').primary;
    case "secondary":    return t('student', 'schoolTypes').secondary;
    case "university":   return t('student', 'institutionTypes').university;
    case "institute":    return t('student', 'institutionTypes').institute;
    case "training":     return t('student', 'institutionTypes').training;
    case "quran":        return t('student', 'schoolTypes').khalwa;
    case "other":        return t('missing', 'categories').other;
  }
}

export function getInstitutionTypeColor(type: Institution["type"]) {
  switch (type) {
    case "kindergarten": return "#E67E22";
    case "primary":      return Colors.primary;
    case "secondary":    return "#2E7D9A";
    case "university":   return Colors.accent;
    case "institute":    return "#6A5ACD";
    case "training":     return "#1E6E8A";
    case "quran":        return "#27AE60";
    case "other":        return Colors.textSecondary;
  }
}

export function getInstitutionTypeIcon(type: Institution["type"]) {
  switch (type) {
    case "kindergarten": return "happy-outline";
    case "primary":      return "school-outline";
    case "secondary":    return "library-outline";
    case "university":   return "book-outline";
    case "institute":    return "hardware-chip-outline";
    case "training":     return "barbell-outline";
    case "quran":        return "star-outline";
    case "other":        return "grid-outline";
  }
}

// ─── Static Data ──────────────────────────────────────────────────────────────

const STUDENT_SERVICES = [
  { id: "ss1", title: "نتائج الشهادة السودانية", description: "الاستعلام عن نتائج امتحانات الشهادة", icon: "school-outline", color: "#2E7D9A" },
  { id: "ss2", title: "مكتب التربية والتعليم", description: "التسجيل والنقل والوثائق الرسمية", icon: "document-text-outline", color: Colors.primary },
  { id: "ss3", title: "المكتبة العامة", description: "استعارة الكتب والمراجع الدراسية", icon: "library-outline", color: "#6A5ACD" },
  { id: "ss4", title: "الدروس الخصوصية", description: "دليل المدرسين والمراكز التعليمية", icon: "people-outline", color: Colors.accent },
  { id: "ss5", title: "المنح الدراسية", description: "فرص المنح المحلية والخارجية", icon: "ribbon-outline", color: "#E67E22" },
  { id: "ss6", title: "النشاط الطلابي", description: "الأندية والفعاليات الطلابية", icon: "trophy-outline", color: "#C0392B" },
];

const SCHOOL_FILTERS = [
  { key: "all", label: "الكل" },
  { key: "primary", label: "أساسي" },
  { key: "secondary", label: "ثانوي" },
  { key: "institute", label: "معاهد" },
  { key: "university", label: "جامعي" },
];

const INSTITUTION_FILTERS = [
  { key: "all",         label: "الكل" },
  { key: "kindergarten",label: "روضة" },
  { key: "primary",     label: "أساسي" },
  { key: "secondary",   label: "ثانوي" },
  { key: "university",  label: "جامعة" },
  { key: "institute",   label: "معهد" },
  { key: "training",    label: "تدريب" },
  { key: "quran",       label: "قرآن" },
];

// ─── Institution Card ─────────────────────────────────────────────────────────

function InstitutionCard({ item, onCall, t, isRTL }: { item: Institution; onCall: (p: string) => void; t: any; isRTL: boolean }) {
  const color = getInstitutionTypeColor(item.type);
  return (
    <View style={styles.schoolCard}>
      <View style={[styles.schoolCardTop, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <AnimatedPress style={styles.callBtn} onPress={() => onCall(item.phone)}>
          <Ionicons name="call" size={18} color={Colors.cardBg} />
        </AnimatedPress>
        <View style={[styles.schoolInfo, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
          <Text style={[styles.schoolName, { textAlign: isRTL ? 'right' : 'left' }]}>{item.name}</Text>
          <View style={[styles.typeRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <Ionicons name={getInstitutionTypeIcon(item.type) as any} size={13} color={color} />
            <Text style={[styles.typeLabel, { color }]}>{getInstitutionTypeLabel(item.type, t)}</Text>
          </View>
          {item.description ? (
            <Text style={[styles.institutionDesc, { textAlign: isRTL ? 'right' : 'left' }]} numberOfLines={2}>{item.description}</Text>
          ) : null}
        </View>
        <View style={[styles.schoolIconCircle, { backgroundColor: color + "18" }]}>
          <Ionicons name={getInstitutionTypeIcon(item.type) as any} size={24} color={color} />
        </View>
      </View>
      <View style={styles.cardDivider} />
      <View style={styles.schoolDetails}>
        <View style={[styles.detailRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <Text style={[styles.detailValue, { textAlign: isRTL ? 'right' : 'left' }]}>{item.address}</Text>
          <Ionicons name="location-outline" size={13} color={Colors.textMuted} />
        </View>
        {item.website ? (
          <View style={[styles.detailRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <Text style={[styles.detailValue, { textAlign: isRTL ? 'right' : 'left' }]}>{item.website}</Text>
            <Ionicons name="globe-outline" size={13} color={Colors.textMuted} />
          </View>
        ) : null}
      </View>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

type Tab = "services" | "schools" | "institutions";

export default function StudentScreen() {
  const { t, isRTL, lang } = useLang();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const [activeTab, setActiveTab] = useState<Tab>("services");
  const [schoolFilter, setSchoolFilter] = useState("all");
  const [instFilter, setInstFilter] = useState("all");
  const [schools, setSchools] = useState<School[]>([]);
  const [institutions, setInstitutions] = useState<Institution[]>([]);

  const TAB_OPTIONS: { key: Tab; label: string }[] = [
    { key: "services", label: t('common', 'details') },
    { key: "schools", label: t('student', 'schools') },
    { key: "institutions", label: t('student', 'institutions') },
  ];

  const SCHOOL_FILTERS = [
    { key: "all", label: t('common', 'all') },
    { key: "primary", label: t('student', 'schoolTypes').primary },
    { key: "secondary", label: t('student', 'schoolTypes').secondary },
    { key: "institute", label: t('student', 'institutionTypes').institute },
    { key: "university", label: t('student', 'institutionTypes').university },
  ];

  const INSTITUTION_FILTERS = [
    { key: "all",         label: t('common', 'all') },
    { key: "kindergarten",label: t('student', 'schoolTypes').khalwa },
    { key: "primary",     label: t('student', 'schoolTypes').primary },
    { key: "secondary",   label: t('student', 'schoolTypes').secondary },
    { key: "university",  label: t('student', 'institutionTypes').university },
    { key: "institute",   label: t('student', 'institutionTypes').institute },
    { key: "training",    label: t('student', 'institutionTypes').training },
    { key: "quran",       label: t('student', 'schoolTypes').khalwa },
  ];

  const load = async () => {
    const [schs, insts] = await Promise.all([loadSchools(), loadInstitutions()]);
    setSchools(schs);
    setInstitutions(insts);
  };

  useEffect(() => { load(); }, []);
  useFocusEffect(useCallback(() => { load(); }, []));

  const filteredSchools = schools.filter(s => schoolFilter === "all" || s.type === schoolFilter);
  const filteredInstitutions = institutions.filter(i => instFilter === "all" || i.type === instFilter);

  const handleCall = (phone: string) => {
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL(`tel:${phone}`);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 16 }]}>
        <Text style={[styles.headerTitle, { textAlign: isRTL ? 'right' : 'left' }]}>{t('student', 'title')}</Text>
        <View style={[styles.tabSwitch, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          {TAB_OPTIONS.map(tab => (
            <AnimatedPress
              key={tab.key}
              style={[styles.switchBtn, activeTab === tab.key && styles.switchBtnActive]}
              onPress={() => setActiveTab(tab.key)}
              scaleDown={0.92}
            >
              <Text style={[styles.switchBtnText, activeTab === tab.key && styles.switchBtnTextActive]}>
                {tab.label}
              </Text>
            </AnimatedPress>
          ))}
        </View>
      </View>

      {/* Services Tab */}
      {activeTab === "services" && (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: Platform.OS === "web" ? 100 : 120 }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.servicesGrid, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            {STUDENT_SERVICES.map((service, index) => (
              <Animated.View key={service.id} entering={FadeInDown.delay(index * 60).springify().damping(18)}>
                <AnimatedPress
                  style={[styles.serviceCard, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}
                  onPress={() => { if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
                >
                  <View style={[styles.serviceIconCircle, { backgroundColor: service.color + "18" }]}>
                    <Ionicons name={service.icon as any} size={28} color={service.color} />
                  </View>
                  <Text style={[styles.serviceTitle, { textAlign: isRTL ? 'right' : 'left' }]}>{service.title}</Text>
                  <Text style={[styles.serviceDesc, { textAlign: isRTL ? 'right' : 'left' }]}>{service.description}</Text>
                </AnimatedPress>
              </Animated.View>
            ))}
          </View>
          <View style={styles.tipsCard}>
            <View style={[styles.tipsHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Ionicons name="bulb-outline" size={18} color={Colors.accent} />
              <Text style={styles.tipsTitle}>{lang === 'ar' ? 'نصيحة اليوم' : 'Tip of the Day'}</Text>
            </View>
            <Text style={[styles.tipsText, { textAlign: isRTL ? 'right' : 'left' }]}>
              {lang === 'ar' 
                ? 'تذكر أن التسجيل في مكتب التربية والتعليم يكون في بداية العام الدراسي. تأكد من استيفاء جميع المستندات المطلوبة مسبقاً.'
                : 'Remember that registration at the Office of Education is at the beginning of the school year. Make sure all required documents are met in advance.'}
            </Text>
          </View>
        </ScrollView>
      )}

      {/* Schools Tab */}
      {activeTab === "schools" && (
        <View style={styles.flex1}>
          <ScrollView
            horizontal showsHorizontalScrollIndicator={false}
            style={styles.filtersRow} contentContainerStyle={[styles.filtersContent, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
          >
            {SCHOOL_FILTERS.map(opt => (
              <AnimatedPress
                key={opt.key}
                style={[styles.filterChip, schoolFilter === opt.key && styles.filterChipActive]}
                onPress={() => setSchoolFilter(opt.key)}
                scaleDown={0.92}
              >
                <Text style={[styles.filterChipText, schoolFilter === opt.key && styles.filterChipTextActive]}>{opt.label}</Text>
              </AnimatedPress>
            ))}
          </ScrollView>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={[styles.scrollContent, { paddingBottom: Platform.OS === "web" ? 100 : 120 }]}
            showsVerticalScrollIndicator={false}
          >
            {filteredSchools.length === 0 && (
              <View style={styles.emptyState}>
                <Ionicons name="school-outline" size={48} color={Colors.textMuted} />
                <Text style={styles.emptyText}>{t('student', 'noSchools')}</Text>
              </View>
            )}
            {filteredSchools.map((school, index) => {
              const color = getSchoolTypeColor(school.type);
              return (
                <Animated.View key={school.id} entering={FadeInDown.delay(index * 60).springify().damping(18)}>
                <View style={styles.schoolCard}>
                  <View style={[styles.schoolCardTop, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                    <AnimatedPress style={styles.callBtn} onPress={() => handleCall(school.phone)}>
                      <Ionicons name="call" size={18} color={Colors.cardBg} />
                    </AnimatedPress>
                    <View style={[styles.schoolInfo, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
                      <Text style={[styles.schoolName, { textAlign: isRTL ? 'right' : 'left' }]}>{school.name}</Text>
                      <View style={[styles.typeRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                        <Ionicons name={getSchoolTypeIcon(school.type) as any} size={13} color={color} />
                        <Text style={[styles.typeLabel, { color }]}>{getSchoolTypeLabel(school.type, t)}</Text>
                      </View>
                    </View>
                    <View style={[styles.schoolIconCircle, { backgroundColor: color + "18" }]}>
                      <Ionicons name={getSchoolTypeIcon(school.type) as any} size={24} color={color} />
                    </View>
                  </View>
                  <View style={styles.cardDivider} />
                  <View style={styles.schoolDetails}>
                    <View style={[styles.detailRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                      <Text style={[styles.detailValue, { textAlign: isRTL ? 'right' : 'left' }]}>{school.address}</Text>
                      <Ionicons name="location-outline" size={13} color={Colors.textMuted} />
                    </View>
                    {school.grades && (
                      <View style={[styles.detailRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                        <Text style={[styles.detailValue, { textAlign: isRTL ? 'right' : 'left' }]}>{school.grades}</Text>
                        <Ionicons name="layers-outline" size={13} color={Colors.textMuted} />
                      </View>
                    )}
                    {school.shifts && (
                      <View style={[styles.detailRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                        <Text style={[styles.detailValue, { textAlign: isRTL ? 'right' : 'left' }]}>{school.shifts}</Text>
                        <Ionicons name="time-outline" size={13} color={Colors.textMuted} />
                      </View>
                    )}
                  </View>
                </View>
                </Animated.View>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* Institutions Tab */}
      {activeTab === "institutions" && (
        <View style={styles.flex1}>
          <ScrollView
            horizontal showsHorizontalScrollIndicator={false}
            style={styles.filtersRow} contentContainerStyle={[styles.filtersContent, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
          >
            {INSTITUTION_FILTERS.map(opt => (
              <AnimatedPress
                key={opt.key}
                style={[styles.filterChip, instFilter === opt.key && styles.filterChipActive]}
                onPress={() => setInstFilter(opt.key)}
                scaleDown={0.92}
              >
                <Text style={[styles.filterChipText, instFilter === opt.key && styles.filterChipTextActive]}>{opt.label}</Text>
              </AnimatedPress>
            ))}
          </ScrollView>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={[styles.scrollContent, { paddingBottom: Platform.OS === "web" ? 100 : 120 }]}
            showsVerticalScrollIndicator={false}
          >
            {filteredInstitutions.length === 0 && (
              <View style={styles.emptyState}>
                <Ionicons name="business-outline" size={52} color={Colors.textMuted} />
                <Text style={styles.emptyTitle}>{t('student', 'noInstitutions')}</Text>
                <Text style={styles.emptySubText}>{lang === 'ar' ? 'تُضاف المؤسسات من لوحة الإدارة' : 'Institutions are added from the admin panel'}</Text>
              </View>
            )}
            {filteredInstitutions.map((item, index) => (
              <Animated.View key={item.id} entering={FadeInDown.delay(index * 60).springify().damping(18)}>
                <InstitutionCard item={item} onCall={handleCall} t={t} isRTL={isRTL} />
              </Animated.View>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  flex1: { flex: 1 },
  header: {
    backgroundColor: Colors.cardBg, paddingHorizontal: 16, paddingBottom: 14,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 3,
  },
  headerTitle: { fontFamily: "Cairo_700Bold", fontSize: 22, color: Colors.textPrimary, textAlign: "right", marginBottom: 12 },
  tabSwitch: { flexDirection: "row-reverse", backgroundColor: Colors.bg, borderRadius: 12, padding: 3, gap: 2 },
  switchBtn: { flex: 1, paddingVertical: 8, borderRadius: 10, alignItems: "center" },
  switchBtnActive: {
    backgroundColor: Colors.cardBg,
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 2, elevation: 2,
  },
  switchBtnText: { fontFamily: "Cairo_500Medium", fontSize: 13, color: Colors.textMuted },
  switchBtnTextActive: { color: Colors.textPrimary, fontFamily: "Cairo_600SemiBold" },
  filtersRow: { backgroundColor: Colors.cardBg, borderBottomWidth: 1, borderBottomColor: Colors.divider },
  filtersContent: { flexDirection: "row-reverse", gap: 8, paddingHorizontal: 16, paddingVertical: 10 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, backgroundColor: Colors.bg, borderWidth: 1, borderColor: Colors.divider },
  filterChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterChipText: { fontFamily: "Cairo_500Medium", fontSize: 13, color: Colors.textSecondary },
  filterChipTextActive: { color: "#FFFFFF" },
  scroll: { flex: 1 },
  scrollContent: { padding: 14, gap: 12 },
  emptyState: { alignItems: "center", paddingTop: 70, gap: 10 },
  emptyTitle: { fontFamily: "Cairo_600SemiBold", fontSize: 17, color: Colors.textSecondary },
  emptyText: { fontFamily: "Cairo_500Medium", fontSize: 16, color: Colors.textMuted },
  emptySubText: { fontFamily: "Cairo_400Regular", fontSize: 13, color: Colors.textMuted },
  servicesGrid: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 10 },
  serviceCard: {
    width: "47.5%", backgroundColor: Colors.cardBg, borderRadius: 16, padding: 16,
    alignItems: "flex-end", shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 4, elevation: 2, gap: 10,
  },
  serviceIconCircle: { width: 52, height: 52, borderRadius: 14, justifyContent: "center", alignItems: "center" },
  serviceTitle: { fontFamily: "Cairo_600SemiBold", fontSize: 14, color: Colors.textPrimary, textAlign: "right" },
  serviceDesc: { fontFamily: "Cairo_400Regular", fontSize: 12, color: Colors.textMuted, textAlign: "right", lineHeight: 18 },
  tipsCard: { backgroundColor: Colors.accent + "18", borderRadius: 16, padding: 16, gap: 10, marginTop: 4 },
  tipsHeader: { flexDirection: "row-reverse", alignItems: "center", gap: 8 },
  tipsTitle: { fontFamily: "Cairo_600SemiBold", fontSize: 15, color: Colors.accent },
  tipsText: { fontFamily: "Cairo_400Regular", fontSize: 13, color: Colors.textSecondary, textAlign: "right", lineHeight: 22 },
  schoolCard: {
    backgroundColor: Colors.cardBg, borderRadius: 16, overflow: "hidden",
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
    borderWidth: 1, borderColor: Colors.divider,
  },
  schoolCardTop: { flexDirection: "row-reverse", alignItems: "flex-start", padding: 14, gap: 12 },
  schoolIconCircle: { width: 48, height: 48, borderRadius: 12, justifyContent: "center", alignItems: "center", flexShrink: 0 },
  schoolInfo: { flex: 1, alignItems: "flex-end", gap: 4 },
  schoolName: { fontFamily: "Cairo_600SemiBold", fontSize: 15, color: Colors.textPrimary, textAlign: "right" },
  institutionDesc: { fontFamily: "Cairo_400Regular", fontSize: 12, color: Colors.textSecondary, textAlign: "right", lineHeight: 18 },
  typeRow: { flexDirection: "row-reverse", alignItems: "center", gap: 4 },
  typeLabel: { fontFamily: "Cairo_500Medium", fontSize: 12 },
  callBtn: { width: 42, height: 42, borderRadius: 12, backgroundColor: Colors.primary, justifyContent: "center", alignItems: "center" },
  cardDivider: { height: 1, backgroundColor: Colors.divider, marginHorizontal: 14 },
  schoolDetails: { padding: 14, gap: 7 },
  detailRow: { flexDirection: "row-reverse", alignItems: "center", gap: 7 },
  detailValue: { fontFamily: "Cairo_400Regular", fontSize: 13, color: Colors.textSecondary, textAlign: "right", flex: 1 },
});
