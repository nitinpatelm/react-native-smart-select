/* eslint-disable prettier/prettier */
// SelectField.tsx
import {
    useState,
    useRef,
    useImperativeHandle,
    forwardRef,
    useMemo
} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    FlatList,
    StyleSheet,
    TouchableWithoutFeedback,
    TextInput
} from 'react-native';
import { type SelectFieldProps, type SelectFieldRef, type SelectOption } from '../../types/index.types';

const SelectField = forwardRef<SelectFieldRef, SelectFieldProps>(
    (props, ref) => {
        const {
            options = [],
            selectedValue,
            onValueChange,
            placeholder = "Select an option",
            disabled = false,
            searchable = false,
            multiple = false,
            style,
            containerStyle,
            textStyle,
            dropdownStyle,
            itemStyle,
            itemTextStyle,
            selectedItemStyle,
            selectedItemTextStyle,
            renderArrow,
            renderCheckmark,
            label,
            error,
            searchPlaceholder = "Search..."
        } = props;

        const [modalVisible, setModalVisible] = useState(false);
        const [searchQuery, setSearchQuery] = useState('');
        const searchInputRef = useRef<any>(null);

        useImperativeHandle(ref, () => ({
            open: () => !disabled && setModalVisible(true),
            close: () => setModalVisible(false),
            focus: () => searchInputRef.current?.focus()
        }));

        const filteredOptions = useMemo(() => {
            if (!searchQuery.trim()) return options;

            return options.filter((option: { label: string; }) =>
                option.label.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }, [options, searchQuery]);

        const handleSelect = (item: SelectOption) => {
            if (item.disabled) return;

            if (multiple) {
                // Handle multiple selection
                const currentValues = Array.isArray(selectedValue) ? selectedValue : [];
                const newValue = currentValues.includes(item.value)
                    ? currentValues.filter(v => v !== item.value)
                    : [...currentValues, item.value];
                (onValueChange as (value: (string | number)[]) => void)(newValue);
            } else {
                // Handle single selection
                (onValueChange as (value: string | number | null) => void)(item.value);
                setModalVisible(false);
                setSearchQuery('');
            }
        };

        const getSelectedLabel = (): string => {
            if (multiple) {
                const selectedOptions = options.filter((opt: { value: any; }) =>
                    Array.isArray(selectedValue) && selectedValue.includes(opt.value)
                );
                return selectedOptions.length > 0
                    ? selectedOptions.map((opt: { label: any; }) => opt.label).join(', ')
                    : placeholder;
            } else {
                const selectedOption = options.find((opt: { value: any; }) => opt.value === selectedValue);
                return selectedOption ? selectedOption.label : placeholder;
            }
        };

        const isSelected = (option: SelectOption): boolean => {
            if (multiple) {
                return Array.isArray(selectedValue) && selectedValue.includes(option.value);
            } else {
                return option.value === selectedValue;
            }
        };

        const renderItem = ({ item }: { item: SelectOption }) => (
            <TouchableOpacity
                style={[
                    styles.item,
                    itemStyle,
                    isSelected(item) && [styles.selectedItem, selectedItemStyle],
                    item.disabled && styles.disabledItem
                ]}
                onPress={() => handleSelect(item)}
                disabled={item.disabled}
            >
                <Text
                    style={[
                        styles.itemText,
                        itemTextStyle,
                        isSelected(item) && [styles.selectedItemText, selectedItemTextStyle],
                        item.disabled && styles.disabledItemText
                    ]}
                >
                    {item.label}
                </Text>
                {isSelected(item) && (renderCheckmark?.() || (
                    <Text style={styles.checkmark}>✓</Text>
                ))}
            </TouchableOpacity>
        );

        return (
            <View style={[styles.container, containerStyle]}>
                {label && <Text style={styles.label}>{label}</Text>}

                <TouchableOpacity
                    style={[
                        styles.selectButton,
                        style,
                        disabled && styles.disabledButton,
                        error && styles.errorBorder
                    ]}
                    onPress={() => !disabled && setModalVisible(true)}
                    disabled={disabled}
                >
                    <Text
                        style={[
                            styles.selectButtonText,
                            textStyle,
                            (!selectedValue || (multiple && Array.isArray(selectedValue) && selectedValue.length === 0)) && styles.placeholderText,
                            error && styles.errorText
                        ]}
                        numberOfLines={1}
                    >
                        {getSelectedLabel()}
                    </Text>
                    {renderArrow?.(modalVisible) || (
                        <Text style={[styles.arrow, modalVisible && styles.arrowOpen]}>
                            {modalVisible ? '▲' : '▼'}
                        </Text>
                    )}
                </TouchableOpacity>

                {error && <Text style={styles.errorText}>{error}</Text>}

                <Modal
                    visible={modalVisible}
                    transparent
                    animationType="fade"
                    onRequestClose={() => {
                        setModalVisible(false);
                        setSearchQuery('');
                    }}
                >
                    <TouchableWithoutFeedback onPress={() => {
                        setModalVisible(false);
                        setSearchQuery('');
                    }}>
                        <View style={styles.modalOverlay}>
                            <TouchableWithoutFeedback>
                                <View style={[styles.dropdown, dropdownStyle]}>
                                    {searchable && (
                                        <View style={styles.searchContainer}>
                                            <TextInput
                                                ref={searchInputRef}
                                                style={styles.searchInput}
                                                placeholder={searchPlaceholder}
                                                value={searchQuery}
                                                onChangeText={setSearchQuery}
                                                autoFocus
                                            />
                                        </View>
                                    )}

                                    <FlatList
                                        data={filteredOptions}
                                        keyExtractor={(item) => item.value.toString()}
                                        renderItem={renderItem}
                                        ListEmptyComponent={
                                            <Text style={styles.emptyText}>No options found</Text>
                                        }
                                        keyboardShouldPersistTaps="handled"
                                    />
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            </View>
        );
    }
);

// Styles remain the same as previous implementation
const styles = StyleSheet.create({
    container: {
        marginVertical: 8,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
        color: '#333',
    },
    selectButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        backgroundColor: 'white',
        minHeight: 48,
    },
    disabledButton: {
        backgroundColor: '#f5f5f5',
        opacity: 0.6,
    },
    errorBorder: {
        borderColor: '#ff3b30',
    },
    selectButtonText: {
        fontSize: 16,
        color: '#333',
        flex: 1,
        marginRight: 8,
    },
    placeholderText: {
        color: '#999',
    },
    errorText: {
        color: '#ff3b30',
        fontSize: 14,
        marginTop: 4,
    },
    arrow: {
        fontSize: 12,
        color: '#666',
    },
    arrowOpen: {
        transform: [{ rotate: '180deg' }],
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    dropdown: {
        width: '100%',
        maxHeight: 400,
        backgroundColor: 'white',
        borderRadius: 12,
        overflow: 'hidden',
    },
    searchContainer: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    searchInput: {
        padding: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 6,
        fontSize: 16,
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5',
    },
    selectedItem: {
        backgroundColor: '#e3f2fd',
    },
    disabledItem: {
        opacity: 0.5,
    },
    itemText: {
        fontSize: 16,
        color: '#333',
        flex: 1,
    },
    selectedItemText: {
        color: '#1976d2',
        fontWeight: '600',
    },
    disabledItemText: {
        color: '#999',
    },
    checkmark: {
        color: '#1976d2',
        fontSize: 16,
        fontWeight: 'bold',
    },
    emptyText: {
        textAlign: 'center',
        padding: 20,
        color: '#999',
        fontSize: 16,
    },
});

export default SelectField;