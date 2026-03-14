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

export type WomenService = {
  id: string;
  name: string;
  type: "salon" | "service";
  address: string;
  phone: string;
  hours: string;
  description?: string;
  rating?: number;
};

const WOMEN_KEY = "women_services_v1";
const WOMEN_INIT_KEY = "women_services_initialized";

const SEED_SERVICES: WomenService[] = [
  { id: "w1", name: "صالون لمسة جمال", type: "salon", address: "حي الموظفين، حصاحيصا", phone: "+249912345601", hours: "9ص - 9م", rating: 4.8 },
  { id: "w2", name: "مركز حواء للتجميل", type: "salon", address: "شارع السوق، حصاحيصا", phone: "+249912345602", hours: "10ص - 10م", rating: 4.5 },
  { id: "w3", name: "خدمة نقش حناء منزلية", type: "service", address: "متنقلة - حصاحيصا", phone: "+249912345603", hours: "حسب الطلب", rating: 4.9 },
];

export default function WomenScreen() {
  const { t, isRTL, lang } = useLang();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [services, setServices] = useState<WomenService[]>([]);

  const load = async () => {
    const init = await AsyncStorage.getItem(WOMEN_INIT_KEY);
    if (!init) {
      await AsyncStorage.setItem(WOMEN_KEY, JSON.stringify(SEED_SERVICES));
      await AsyncStorage.setItem(WOMEN_INIT_KEY, "1");
      setServices(SEED_SERVICES);
    } else {
      const raw = await AsyncStorage.getItem(WOMEN_KEY);
      setServices(raw ? JSON.parse(raw) : []);
    }
  };

  useEffect(() => { load(); }, []);
  useFocusEffect(useCallback(() => { load(); }, []));

  const filtered = services.filter((s) => {
    const matchesSearch = search === "" || s.name.includes(search) || s.address.includes(search);
    const matchesFilter = filter === "all" || s.type === filter;
    return matchesSearch && matchesFilter;
  });

  const handleCall = (phone: string) => {
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL(`tel:${phone}`);
  };

  const handleBook = (name: string) => {
    Alert.alert(t('common', 'bookNow'), `${t('women', 'bookService')}: ${name}`);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: topPad + 16 }]}>
        <Text style={[styles.headerTitle, { textAlign: isRTL ? 'right' : 'left' }]}>{t('women', 'title')}</Text>
        <View style={[styles.searchRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <Ionicons name="search" size={18} color={Colors.textMuted} />
          <TextInput
            style={[styles.searchInput, { textAlign: isRTL ? 'right' : 'left' }]}
            placeholder={t('women', 'search')}
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
                <View style={styles.iconCircle}>
                  <MaterialCommunityIcons name={item.type === 'salon' ? "face-woman" : "flower"} size={26} color={Colors.primary} />
                </View>
                <View style={[styles.cardInfo, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
                  <Text style={styles.cardName}>{item.name}</Text>
                  <View style={[styles.ratingRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                    <Ionicons name="star" size={14} color={Colors.accent} />
                    <Text style={styles.ratingText}>{item.rating || "5.0"}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.cardDetails}>
                <Text style={[styles.detailText, { textAlign: isRTL ? 'right' : 'left' }]}>{item.address}</Text>
                <Text style={[styles.detailText, { textAlign: isRTL ? 'right' : 'left' }]}>{item.hours}</Text>
              </View>
              <View style={[styles.cardActions, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <TouchableOpacity style={styles.actionBtn} onPress={() => handleCall(item.phone)}>
                  <Ionicons name="call" size={18} color="#fff" />
                  <Text style={styles.actionBtnText}>{t('medical', 'callPhone')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: Colors.accent }]} onPress={() => handleBook(item.name)}>
                  <Ionicons name="calendar" size={18} color="#fff" />
                  <Text style={styles.actionBtnText}>{t('common', 'bookNow')}</Text>
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
  iconCircle: { width: 50, height: 50, borderRadius: 25, backgroundColor: Colors.primary + "15", justifyContent: "center", alignItems: "center" },
  cardInfo: { flex: 1 },
  cardName: { fontFamily: "Cairo_700Bold", fontSize: 17, color: Colors.textPrimary },
  ratingRow: { alignItems: "center", gap: 4 },
  ratingText: { fontFamily: "Cairo_600SemiBold", fontSize: 13, color: Colors.textSecondary },
  cardDetails: { gap: 4 },
  detailText: { fontFamily: "Cairo_400Regular", fontSize: 14, color: Colors.textSecondary },
  cardActions: { gap: 10, marginTop: 4 },
  actionBtn: { flex: 1, height: 44, borderRadius: 10, backgroundColor: Colors.primary, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8 },
  actionBtnText: { fontFamily: "Cairo_700Bold", fontSize: 14, color: "#fff" },
});
