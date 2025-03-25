declare module 'react-native-calendar-picker' {
  import { FC } from 'react';

  interface CalendarPickerProps {
    allowRangeSelection?: boolean;
    minDate?: Date;
    maxDate?: Date;
    selectedStartDate?: Date;
    selectedEndDate?: Date;
    onDateChange?: (date: Date | null) => void;
    width?: number;
    todayBackgroundColor?: string;
    selectedDayColor?: string;
    selectedDayTextColor?: string;
    textStyle?: {
      color?: string;
      fontSize?: number;
    };
  }

  const CalendarPicker: FC<CalendarPickerProps>;
  export default CalendarPicker;
} 