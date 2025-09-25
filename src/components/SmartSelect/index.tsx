/* eslint-disable prettier/prettier */
// SelectField.tsx
import {
    useState,
    useRef,
    useImperativeHandle,
    forwardRef,
    useMemo,
    useEffect
} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    FlatList,
    StyleSheet,
    TouchableWithoutFeedback,
    TextInput,
    Animated,
    Easing,
    Dimensions,
    Platform
} from 'react-native';
import { type SelectFieldProps, type SelectFieldRef, type SelectOption } from '../../types/index.types';

const { height: WINDOW_HEIGHT } = Dimensions.get('window');

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

        // Animation values
        const slideAnim = useRef(new Animated.Value(0)).current;
        const fadeAnim = useRef(new Animated.Value(0)).current;

        useImperativeHandle(ref, () => ({
            open: () => !disabled && setModalVisible(true),
            close: () => setModalVisible(false),
            focus: () => searchInputRef.current?.focus()
        }));

        // Animation effects
        useEffect(() => {
            if (modalVisible) {
                Animated.parallel([
                    Animated.timing(fadeAnim, {
                        toValue: 1,
                        duration: 150,
                        useNativeDriver: true,
                    }),
                    Animated.timing(slideAnim, {
                        toValue: 1,
                        duration: 250,
                        easing: Easing.out(Easing.cubic),
                        useNativeDriver: true,
                    }),
                ]).start();
            } else {
                Animated.parallel([
                    Animated.timing(fadeAnim, {
                        toValue: 0,
                        duration: 150,
                        useNativeDriver: true,
                    }),
                    Animated.timing(slideAnim, {
                        toValue: 0,
                        duration: 200,
                        useNativeDriver: true,
                    }),
                ]).start();
            }
        }, [modalVisible, fadeAnim, slideAnim]);

        const filteredOptions = useMemo(() => {
            if (!searchQuery.trim()) return options;

            return options.filter((option: { label: string; }) =>
                option.label.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }, [options, searchQuery]);

        const handleSelect = (item: SelectOption) => {
            if (item.disabled) return;

            if (multiple) {
                const currentValues = Array.isArray(selectedValue) ? selectedValue : [];
                const newValue = currentValues.includes(item.value)
                    ? currentValues.filter(v => v !== item.value)
                    : [...currentValues, item.value];
                (onValueChange as (value: (string | number)[]) => void)(newValue);
            } else {
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

        const handleCloseModal = () => {
            setModalVisible(false);
            setSearchQuery('');
        };

        // Animation interpolations
        const modalTranslateY = slideAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [WINDOW_HEIGHT, 0],
        });

        const modalOpacity = fadeAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
        });

        const renderItem = ({ item }: { item: SelectOption }) => (
            <TouchableOpacity
                style={[
                    styles.optionItem,
                    itemStyle,
                    isSelected(item) && [styles.selectedOption, selectedItemStyle],
                    item.disabled && styles.disabledItem
                ]}
                onPress={() => handleSelect(item)}
                disabled={item.disabled}
            >
                <Text
                    style={[
                        styles.optionText,
                        itemTextStyle,
                        isSelected(item) && [styles.selectedOptionText, selectedItemTextStyle],
                        item.disabled && styles.disabledItemText
                    ]}
                    numberOfLines={1}
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
                {label && <Text style={[styles.label, error && styles.labelError]}>{label}</Text>}

                <TouchableOpacity
                    style={[
                        styles.selectTrigger,
                        style,
                        disabled && styles.disabledButton,
                        error && styles.selectTriggerError
                    ]}
                    onPress={() => !disabled && setModalVisible(true)}
                    disabled={disabled}
                >
                    <Text
                        style={[
                            styles.selectText,
                            textStyle,
                            (!selectedValue || (multiple && Array.isArray(selectedValue) && selectedValue.length === 0)) && styles.placeholderText,
                            error && styles.errorText
                        ]}
                        numberOfLines={1}
                    >
                        {getSelectedLabel()}
                    </Text>
                    {renderArrow?.(modalVisible) || (
                        <Text style={[styles.chevron, modalVisible && styles.chevronOpen]}>
                            ▼
                        </Text>
                    )}
                </TouchableOpacity>

                {error && <Text style={styles.errorText}>{error}</Text>}

                <Modal
                    visible={modalVisible}
                    transparent
                    animationType="none"
                    onRequestClose={handleCloseModal}
                    statusBarTranslucent={true}
                >
                    <View style={StyleSheet.absoluteFill}>
                        <TouchableWithoutFeedback onPress={handleCloseModal}>
                            <Animated.View style={[styles.backdrop, { opacity: modalOpacity }]} />
                        </TouchableWithoutFeedback>

                        <Animated.View
                            style={[
                                styles.modalContent,
                                {
                                    opacity: modalOpacity,
                                    transform: [{ translateY: modalTranslateY }],
                                },
                                dropdownStyle
                            ]}
                        >
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>{label || 'Select an option'}</Text>
                                <TouchableOpacity
                                    onPress={handleCloseModal}
                                    style={styles.closeButton}
                                >
                                    <Text style={styles.closeText}>✕</Text>
                                </TouchableOpacity>
                            </View>

                            {searchable && (
                                <View style={styles.searchContainer}>
                                    <TextInput
                                        ref={searchInputRef}
                                        style={styles.searchInput}
                                        placeholder={searchPlaceholder}
                                        value={searchQuery}
                                        onChangeText={setSearchQuery}
                                        autoFocus
                                        returnKeyType="search"
                                    />
                                </View>
                            )}

                            <FlatList
                                data={filteredOptions}
                                keyExtractor={(item) => item.value.toString()}
                                renderItem={renderItem}
                                style={styles.optionsList}
                                keyboardShouldPersistTaps="handled"
                                initialNumToRender={20}
                                maxToRenderPerBatch={30}
                                windowSize={10}
                                ListEmptyComponent={
                                    <View style={styles.emptyContainer}>
                                        <Text style={styles.emptyText}>No options found</Text>
                                    </View>
                                }
                            />
                        </Animated.View>
                    </View>
                </Modal>
            </View>
        );
    }
);

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginVertical: 8,
    },
    label: {
        fontSize: 17,
        fontWeight: '500',
        color: '#333',
        marginBottom: 8,
    },
    labelError: {
        color: '#ff3b30',
    },
    selectTrigger: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        padding: 12,
        backgroundColor: '#FFFFFF',
        minHeight: 48,
    },
    disabledButton: {
        backgroundColor: '#f5f5f5',
        opacity: 0.6,
    },
    selectTriggerError: {
        borderColor: '#ff3b30',
    },
    selectText: {
        flex: 1,
        fontSize: 16,
        color: '#111827',
        marginRight: 8,
    },
    placeholderText: {
        color: '#6B7280',
    },
    errorText: {
        color: '#ff3b30',
        fontSize: 14,
        marginTop: 4,
    },
    chevron: {
        fontSize: 16,
        color: '#6B7280',
    },
    chevronOpen: {
        transform: [{ rotate: '180deg' }],
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        maxHeight: WINDOW_HEIGHT * 0.8,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -3 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 8,
            },
        }),
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
    },
    closeButton: {
        padding: 8,
    },
    closeText: {
        fontSize: 18,
        color: '#6B7280',
        fontWeight: 'bold',
    },
    searchContainer: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    searchInput: {
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#F9FAFB',
    },
    optionsList: {
        maxHeight: WINDOW_HEIGHT * 0.5,
        paddingBottom: 20
    },
    optionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    selectedOption: {
        backgroundColor: '#1aa950',
        borderRadius: 8,
        margin: 4,
    },
    disabledItem: {
        opacity: 0.5,
    },
    optionText: {
        fontSize: 16,
        color: '#374151',
        flex: 1,
    },
    selectedOptionText: {
        color: '#FFFFFF',
        fontWeight: '500',
    },
    disabledItemText: {
        color: '#999',
    },
    checkmark: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    emptyContainer: {
        padding: 32,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#6B7280',
    },
});

export default SelectField;