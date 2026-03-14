import React, { useState } from "react";
import {
  View, Text, StyleSheet, Modal, TouchableOpacity, TextInput,
  Pressable, ScrollView, Platform, ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useAuth } from "@/lib/auth-context";
import { useLang } from "@/lib/lang-context";
import Colors from "@/constants/colors";

type Mode = "login" | "register";

export default function AuthModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const insets = useSafeAreaInsets();
  const { login, register } = useAuth();
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
    setError(""); setLoading(false); setShowPassword(false);
  };

  const handleClose = () => { reset(); onClose(); };

  const handleSubmit = async () => {
    setError("");
    if (!identifier.trim()) {
      setError(t('auth', useEmail ? 'emailPlaceholder' : 'emailOrPhonePlaceholder'));
      return;
    }
    if (!password) { setError(t('auth', 'passwordPlaceholder')); return; }
    if (mode === "register") {
      if (!name.trim()) { setError(t('auth', 'namePlaceholder')); return; }
      const cleanNid = nationalId.trim().replace(/\s+/g, "");
      if (cleanNid && !/^\d{8,20}$/.test(cleanNid)) { setError(t('auth', 'nationalIdLength')); return; }
      if (password !== confirmPassword) { setError(t('auth', 'passwordMatch')); return; }
      if (password.length < 6) { setError(t('auth', 'passwordPlaceholder')); return; }
    }
    setLoading(true);
    try {
      if (mode === "login") {
        await login(identifier.trim(), password);
      } else {
        const isEmail = identifier.includes("@");
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

  const textStyle = { textAlign: isRTL ? "right" : "left" } as const;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <Pressable style={s.overlay} onPress={handleClose}>
        <Pressable style={[s.sheet, { paddingBottom: insets.bottom + 24 }]}>
          <View style={s.handle} />
          <View style={[s.header, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
            <TouchableOpacity onPress={handleClose} hitSlop={12}>
              <Ionicons name="close" size={22} color={Colors.textSecondary} />
            </TouchableOpacity>
            <Text style={s.headerTitle}>
              {mode === "login" ? t('auth', 'loginTitle') : t('auth', 'registerTitle')}
            </Text>
            <View style={{ width: 22 }} />
          </View>

          {/* Mode toggle */}
          <View style={[s.toggleRow, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
            <TouchableOpacity
              style={[s.toggleBtn, mode === "register" && s.toggleBtnActive]}
              onPress={() => { setMode("register"); setError(""); }}
            >
              <Text style={[s.toggleText, mode === "register" && s.toggleTextActive]}>{t('auth', 'registerTitle')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.toggleBtn, mode === "login" && s.toggleBtnActive]}
              onPress={() => { setMode("login"); setError(""); }}
            >
              <Text style={[s.toggleText, mode === "login" && s.toggleTextActive]}>{t('auth', 'login')}</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <View style={s.form}>
              {mode === "register" && (
                <View style={s.fieldWrap}>
                  <TextInput
                    style={[s.field, textStyle]}
                    placeholder={t('auth', 'name')}
                    placeholderTextColor={Colors.textMuted}
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                  />
                </View>
              )}

              {mode === "register" && (
                <View>
                  <View style={[s.fieldWrap, nationalId.length >= 8 && { borderColor: Colors.primary + "80" }]}>
                    <View style={[s.fieldLabelRow, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
                      <Text style={s.fieldLabel}>{t('auth', 'nationalId')}</Text>
                      <Text style={s.fieldOptional}>({t('common', 'optional')})</Text>
                    </View>
                    <TextInput
                      style={[s.field, { paddingTop: 4 }, textStyle]}
                      placeholder={t('auth', 'nationalIdPlaceholder')}
                      placeholderTextColor={Colors.textMuted}
                      value={nationalId}
                      onChangeText={t => setNationalId(t.replace(/[^\d]/g, ""))}
                      keyboardType="numeric"
                      maxLength={20}
                    />
                  </View>
                  {nationalId.length >= 8 && (
                    <View style={[s.verifyBadge, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
                      <Ionicons name="checkmark-circle" size={14} color={Colors.primary} />
                      <Text style={s.verifyText}>{isRTL ? "سيتم توثيق حسابك" : "Your account will be verified"}</Text>
                    </View>
                  )}
                </View>
              )}

              {/* Identifier type toggle (for register) */}
              {mode === "register" && (
                <View style={[s.typeRow, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
                  <TouchableOpacity
                    style={[s.typeBtn, useEmail && s.typeBtnActive, { flexDirection: isRTL ? "row-reverse" : "row" }]}
                    onPress={() => { setUseEmail(true); setIdentifier(""); }}
                  >
                    <Ionicons name="mail-outline" size={15} color={useEmail ? Colors.primary : Colors.textMuted} />
                    <Text style={[s.typeText, useEmail && s.typeTextActive]}>{t('auth', 'email')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[s.typeBtn, !useEmail && s.typeBtnActive, { flexDirection: isRTL ? "row-reverse" : "row" }]}
                    onPress={() => { setUseEmail(false); setIdentifier(""); }}
                  >
                    <Ionicons name="call-outline" size={15} color={!useEmail ? Colors.primary : Colors.textMuted} />
                    <Text style={[s.typeText, !useEmail && s.typeTextActive]}>{t('common', 'phone')}</Text>
                  </TouchableOpacity>
                </View>
              )}

              <View style={s.fieldWrap}>
                <TextInput
                  style={[s.field, textStyle]}
                  placeholder={
                    mode === "login"
                      ? t('auth', 'emailOrPhone')
                      : useEmail ? t('auth', 'email') : t('common', 'phone')
                  }
                  placeholderTextColor={Colors.textMuted}
                  value={identifier}
                  onChangeText={setIdentifier}
                  keyboardType={useEmail || mode === "login" ? "email-address" : "phone-pad"}
                  autoCapitalize="none"
                />
              </View>

              <View style={[s.fieldWrap, s.fieldWrapRow, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
                <TouchableOpacity onPress={() => setShowPassword(p => !p)} hitSlop={8}>
                  <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color={Colors.textMuted} />
                </TouchableOpacity>
                <TextInput
                  style={[s.field, { flex: 1 }, textStyle]}
                  placeholder={t('auth', 'password')}
                  placeholderTextColor={Colors.textMuted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
              </View>

              {mode === "register" && (
                <View style={s.fieldWrap}>
                  <TextInput
                    style={[s.field, textStyle]}
                    placeholder={t('auth', 'confirmPassword')}
                    placeholderTextColor={Colors.textMuted}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showPassword}
                  />
                </View>
              )}

              {error ? <Text style={s.errorText}>{error}</Text> : null}

              <TouchableOpacity
                style={[s.submitBtn, loading && { opacity: 0.7 }]}
                onPress={handleSubmit}
                disabled={loading}
                activeOpacity={0.85}
              >
                {loading
                  ? <ActivityIndicator color="#fff" size="small" />
                  : <Text style={s.submitBtnText}>
                    {mode === "login" ? t('auth', 'login') : t('auth', 'register')}
                  </Text>
                }
              </TouchableOpacity>

              {mode === "register" && (
                <Text style={s.hint}>{t('auth', 'nationalIdPlaceholder')}</Text>
              )}
            </View>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: Colors.cardBg, borderTopLeftRadius: 28, borderTopRightRadius: 28,
    maxHeight: "90%",
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
  headerTitle: { fontFamily: "Cairo_700Bold", fontSize: 18, color: Colors.textPrimary },
  toggleRow: {
    margin: 16, backgroundColor: Colors.bg,
    borderRadius: 14, padding: 3, gap: 3,
  },
  toggleBtn: { flex: 1, paddingVertical: 10, borderRadius: 11, alignItems: "center" },
  toggleBtnActive: {
    backgroundColor: Colors.cardBg,
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2,
  },
  toggleText: { fontFamily: "Cairo_500Medium", fontSize: 14, color: Colors.textMuted },
  toggleTextActive: { color: Colors.primary, fontFamily: "Cairo_700Bold" },
  form: { paddingHorizontal: 20, gap: 12, paddingBottom: 8 },
  typeRow: {
    backgroundColor: Colors.bg, borderRadius: 12, padding: 3, gap: 3,
  },
  typeBtn: { flex: 1, alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 9, borderRadius: 10 },
  typeBtnActive: { backgroundColor: Colors.cardBg, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 2, elevation: 2 },
  typeText: { fontFamily: "Cairo_500Medium", fontSize: 13, color: Colors.textMuted },
  typeTextActive: { color: Colors.primary, fontFamily: "Cairo_600SemiBold" },
  fieldWrap: {
    borderWidth: 1.5, borderColor: Colors.divider, borderRadius: 14, backgroundColor: Colors.bg, overflow: "hidden",
  },
  fieldWrapRow: { alignItems: "center", paddingHorizontal: 14 },
  field: {
    fontFamily: "Cairo_400Regular", fontSize: 15, color: Colors.textPrimary,
    paddingHorizontal: 16, paddingVertical: 14,
  },
  fieldLabelRow: {
    paddingHorizontal: 16, paddingTop: 10, gap: 4, alignItems: "center",
  },
  fieldLabel: {
    fontFamily: "Cairo_700Bold", fontSize: 12, color: Colors.textSecondary,
  },
  fieldOptional: {
    fontFamily: "Cairo_400Regular", fontSize: 11, color: Colors.textMuted,
  },
  verifyBadge: {
    marginTop: 6, marginHorizontal: 4, gap: 6, alignItems: "center",
  },
  verifyText: {
    fontFamily: "Cairo_600SemiBold", fontSize: 12, color: Colors.primary,
  },
  errorText: {
    fontFamily: "Cairo_500Medium", fontSize: 13, color: Colors.danger, textAlign: "center",
  },
  submitBtn: {
    backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 15, alignItems: "center",
    marginTop: 4,
  },
  submitBtnText: { fontFamily: "Cairo_700Bold", fontSize: 16, color: "#fff" },
  hint: {
    fontFamily: "Cairo_400Regular", fontSize: 12, color: Colors.textMuted,
    textAlign: "center", marginTop: -4,
  },
});
