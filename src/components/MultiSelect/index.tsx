import React from 'react';
import SelectField from '../SmartSelect';
import type { MultiSelectFieldProps } from '../../types/index.types';

const MultiSelectField: React.FC<MultiSelectFieldProps> = (props) => {
    return <SelectField {...props} multiple={true} />;
};

export default MultiSelectField;