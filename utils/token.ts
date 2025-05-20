import * as SecureStorage from "expo-secure-store";

const getAccessToken = async (): Promise<string | null> => {
  try {
    const token = await SecureStorage.getItemAsync("access_token");
    if (!token) {
      console.error("No access token found");
      return null;
    }
    return token;
  } catch (error) {
    console.error("Error retrieving access token:", error);
    return null;
  }
};

export default getAccessToken;
