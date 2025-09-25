// types.ts
export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

// Base props without generic constraints
export interface BaseSelectFieldProps {
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  searchable?: boolean;

  // Styles
  style?: import('react-native').ViewStyle;
  containerStyle?: import('react-native').ViewStyle;
  textStyle?: import('react-native').TextStyle;
  dropdownStyle?: import('react-native').ViewStyle;
  itemStyle?: import('react-native').ViewStyle;
  itemTextStyle?: import('react-native').TextStyle;
  selectedItemStyle?: import('react-native').ViewStyle;
  selectedItemTextStyle?: import('react-native').TextStyle;

  // Icons
  renderArrow?: (isOpen: boolean) => React.ReactNode;
  renderCheckmark?: () => React.ReactNode;

  // Labels
  label?: string;
  error?: string;

  // Search
  searchPlaceholder?: string;
}

// Single select props
export interface SingleSelectFieldProps extends BaseSelectFieldProps {
  multiple?: false;
  selectedValue?: string | number | null;
  onValueChange: (value: string | number | null) => void;
}

// Multiple select props
export interface MultiSelectFieldProps extends BaseSelectFieldProps {
  multiple: true;
  selectedValue?: (string | number)[];
  onValueChange: (value: (string | number)[]) => void;
}

// Union type that can handle both
export type SelectFieldProps = SingleSelectFieldProps | MultiSelectFieldProps;

// Helper type to extract value type based on multiple flag
export type SelectValueType<T extends boolean> = T extends true
  ? (string | number)[]
  : string | number | null;

export interface SelectFieldRef {
  open: () => void;
  close: () => void;
  focus: () => void;
}
