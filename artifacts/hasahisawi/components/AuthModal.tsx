import React, { useState } from "react";
import {
  View, Text, StyleSheet, Modal, TouchableOpacity, TextInput,
  Pressable, ScrollView, Platform, ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { useAuth } from "@/lib/auth-context";
import { useLang } from "@/lib/lang-context";
import Colors from "@/constants/colors";

type Mode = "login" | "register";

export default function AuthModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const insets = useSafeAreaInsets();
  const { login, register, enterAsGuest } = useAuth();
  const { t, isRTL } = useLang();

  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [useEmail, setUseEmail] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const reset = () => {
    setName(""); setNationalId(""); setIdentifier(""); setPassword(""); setConfirmPassword("");
    setError(""); setLoading(false); setShowPassword(false); setUseEmail(false);
  };

  const handleClose = () => { reset(); onClose(); };

  const handleGuest = () => {
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    enterAsGuest();
    handleClose();
  };

  const validate = (): string | null => {
    if (mode === "register") {
      if (!name.trim()) return "يرجى إدخال الاسم الكامل";
      const cleanNid = nationalId.trim().replace(/\s+/g, "");
      if (cleanNid && !/^\d{8,20}$/.test(cleanNid)) return t('auth', 'nationalIdLength');
    }
    if (!identifier.trim()) {
      return mode === "login"
        ? "يرجى إدخال البريد الإلكتروني أو رقم الهاتف"
        : useEmail ? "يرجى إدخال البريد الإلكتروني" : "يرجى إدخال رقم الهاتف";
    }
    if (!password) return "يرجى إدخال كلمة المرور";
    if (password.length < 6) return "كلمة المرور يجب أن تكون 6 أحرف على الأقل";
    if (mode === "register" && password !== confirmPassword) return t('auth', 'passwordMatch');
    return null;
  };

  const handleSubmit = async () => {
    setError("");
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setLoading(true);
    try {
      if (mode === "login") {
        await login(identifier.trim(), password);
      } else {
        const isEmail = useEmail || identifier.includes("@");
        const cleanNid = nationalId.trim().replace(/\s+/g, "");
        await register(name.trim(), cleanNid, identifier.trim(), isEmail, password);
      }
      if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      reset();
      onClose();
    } catch (e: any) {
      setError(e.message || t('common', 'error'));
      if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setLoading(false);
    }
  };

  const dir = { textAlign: isRTL ? "right" : "left" } as const;

  return (
    <Modal visible={visible} animationType="slide" transparent statusBarTranslucent>
      <Pressable style={s.overlay} onPress={handleClose}>
        <Pressable style={[s.sheet, { paddingBottom: insets.bottom + 16 }]}>

          {/* Handle */}
          <View style={s.handle} />

          {/* Header */}
          <View style={[s.header, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
            <TouchableOpacity onPress={handleClose} hitSlop={14}>
              <Ionicons name="close" size={22} color={Colors.textSecondary} />
            </TouchableOpacity>
            <Text style={s.headerTitle}>
              {mode === "login" ? "تسجيل الدخول" : "إنشاء حساب جديد"}
            </Text>
            <View style={{ width: 22 }} />
          </View>

          {/* Mode toggle */}
          <View style={[s.toggleRow, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
            <TouchableOpacity
              style={[s.toggleBtn, mode === "register" && s.toggleBtnActive]}
              onPress={() => { setMode("register"); setError(""); }}
              activeOpacity={0.8}
            >
              <Text style={[s.toggleText, mode === "register" && s.toggleTextActive]}>إنشاء حساب</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.toggleBtn, mode === "login" && s.toggleBtnActive]}
              onPress={() => { setMode("login"); setError(""); }}
              activeOpacity={0.8}
            >
              <Text style={[s.toggleText, mode === "login" && s.toggleTextActive]}>تسجيل الدخول</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <View style={s.form}>

              {/* الاسم الكامل */}
              {mode === "register" && (
                <View style={s.fieldBlock}>
                  <Text style={[s.fieldLabel, dir]}>الاسم الكامل <Text style={s.req}>*</Text></Text>
                  <View style={[s.fieldWrap, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
                    <Ionicons name="person-outline" size={18} color={Colors.textMuted} style={s.fieldIcon} />
                    <TextInput
                      style={[s.field, dir]}
                      placeholder="أدخل اسمك الكامل"
                      placeholderTextColor={Colors.textMuted}
                      value={name}
                      onChangeText={setName}
                      autoCapitalize="words"
                    />
                  </View>
                </View>
              )}

              {/* رقم الهوية — اختياري */}
              {mode === "register" && (
                <View style={s.fieldBlock}>
                  <View style={[s.labelRow, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
                    <Text style={s.fieldLabel}>رقم الهوية الوطنية</Text>
                    <View style={s.optionalBadge}><Text style={s.optionalText}>اختياري</Text></View>
                  </View>
                  <View style={[s.fieldWrap, nationalId.length >= 8 && { borderColor: Colors.primary + "80" }, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
                    <Ionicons name="id-card-outline" size={18} color={nationalId.length >= 8 ? Colors.primary : Colors.textMuted} style={s.fieldIcon} />
                    <TextInput
                      style={[s.field, dir]}
                      placeholder="أدخل رقم هويتك (للتوثيق)"
                      placeholderTextColor={Colors.textMuted}
                      value={nationalId}
                      onChangeText={v => setNationalId(v.replace(/[^\d]/g, ""))}
                      keyboardType="numeric"
                      maxLength={20}
                    />
                    {nationalId.length >= 8 && (
                      <Ionicons name="checkmark-circle" size={18} color={Colors.primary} style={{ marginRight: 12 }} />
                    )}
                  </View>
                  {nationalId.length >= 8 && (
                    <Text style={[s.verifyHint, dir]}>سيتم توثيق حسابك تلقائياً</Text>
                  )}
                </View>
              )}

              {/* نوع التسجيل (بريد / هاتف) */}
              {mode === "register" && (
                <View style={[s.typeRow, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
                  <TouchableOpacity
                    style={[s.typeBtn, useEmail && s.typeBtnActive, { flexDirection: isRTL ? "row-reverse" : "row" }]}
                    onPress={() => { setUseEmail(true); setIdentifier(""); }}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="mail-outline" size={15} color={useEmail ? Colors.primary : Colors.textMuted} />
                    <Text style={[s.typeText, useEmail && s.typeTextActive]}>بريد إلكتروني</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[s.typeBtn, !useEmail && s.typeBtnActive, { flexDirection: isRTL ? "row-reverse" : "row" }]}
                    onPress={() => { setUseEmail(false); setIdentifier(""); }}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="call-outline" size={15} color={!useEmail ? Colors.primary : Colors.textMuted} />
                    <Text style={[s.typeText, !useEmail && s.typeTextActive]}>رقم الهاتف</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* البريد الإلكتروني / الهاتف */}
              <View style={s.fieldBlock}>
                <Text style={[s.fieldLabel, dir]}>
                  {mode === "login" ? "البريد الإلكتروني أو رقم الهاتف" : useEmail ? "البريد الإلكتروني" : "رقم الهاتف"}
                  {" "}<Text style={s.req}>*</Text>
                </Text>
                <View style={[s.fieldWrap, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
                  <Ionicons
                    name={useEmail || mode === "login" ? "mail-outline" : "call-outline"}
                    size={18} color={Colors.textMuted} style={s.fieldIcon}
                  />
                  <TextInput
                    style={[s.field, dir]}
                    placeholder={mode === "login" ? "أدخل البريد أو رقم الهاتف" : useEmail ? "example@email.com" : "09xxxxxxxx"}
                    placeholderTextColor={Colors.textMuted}
                    value={identifier}
                    onChangeText={setIdentifier}
                    keyboardType={useEmail || mode === "login" ? "email-address" : "phone-pad"}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>

              {/* كلمة المرور */}
              <View style={s.fieldBlock}>
                <Text style={[s.fieldLabel, dir]}>كلمة المرور <Text style={s.req}>*</Text></Text>
                <View style={[s.fieldWrap, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
                  <Ionicons name="lock-closed-outline" size={18} color={Colors.textMuted} style={s.fieldIcon} />
                  <TextInput
                    style={[s.field, { flex: 1 }, dir]}
                    placeholder="أدخل كلمة المرور"
                    placeholderTextColor={Colors.textMuted}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(p => !p)} hitSlop={10} style={{ paddingHorizontal: 12 }}>
                    <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color={Colors.textMuted} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* تأكيد كلمة المرور */}
              {mode === "register" && (
                <View style={s.fieldBlock}>
                  <Text style={[s.fieldLabel, dir]}>تأكيد كلمة المرور <Text style={s.req}>*</Text></Text>
                  <View style={[s.fieldWrap, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
                    <Ionicons name="lock-closed-outline" size={18} color={Colors.textMuted} style={s.fieldIcon} />
                    <TextInput
                      style={[s.field, dir]}
                      placeholder="أعد إدخال كلمة المرور"
                      placeholderTextColor={Colors.textMuted}
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      secureTextEntry={!showPassword}
                    />
                  </View>
                </View>
              )}

              {/* رسالة الخطأ */}
              {error ? (
                <View style={s.errorBox}>
                  <Ionicons name="alert-circle-outline" size={16} color={Colors.danger} />
                  <Text style={s.errorText}>{error}</Text>
                </View>
              ) : null}

              {/* زر الإرسال */}
              <TouchableOpacity
                style={[s.submitBtn, loading && { opacity: 0.7 }]}
                onPress={handleSubmit}
                disabled={loading}
                activeOpacity={0.85}
              >
                {loading
                  ? <ActivityIndicator color="#fff" size="small" />
                  : <Text style={s.submitBtnText}>
                    {mode === "login" ? "تسجيل الدخول" : "إنشاء الحساب"}
                  </Text>
                }
              </TouchableOpacity>

              {/* فاصل */}
              <View style={s.dividerRow}>
                <View style={s.dividerLine} />
                <Text style={s.dividerText}>أو</Text>
                <View style={s.dividerLine} />
              </View>

              {/* زر الزائر */}
              <TouchableOpacity style={s.guestBtn} onPress={handleGuest} activeOpacity={0.8}>
                <Ionicons name="eye-outline" size={18} color={Colors.textSecondary} />
                <View style={{ flex: 1 }}>
                  <Text style={s.guestBtnTitle}>دخول كزائر</Text>
                  <Text style={s.guestBtnSub}>مشاهدة فقط — بدون نشر أو تعليق</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
              </TouchableOpacity>

            </View>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: "rgba(0,0,0,0.55)", justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: Colors.cardBg,
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    maxHeight: "92%",
  },
  handle: {
    width: 40, height: 4, borderRadius: 2, backgroundColor: Colors.divider,
    alignSelf: "center", marginTop: 12, marginBottom: 4,
  },
  header: {
    alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 20, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: Colors.divider,
  },
  headerTitle: {
    fontFamily: "Cairo_700Bold", fontSize: 18, color: Colors.textPrimary,
  },

  /* Toggle */
  toggleRow: {
    margin: 16, backgroundColor: Colors.bg,
    borderRadius: 14, padding: 3, gap: 3,
  },
  toggleBtn: { flex: 1, paddingVertical: 10, borderRadius: 11, alignItems: "center" },
  toggleBtnActive: {
    backgroundColor: Colors.cardBgElevated,
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.12, shadowRadius: 3, elevation: 3,
  },
  toggleText: { fontFamily: "Cairo_500Medium", fontSize: 14, color: Colors.textMuted },
  toggleTextActive: { color: Colors.primary, fontFamily: "Cairo_700Bold" },

  /* Form */
  form: { paddingHorizontal: 20, gap: 14, paddingBottom: 8 },
  fieldBlock: { gap: 6 },
  labelRow: { alignItems: "center", gap: 8 },
  fieldLabel: {
    fontFamily: "Cairo_600SemiBold", fontSize: 13, color: Colors.textSecondary,
  },
  req: { color: Colors.danger },
  optionalBadge: {
    backgroundColor: Colors.divider, borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2,
  },
  optionalText: {
    fontFamily: "Cairo_400Regular", fontSize: 10, color: Colors.textMuted,
  },
  fieldWrap: {
    borderWidth: 1.5, borderColor: Colors.divider, borderRadius: 14,
    backgroundColor: Colors.bg, alignItems: "center", overflow: "hidden",
  },
  fieldIcon: { paddingHorizontal: 12 },
  field: {
    fontFamily: "Cairo_400Regular", fontSize: 15, color: Colors.textPrimary,
    paddingVertical: 13, flex: 1,
  },
  verifyHint: {
    fontFamily: "Cairo_400Regular", fontSize: 12, color: Colors.primary, paddingHorizontal: 4,
  },

  /* Type toggle */
  typeRow: {
    backgroundColor: Colors.bg, borderRadius: 12, padding: 3, gap: 3,
  },
  typeBtn: {
    flex: 1, alignItems: "center", justifyContent: "center",
    gap: 6, paddingVertical: 9, borderRadius: 10,
  },
  typeBtnActive: {
    backgroundColor: Colors.cardBgElevated,
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 2, elevation: 2,
  },
  typeText: { fontFamily: "Cairo_500Medium", fontSize: 13, color: Colors.textMuted },
  typeTextActive: { color: Colors.primary, fontFamily: "Cairo_600SemiBold" },

  /* Error */
  errorBox: {
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: Colors.danger + "15", borderRadius: 12, padding: 12,
    borderWidth: 1, borderColor: Colors.danger + "30",
  },
  errorText: {
    fontFamily: "Cairo_500Medium", fontSize: 13, color: Colors.danger, flex: 1, textAlign: "right",
  },

  /* Submit */
  submitBtn: {
    backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 15,
    alignItems: "center", marginTop: 4,
  },
  submitBtnText: { fontFamily: "Cairo_700Bold", fontSize: 16, color: "#fff" },

  /* Divider */
  dividerRow: {
    flexDirection: "row", alignItems: "center", gap: 12, marginVertical: 4,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.divider },
  dividerText: {
    fontFamily: "Cairo_400Regular", fontSize: 13, color: Colors.textMuted,
  },

  /* Guest */
  guestBtn: {
    flexDirection: "row", alignItems: "center", gap: 12,
    backgroundColor: Colors.bg, borderRadius: 14, padding: 14,
    borderWidth: 1.5, borderColor: Colors.divider, borderStyle: "dashed",
    marginBottom: 8,
  },
  guestBtnTitle: {
    fontFamily: "Cairo_600SemiBold", fontSize: 14, color: Colors.textSecondary, textAlign: "right",
  },
  guestBtnSub: {
    fontFamily: "Cairo_400Regular", fontSize: 11, color: Colors.textMuted, marginTop: 1, textAlign: "right",
  },
});
