import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ag_solutions',
  appName: 'AG-Solutions',
  webDir: 'www',
  android: {
    buildOptions: {
      releaseType: 'APK',
      keystorePath: 'C:/Users/SANKET/.android/debug.keystore', // Path to your keystore file
      keystorePassword: 'android', // Your keystore password
      keystoreAlias: 'androiddebugkey', // Correct alias from the keystore
      keystoreAliasPassword: 'android' // Correct alias password
    }
  },
  plugins: {
    GoogleAuth: {
      scopes: ["profile", "email"],
      serverClientId: "384806860358-lqs2clvmbf2khja0f0irp92j848gq5c0.apps.googleusercontent.com",  // Your Client ID
      forceCodeForRefreshToken: true
    }
  }
};

export default config;
