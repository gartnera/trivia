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

export default {
  "expo": {
    "name": `SD Trivia${getNameSuffix()}`,
    "slug": "trivia",
    "version": "0.0.1",
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
      }
    },
    "experiments": {
      "tsconfigPaths": true
    },
    "owner": "agartner",
  }
}