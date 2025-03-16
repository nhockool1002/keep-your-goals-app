import { lightTheme } from './lightTheme';
import { darkTheme } from './darkTheme';

export const getTheme = (isDarkMode: boolean) => (isDarkMode ? darkTheme : lightTheme);
