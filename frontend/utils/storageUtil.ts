import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveToken = async (token: string) => {
  try {
    await AsyncStorage.setItem('accessToken', token);
  } catch (error) {
    console.error("Lưu token thất bại:", error);
  }
};

export const getToken = async () => {
  try {
    return await AsyncStorage.getItem('accessToken');
  } catch (error) {
    console.error("Lấy token thất bại:", error);
    return null;
  }
};

export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem('accessToken');
  } catch (error) {
    console.error("Xóa token thất bại:", error);
  }
};
