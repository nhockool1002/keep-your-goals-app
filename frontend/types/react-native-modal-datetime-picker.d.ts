declare module 'react-native-modal-datetime-picker' {
  import { FC } from 'react';

  interface DateTimePickerProps {
    isVisible: boolean;
    mode?: 'date' | 'time' | 'datetime';
    date?: Date;
    onConfirm: (date: Date) => void;
    onCancel: () => void;
    minimumDate?: Date;
    maximumDate?: Date;
  }

  const DateTimePickerModal: FC<DateTimePickerProps>;
  export default DateTimePickerModal;
} 