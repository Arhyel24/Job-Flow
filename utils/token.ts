import * as SecureStorage from "expo-secure-store";

const getAccessToken = async () => {
  return await SecureStorage.getItemAsync("access_token");
};

export default getAccessToken;
