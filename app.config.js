const appJson = require("./app.json");

const naverMapClientId = process.env.EXPO_PUBLIC_NAVER_MAP_CLIENT_ID;

if (!naverMapClientId) {
  throw new Error(
    "EXPO_PUBLIC_NAVER_MAP_CLIENT_ID is missing. Add it to your .env file."
  );
}

module.exports = {
  expo: {
    ...appJson.expo,
    extra: {
      ...(appJson.expo.extra || {}),
      eas: {
        projectId: "6bac3426-9a74-4948-9623-5656217a86ef",
      },
    },
    plugins: [
      [
        "expo-build-properties",
        {
          android: {
            extraMavenRepos: [
              "https://repository.map.naver.com/archive/maven",
            ],
          },
        },
      ],
      [
        "@mj-studio/react-native-naver-map",
        {
          client_id: naverMapClientId,
          ios: {
            NSLocationAlwaysAndWhenInUseUsageDescription:
              "현재 위치 기반 최적의 경로와 횡단보도 시간을 안내하기 위해 위치 권한이 필요합니다.",
            NSLocationWhenInUseUsageDescription:
              "현재 위치에서 가장 가까운 횡단보도를 찾고 거리를 계산하기 위해 위치 권한이 필요합니다.",
          },
        },
      ],
      ...(appJson.expo.plugins || []),
    ],
  },
};
