declare module '@react-native-picker/picker' {
  import { Component } from 'react';
  import { ViewStyle, TextStyle } from 'react-native';

  export interface PickerProps<T = any> {
    selectedValue?: T;
    onValueChange?: (value: T) => void;
    style?: ViewStyle;
    itemStyle?: TextStyle;
    mode?: 'dialog' | 'dropdown';
    enabled?: boolean;
    children: React.ReactNode;
  }

  export interface PickerItemProps<T = any> {
    label: string;
    value: T;
    color?: string;
    testID?: string;
  }

  export class Picker<T = any> extends Component<PickerProps<T>> {}
  export class PickerItem<T = any> extends Component<PickerItemProps<T>> {}
} 