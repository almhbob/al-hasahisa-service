// ألوان مستوحاة من صورة مدينة الحصاحيصا (عجلة الدوار والنيل والأشجار)
const primary = "#E07830";      // برتقالي دافئ من أعمدة العجلة والأرض الرملية
const accent = "#2D8A96";       // تيل/فيروزي من كبائن عجلة الدوار
const teal = "#2D8A96";         // لون النيل والكبائن الفيروزية
const terracotta = "#C4643A";   // التراب الأحمر الحصاحيصاوي
const forest = "#3D6845";       // أخضر الأشجار الكثيفة

const bg = "#070D14";           // خلفية داكنة عميقة مستوحاة من سماء الغسق
const bgDeep = "#040810";       // أعمق خلفية للعناصر
const cardBg = "#0F1B24";       // كرت داكن مع لمسة زرقاء من النيل
const cardBgElevated = "#172533"; // كرت مرتفع

const textPrimary = "#F0E8DC";  // أبيض دافئ كلون هيكل عجلة الدوار
const textSecondary = "#8A9BA8"; // رمادي السماء الغائمة
const textMuted = "#3D5260";    // نص باهت من لون النيل العميق
const divider = "#1A2F3E";      // فاصل من درجات الليل

export default {
  primary,
  accent,
  teal,
  terracotta,
  forest,
  bg,
  bgDeep,
  cardBg,
  cardBgElevated,
  textPrimary,
  textSecondary,
  textMuted,
  divider,
  text: textPrimary,
  success: forest,
  danger: "#D94F3A",
  warning: primary,
  info: teal,
  light: {
    text: textPrimary,
    background: bg,
    tint: primary,
    tabIconDefault: textMuted,
    tabIconSelected: primary,
  },
};
