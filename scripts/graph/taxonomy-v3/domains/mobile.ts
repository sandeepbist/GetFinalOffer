import { s, type SkillDef } from "../types";

export const MOBILE: SkillDef[] = [
  // ── iOS Native Ecosystem ──
  s("ios-development", "iOS App Development", "mobile-platform", ["ios dev", "ios programming", "apple ios development", "iphone app development", "ipad app development"], ["high-demand", "core"]),
  s("swiftui", "SwiftUI", "mobile-ui-framework", ["swift ui", "swiftui declarative ui", "swiftui navigation", "swiftui state", "swiftui 5", "swiftui 6"], ["high-demand", "core"]),
  s("uikit", "UIKit", "mobile-ui-framework", ["ui kit", "uikit ios", "storyboards", "xib", "autolayout", "view controllers", "uikit lifecycle"]),
  s("xcode", "Xcode IDE", "mobile-tooling", ["xcode", "apple xcode", "xcode instruments", "xcode simulator", "xcode cloud", "xcode build"]),
  s("combine-framework", "Combine Framework (iOS)", "mobile-reactive", ["combine reactive swift", "publishers subscribers combine", "reactive swift"]),
  s("swiftdata", "SwiftData", "mobile-storage", ["swift data", "apple swiftdata persistence"]),
  s("core-data", "Core Data", "mobile-storage", ["coredata", "core data ios", "nsmanagedobject", "sqlite core data"]),
  s("swift-concurrency", "Swift Concurrency (async/await & Actors)", "mobile-concurrency", ["swift async await", "actors swift", "structured concurrency swift", "tasks swift"]),
  s("cocoapods", "CocoaPods", "mobile-dependency-manager", ["cocoa pods", "podfile", "ios dependency management"]),
  s("swift-package-manager", "Swift Package Manager (SPM)", "mobile-dependency-manager", ["spm", "swift pm", "package.swift"]),
  s("carthage-ios", "Carthage", "mobile-dependency-manager", ["carthage ios package manager"]),
  s("visionos", "visionOS Development (Apple Vision Pro)", "mobile-spatial", ["vision os", "apple vision pro", "spatial computing", "realitykit visionos"], ["trending"]),
  s("watchos", "watchOS Development", "mobile-wearable", ["watch os", "apple watch app development"]),

  // ── Android Native Ecosystem ──
  s("android-development", "Android App Development", "mobile-platform", ["android dev", "android programming", "google android development", "android platform"], ["high-demand", "core"]),
  s("jetpack-compose", "Jetpack Compose", "mobile-ui-framework", ["compose android", "jetpack compose android", "declarative ui android", "compose multiplatform", "material 3 compose"], ["high-demand", "core"]),
  s("android-sdk", "Android SDK & Jetpack Libraries", "mobile-platform", ["android sdk", "android framework", "android architecture components", "viewmodel android", "livedata", "navigation component android"]),
  s("android-studio", "Android Studio IDE", "mobile-tooling", ["android studio", "android emulator", "android layout inspector", "android profiler"]),
  s("kotlin-coroutines", "Kotlin Coroutines & Flow", "mobile-concurrency", ["coroutines kotlin", "kotlin flow", "stateflow sharedflow", "structured concurrency kotlin"], ["high-demand", "core"]),
  s("room-database", "Room Database (Android)", "mobile-storage", ["room db", "room persistence library", "sqlite room android"]),
  s("dagger-hilt", "Dagger Hilt (Android DI)", "mobile-di", ["dagger 2", "hilt android", "dependency injection android"]),
  s("koin-di", "Koin (Kotlin DI)", "mobile-di", ["koin dependency injection", "koin android"]),
  s("gradle-android", "Gradle for Android", "mobile-build", ["gradle build android", "build.gradle.kts", "gradle plugins android"]),
  s("wear-os", "Wear OS Development", "mobile-wearable", ["wear os", "android smartwatch development"]),
  s("android-ndk", "Android NDK (Native C/C++)", "mobile-native", ["ndk", "android native development kit", "jni android"]),

  // ── Cross-Platform Mobile Frameworks ──
  s("react-native", "React Native", "cross-platform-mobile", ["rn", "react native development", "react native mobile", "react native cli", "hermes engine", "new architecture react native", "fabric turbomodules"], ["high-demand", "core"]),
  s("expo-framework", "Expo Platform & SDK", "cross-platform-mobile", ["expo", "expo go", "expo router", "eas build", "expo application services", "managed workflow expo"], ["trending", "high-demand"]),
  s("flutter", "Flutter Framework", "cross-platform-mobile", ["flutter", "flutter mobile", "google flutter", "flutter widgets", "flutter state management", "flutter web", "flutter desktop"], ["high-demand", "core"]),
  s("flutter-bloc", "BLoC Pattern (Flutter)", "mobile-state", ["bloc flutter", "flutter_bloc", "cubit flutter"]),
  s("riverpod", "Riverpod (Flutter)", "mobile-state", ["riverpod state management", "flutter riverpod"]),
  s("provider-flutter", "Provider (Flutter)", "mobile-state", ["provider flutter state"]),
  s("kotlin-multiplatform", "Kotlin Multiplatform (KMP / KMM)", "cross-platform-mobile", ["kmp", "kmm", "kotlin multiplatform mobile", "compose multiplatform", "shared kotlin logic"], ["trending", "high-demand"]),
  s("ionic-framework", "Ionic Framework", "cross-platform-mobile", ["ionic", "ionic react", "ionic angular", "ionic vue", "hybrid mobile apps"]),
  s("capacitor-mobile", "Capacitor", "cross-platform-mobile", ["capacitor js", "capacitor plugins", "ionic capacitor"]),
  s("cordova-phonegap", "Apache Cordova / PhoneGap", "cross-platform-mobile", ["cordova", "phonegap", "hybrid webview apps"]),
  s("dotnet-maui", ".NET MAUI", "cross-platform-mobile", ["dotnet maui", "maui cross platform", "xamarin evolution"]),
  s("xamarin-forms", "Xamarin.Forms", "cross-platform-mobile", ["xamarin", "xamarin forms", "xamarin c#"]),

  // ── Mobile Backend & Real-Time Services ──
  s("firebase-mobile", "Firebase for Mobile (iOS & Android)", "mobile-backend", ["firebase auth mobile", "cloud firestore mobile", "firebase cloud messaging fcm", "firebase crashlytics", "remote config firebase", "firebase dynamic links"], ["high-demand", "core"]),
  s("push-notifications", "Push Notification Architecture (APNs / FCM)", "mobile-services", ["apns", "apple push notification service", "fcm", "firebase cloud messaging", "push notifications delivery", "onesignal"]),
  s("in-app-purchases", "In-App Purchases & Subscriptions (StoreKit / Google Play Billing)", "mobile-monetization", ["storekit 2", "google play billing client", "revenuecat", "in app subscriptions"]),
  s("mobile-deep-linking", "Deep Linking & Universal Links", "mobile-architecture", ["universal links ios", "app links android", "custom url schemes", "deferred deep linking", "branch.io"]),
  s("offline-first-sync", "Offline-First Mobile Architecture & Sync", "mobile-architecture", ["offline first", "local caching mobile", "optimistic updates", "conflict resolution mobile", "watermelondb"]),

  // ── Mobile Testing, Automation & CI/CD ──
  s("appium", "Appium (Cross-Platform Mobile Testing)", "mobile-testing", ["appium automation", "appium webdriver", "mobile automated testing"]),
  s("detox-testing", "Detox (React Native E2E Testing)", "mobile-testing", ["detox e2e", "wix detox", "gray box mobile testing"]),
  s("maestro-mobile", "Maestro Mobile UI Testing", "mobile-testing", ["maestro test", "mobile maestro automation", "mobile ui testing"]),
  s("espresso-android", "Espresso (Android UI Testing)", "mobile-testing", ["espresso test", "android espresso framework"]),
  s("xctest-ios", "XCTest / XCUITest (iOS Testing)", "mobile-testing", ["xctest", "xcuitest", "ios unit testing", "ios ui automation"]),
  s("fastlane", "Fastlane (Mobile Automation)", "mobile-cicd", ["fastlane match", "fastlane gym", "fastlane deliver", "app store deployment automation", "testflight automation"], ["high-demand"]),
  s("testflight", "Apple TestFlight & App Store Connect", "mobile-deployment", ["testflight beta testing", "app store review", "app store connect"]),
  s("google-play-console", "Google Play Console & Track Releases", "mobile-deployment", ["google play console", "play store internal testing", "staged rollouts android", "android app bundles aab"]),

  // ── Mobile AR, Vision & Hardware ──
  s("arkit", "Apple ARKit", "mobile-ar", ["arkit", "augmented reality ios", "realitykit", "scene understanding arkit"]),
  s("arcore", "Google ARCore", "mobile-ar", ["arcore", "augmented reality android", "sceneform"]),
  s("core-bluetooth", "CoreBluetooth / Android BLE", "mobile-hardware", ["ble", "bluetooth low energy", "corebluetooth", "ble central peripheral"]),
  s("mobile-security", "Mobile Application Security (OWASP MASVS)", "mobile-security", ["masvs", "mobile app hardening", "jailbreak root detection", "ssl certificate pinning mobile", "keychain keystore secure storage"]),
  s("app-store-optimization", "App Store Optimization (ASO)", "mobile-growth", ["aso", "app store seo", "google play aso", "app conversion optimization"]),
];
