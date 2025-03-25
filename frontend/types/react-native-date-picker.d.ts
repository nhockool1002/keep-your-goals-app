declare module 'react-native-date-picker' {
  import { FC } from 'react';

  interface DatePickerProps {
    date: Date;
    onDateChange: (date: Date) => void;
    mode?: 'date' | 'time' | 'datetime';
    minimumDate?: Date;
    maximumDate?: Date;
    androidVariant?: 'iosClone' | 'nativeAndroid';
    locale?: string;
  }

  const DatePicker: FC<DatePickerProps>;
  export default DatePicker;
} 