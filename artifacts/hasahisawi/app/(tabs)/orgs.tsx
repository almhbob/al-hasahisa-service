import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Linking,
  Platform,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { useFocusEffect } from "expo-router";
import Colors from "@/constants/colors";
import Animated, { FadeInDown } from "react-native-reanimated";
import AnimatedPress from "@/components/AnimatedPress";
import { useLang } from "@/lib/lang-context";

export type Organization = {
  id: string;
  name: string;
  type: "charity" | "initiative";
  description: string;
  contact: string;
  members?: number;
  rating?: number;
};

const ORGS_KEY = "orgs_v1";
const ORGS_INIT_KEY = "orgs_initialized";

const SEED_ORGS: Organization[] = [
  { id: "o1", name: "مبادرة شباب الحصاحيصا", type: "initiative", description: "مبادرة شبابية تهدف لتطوير الخدمات في المدينة ودعم المحتاجين.", contact: "+249912345611", members: 120, rating: 4.9 },
  { id: "o2", name: "جمعية البر الخيرية", type: "charity", description: "جمعية خيرية مسجلة تعنى بكفالة الأيتام ومساعدة الأسر المتعففة.", contact: "+249912345612", members: 45, rating: 4.7 },
  { id: "o3", name: "مبادرة شارع الحوادث", type: "initiative", description: "مبادرة طوعية لتوفير الأدوية والمستلزمات الطبية للحالات الطارئة.", contact: "+249912345613", members: 80, rating: 5.0 },
];

export default function OrgsScreen() {
  const { t, isRTL, lang } = useLang();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const [search, setSearch] = useState("");
  const [orgs, setOrgs] = useState<Organization[]>([]);

  const load = async () => {
    const init = await AsyncStorage.getItem(ORGS_INIT_KEY);
    if (!init) {
      await AsyncStorage.setItem(ORGS_KEY, JSON.stringify(SEED_ORGS));
      await AsyncStorage.setItem(ORGS_INIT_KEY, "1");
      setOrgs(SEED_ORGS);
    } else {
      const raw = await AsyncStorage.getItem(ORGS_KEY);
      setOrgs(raw ? JSON.parse(raw) : []);
    }
  };

  useEffect(() => { load(); }, []);
  useFocusEffect(useCallback(() => { load(); }, []));

  const filtered = orgs.filter((o) => {
    return search === "" || o.name.includes(search) || o.description.includes(search);
  });

  const handleContact = (phone: string) => {
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL(`tel:${phone}`);
  };

  const handleJoin = (name: string) => {
    Alert.alert(t('common', 'joinNow'), `${t('orgs', 'joinRequest')}: ${name}`);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: topPad + 16 }]}>
        <Text style={[styles.headerTitle, { textAlign: isRTL ? 'right' : 'left' }]}>{t('orgs', 'title')}</Text>
        <View style={[styles.searchRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <Ionicons name="search" size={18} color={Colors.textMuted} />
          <TextInput
            style={[styles.searchInput, { textAlign: isRTL ? 'right' : 'left' }]}
            placeholder={t('orgs', 'search')}
            placeholderTextColor={Colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
        {filtered.map((item, index) => (
          <Animated.View key={item.id} entering={FadeInDown.delay(index * 100)}>
            <View style={styles.card}>
              <View style={[styles.cardHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <View style={[styles.iconCircle, { backgroundColor: item.type === 'charity' ? '#4CAF5015' : '#2196F315' }]}>
                  <Ionicons name={item.type === 'charity' ? "heart" : "people"} size={26} color={item.type === 'charity' ? '#4CAF50' : '#2196F3'} />
                </View>
                <View style={[styles.cardInfo, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
                  <Text style={styles.cardName}>{item.name}</Text>
                  <View style={[styles.tagRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                    <View style={[styles.tag, { backgroundColor: item.type === 'charity' ? '#4CAF5020' : '#2196F320' }]}>
                      <Text style={[styles.tagText, { color: item.type === 'charity' ? '#4CAF50' : '#2196F3' }]}>
                        {item.type === 'charity' ? t('orgs', 'charity') : t('orgs', 'initiative')}
                      </Text>
                    </View>
                    <View style={styles.ratingRow}>
                      <Ionicons name="star" size={12} color={Colors.accent} />
                      <Text style={styles.ratingText}>{item.rating || "5.0"}</Text>
                    </View>
                  </View>
                </View>
              </View>
              <Text style={[styles.description, { textAlign: isRTL ? 'right' : 'left' }]}>{item.description}</Text>
              <View style={[styles.cardActions, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <TouchableOpacity style={styles.actionBtn} onPress={() => handleContact(item.contact)}>
                  <Ionicons name="call" size={18} color="#fff" />
                  <Text style={styles.actionBtnText}>{t('common', 'contact')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: Colors.accent }]} onPress={() => handleJoin(item.name)}>
                  <Ionicons name="person-add" size={18} color="#fff" />
                  <Text style={styles.actionBtnText}>{t('common', 'joinNow')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { backgroundColor: Colors.cardBg, paddingHorizontal: 16, paddingBottom: 12 },
  headerTitle: { fontFamily: "Cairo_700Bold", fontSize: 22, color: Colors.textPrimary, marginBottom: 14 },
  searchRow: { backgroundColor: Colors.bg, borderRadius: 12, paddingHorizontal: 12, alignItems: "center", gap: 8 },
  searchInput: { flex: 1, fontFamily: "Cairo_400Regular", fontSize: 15, color: Colors.textPrimary, paddingVertical: 11 },
  list: { flex: 1 },
  listContent: { padding: 16, gap: 16, paddingBottom: 100 },
  card: { backgroundColor: Colors.cardBg, borderRadius: 16, padding: 16, gap: 12 },
  cardHeader: { alignItems: "center", gap: 12 },
  iconCircle: { width: 50, height: 50, borderRadius: 25, justifyContent: "center", alignItems: "center" },
  cardInfo: { flex: 1 },
  cardName: { fontFamily: "Cairo_700Bold", fontSize: 17, color: Colors.textPrimary },
  tagRow: { alignItems: "center", gap: 8, marginTop: 4 },
  tag: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  tagText: { fontFamily: "Cairo_600SemiBold", fontSize: 11 },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  ratingText: { fontFamily: "Cairo_600SemiBold", fontSize: 12, color: Colors.textSecondary },
  description: { fontFamily: "Cairo_400Regular", fontSize: 14, color: Colors.textSecondary, lineHeight: 22 },
  cardActions: { gap: 10, marginTop: 4 },
  actionBtn: { flex: 1, height: 44, borderRadius: 10, backgroundColor: Colors.primary, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8 },
  actionBtnText: { fontFamily: "Cairo_700Bold", fontSize: 14, color: "#fff" },
});
