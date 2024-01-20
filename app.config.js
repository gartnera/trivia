function getIdSuffix() {
  const variant = process.env.APP_VARIANT;
  if (variant === 'development') {
    return ".dev"
  }
  if (variant === 'preview') {
    return ".pre"
  }
  return ""
}

function getNameSuffix() {
  const variant = process.env.APP_VARIANT;
  if (variant === 'development') {
    return " (Dev)"
  }
  if (variant === 'preview') {
    return " (Pre)"
  }
  return ""
}

function getIcon() {
  const variant = process.env.APP_VARIANT;
  if (variant === 'development') {
    return "./assets/icon.dev.png"
  }
  if (variant === 'preview') {
    return "./assets/icon.pre.png"
  }
  return "./assets/icon.png"
}

function getShortHash() {
  if (process.env.EAS_BUILD_GIT_COMMIT_HASH) {
    return process.env.EAS_BUILD_GIT_COMMIT_HASH.slice(0, 8)
  }
  const shortHash = require('child_process')
    .execSync('git rev-parse --short HEAD')
    .toString().trim();

  const isDirty = require('child_process')
    .execSync('git diff --quiet || echo "-dirty"')
    .toString().trim();

  return shortHash + isDirty;
}

export default {
  "expo": {
    "name": `SD Trivia${getNameSuffix()}`,
    "slug": "trivia",
    "version": "0.0.3",
    "runtimeVersion": "0.0.3",
    "orientation": "portrait",
    "icon": getIcon(),
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "requireFullScreen": true,
      "bundleIdentifier": `com.agartner.trivia${getIdSuffix()}`,
      "usesAppleSignIn": true,
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": `com.agartner.trivia${getIdSuffix()}`
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "extra": {
      "eas": {
        "projectId": "a8211f7d-beff-491c-91b1-b5340d8b1209"
      },
      "gitShortHash": getShortHash(),
    },
    "experiments": {
      "tsconfigPaths": true
    },
    "plugins": [
      "expo-updates",
      "expo-apple-authentication"
    ],
    "owner": "agartner",
    "updates": {
      "url": "https://u.expo.dev/a8211f7d-beff-491c-91b1-b5340d8b1209"
    }
  }
}