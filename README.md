ة.

### الترخيص (License):
هذا المشروع مرخص تحت رخصة [MIT License](https://opensource.org/licenses/MIT).

---

# al-hasahisa-service

## Hasahisa Community Services Platform

A comprehensive monorepo project designed to provide a community services platform for the city of Hasahisa in Sudan. The project includes a robust API server, shared libraries, and a mobile application built with Expo React Native.

### Key Features:
*   **Robust API Services:** An API server built with Express 5 and TypeScript, offering secure and efficient programmatic interfaces.
*   *   **PostgreSQ# al-hasahisa-service

## منصة حصاحيصاوي للخدمات المجتمعية (Hasahisa Community Services Platform)

مشروع متكامل (Monorepo) يهدف إلى توفير منصة خدمات مجتمعية لمدينة الحصاحيصا في السودان. يتضمن المشروع خادم API قوي، مكتبات مشتركة، وتطبيق جوال مبني باستخدام Expo React Native.

### الميزات الرئيسية:
*   **خدمات API قوية:** خادم API مبني بـ Express 5 و TypeScript، يوفر واجهات برمجية آمنة وفعالة.
*   **قاعدة بيانات PostgreSQL:** استخدام Drizzle ORM لإدارة البيانات بفعالية وأمان.
*   **تطبيق جوال متكامل:** تطبيق "حصاحيصاوي" للهواتف الذكية (iOS/Android) يوفر واجهة سهلة الاستخدام للوصول إلى الخدمات المجتمعية.
*   **هيكلية Monorepo:** تنظيم المشروع باستخدام `pnpm workspaces` لسهولة التطوير، مشاركة الكود، وإدارة التبعيات.
*   **تكامل TypeScript الشامل:** استخدام TypeScript في جميع أجزاء المشروع لضمان جودة الكود وتقليل الأخطاء.
*   **واجهة برمجة تطبيقات آمنة (Type-Safe API):** توليد أنواع البيانات (Type-Safe API) تلقائياً باستخدام OpenAPI، Orval، و Zod لضمان التوافق بين الخادم والعميل.
*   **أتمتة النشر (CI/CD):** استخدام GitHub Actions لأتمتة عمليات البناء والنشر لتطبيق الأندرويد.

### التقنيات المستخدمة (Stack):
*   **Monorepo Tool:** `pnpm workspaces`
*   **اللغة:** TypeScript (v5.9)
*   **بيئة التشغيل:** Node.js (v24)
*   **مدير الحزم:** pnpm
*   **إطار عمل API:** Express 5
*   **قاعدة البيانات:** PostgreSQL مع Drizzle ORM
*   **التحقق من الصحة (Validation):** Zod (v4) و `drizzle-zod`
*   **توليد كود API:** Orval (من مواصفات OpenAPI)
*   **أداة البناء (Build Tool):** esbuild
*   **تطبيق الجوال:** Expo React Native

### هيكل المشروع:
```
artifacts-monorepo/
├── artifacts/              # التطبيقات القابلة للنشر (Deployable applications)
│   ├── api-server/         # خادم API باستخدام Express
│   └── hasahisawi/         # تطبيق الجوال (Expo React Native)
├── lib/                    # المكتبات المشتركة (Shared libraries)
│   ├── api-spec/           # مواصفات OpenAPI وإعدادات Orval
│   ├── api-client-react/   # هوكس React Query المولدة تلقائياً
│   ├── api-zod/            # مخططات Zod المولدة تلقائياً
│   └── db/                 # مخطط Drizzle ORM واتصال قاعدة البيانات
├── scripts/                # سكربتات مساعدة (Utility scripts)
├── pnpm-workspace.yaml     # إعدادات pnpm workspace
├── tsconfig.base.json      # إعدادات TypeScript الأساسية المشتركة
├── tsconfig.json           # مراجع مشاريع TypeScript الجذرية
└── package.json            # ملف package.json الرئيسي مع التبعيات المشتركة
```

### البدء بالمشروع (Getting Started):
للبدء بتشغيل المشروع محلياً، اتبع الخطوات التالية:

1.  **استنساخ المستودع:**
    ```bash
    git clone https://github.com/almhbob/al-hasahisa-service.git
    cd al-hasahisa-service
    ```

2.  **تثبيت التبعيات:**
    ```bash
    pnpm install
    ```

3.  **إعداد متغيرات البيئة:**
    أنشئ ملف `.env` في جذر المشروع بناءً على `.env.example` (إذا كان متوفراً) وقم بتعبئة المتغيرات المطلوبة (مثل `DATABASE_URL`).

4.  **تشغيل الخادم (API Server):**
    ```bash
    pnpm --filter @workspace/api-server run dev
    ```

5.  **تشغيل تطبيق الجوال (Mobile App):**
    ```bash
    cd artifacts/hasahisawi
    pnpm start
    ```
    ثم اتبع التعليمات في الطرفية لفتح التطبيق على محاكي أو جهاز حقيقي.

### المساهمة (Contributing):
نرحب بالمساهمات! يرجى قراءة ملف `CONTRIBUTING.md` (إذا كان متوفراً) للحصول على إرشادات حول كيفية المساهمة.

### الترخيص (License):
هذا المشروع مرخص تحت رخصة [MIT License](https://opensource.org/licenses/MIT).

---

# al-hasahisa-service

## Hasahisa Community Services Platform

A comprehensive monorepo project designed to provide a community services platform for the city of Hasahisa in Sudan. The project includes a robust API server, shared libraries, and a mobile application built with Expo React Native.

### Key Features:
*   **Robust API Services:** An API server built with Express 5 and TypeScript, offering secure and efficient programmatic interfaces.
*   **PostgreSQL Database:** Utilizes Drizzle ORM for efficient and secure data management.
*   **Integrated Mobile Application:** The "Hasahisawi" mobile app (iOS/Android) provides a user-friendly interface to access community services.
*   **Monorepo Architecture:** Project organized using `pnpm workspaces` for ease of development, code sharing, and dependency management.
*   **Comprehensive TypeScript Integration:** TypeScript is used throughout the project to ensure code quality and reduce errors.
*   **Type-Safe API:** Automatic generation of type-safe API interfaces using OpenAPI, Orval, and Zod to ensure consistency between server and client.
*   **Automated Deployment (CI/CD):** Leverages GitHub Actions for automated build and deployment processes for the Android application.

### Technologies Used (Stack):
*   **Monorepo Tool:** `pnpm workspaces`
*   **Language:** TypeScript (v5.9)
*   **Runtime:** Node.js (v24)
*   **Package Manager:** pnpm
*   **API Framework:** Express 5
*   **Database:** PostgreSQL with Drizzle ORM
*   **Validation:** Zod (v4) & `drizzle-zod`
*   **API Codegen:** Orval (from OpenAPI spec)
*   **Build Tool:** esbuild
*   **Mobile App:** Expo React Native

### Project Structure:
```
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   ├── api-server/         # Express API server
│   └── hasahisawi/         # Mobile application (Expo React Native)
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts
├── pnpm-workspace.yaml     # pnpm workspace configuration
├── tsconfig.base.json      # Shared base TypeScript configuration
├── tsconfig.json           # Root TypeScript project references
└── package.json            # Root package.json with hoisted dependencies
```

### Getting Started:
To get the project up and running locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/almhbob/al-hasahisa-service.git
    cd al-hasahisa-service
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the project root based on `.env.example` (if available) and populate the required variables (e.g., `DATABASE_URL`).

4.  **Run the API Server:**
    ```bash
    pnpm --filter @workspace/api-server run dev
    ```

5.  **Run the Mobile App:**
    ```bash
    cd artifacts/hasahisawi
    pnpm start
    ```
    Then follow the instructions in the terminal to open the app on an emulator or physical device.

### Contributing:
Contributions are welcome! Please read the `CONTRIBUTING.md` file (if available) for guidelines on how to contribute.

### License:
This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).
