declare module '@react-native-community/datetimepicker' {
  import { Component } from 'react';
  import { ViewProps } from 'react-native';

  export interface DateTimePickerProps extends ViewProps {
    value: Date;
    mode?: 'date' | 'time';
    display?: 'default' | 'spinner' | 'calendar' | 'clock';
    onChange: (event: any, date?: Date) => void;
    maximumDate?: Date;
    minimumDate?: Date;
    testID?: string;
  }

  const DateTimePicker: React.FC<DateTimePickerProps>;
  export default DateTimePicker;
} 