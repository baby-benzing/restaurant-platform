/**
 * Configuration for editable fields in the admin panel
 * This configuration determines which fields can be edited through the admin interface
 */

export interface FieldConfig {
  id: string;
  label: string;
  type: 'text' | 'email' | 'phone' | 'url' | 'textarea' | 'time' | 'select' | 'boolean' | 'number';
  required?: boolean;
  placeholder?: string;
  validation?: {
    pattern?: RegExp;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
  };
  options?: Array<{ value: string; label: string }>; // For select type
  defaultValue?: any;
  editable: boolean;
  category: string;
}

export interface EditableFieldsConfig {
  restaurant: {
    general: FieldConfig[];
    contact: FieldConfig[];
    hours: FieldConfig[];
    social: FieldConfig[];
  };
}

const config: EditableFieldsConfig = {
  restaurant: {
    general: [
      {
        id: 'name',
        label: 'Restaurant Name',
        type: 'text',
        required: true,
        placeholder: 'Pavé46',
        editable: true,
        category: 'general',
        validation: {
          minLength: 2,
          maxLength: 100,
        },
      },
      {
        id: 'tagline',
        label: 'Tagline',
        type: 'text',
        placeholder: 'French Bistro in Hudson Square',
        editable: true,
        category: 'general',
        validation: {
          maxLength: 150,
        },
      },
      {
        id: 'description',
        label: 'Description',
        type: 'textarea',
        placeholder: 'A brief description of your restaurant...',
        editable: true,
        category: 'general',
        validation: {
          maxLength: 500,
        },
      },
      {
        id: 'cuisine',
        label: 'Cuisine Type',
        type: 'select',
        required: true,
        editable: true,
        category: 'general',
        options: [
          { value: 'french', label: 'French' },
          { value: 'italian', label: 'Italian' },
          { value: 'american', label: 'American' },
          { value: 'asian', label: 'Asian' },
          { value: 'mediterranean', label: 'Mediterranean' },
          { value: 'other', label: 'Other' },
        ],
        defaultValue: 'french',
      },
    ],
    contact: [
      {
        id: 'phone',
        label: 'Phone Number',
        type: 'phone',
        required: true,
        placeholder: '(212) 555-0123',
        editable: true,
        category: 'contact',
        validation: {
          pattern: /^\(\d{3}\) \d{3}-\d{4}$/,
        },
      },
      {
        id: 'email',
        label: 'Email',
        type: 'email',
        required: true,
        placeholder: 'info@pave46.com',
        editable: true,
        category: 'contact',
      },
      {
        id: 'address',
        label: 'Street Address',
        type: 'text',
        required: true,
        placeholder: '46 Hudson Square',
        editable: true,
        category: 'contact',
      },
      {
        id: 'city',
        label: 'City',
        type: 'text',
        required: true,
        placeholder: 'New York',
        editable: true,
        category: 'contact',
      },
      {
        id: 'state',
        label: 'State',
        type: 'text',
        required: true,
        placeholder: 'NY',
        editable: true,
        category: 'contact',
        validation: {
          maxLength: 2,
        },
      },
      {
        id: 'zip',
        label: 'ZIP Code',
        type: 'text',
        required: true,
        placeholder: '10013',
        editable: true,
        category: 'contact',
        validation: {
          pattern: /^\d{5}$/,
        },
      },
    ],
    hours: [
      {
        id: 'monday_open',
        label: 'Monday Open',
        type: 'time',
        editable: true,
        category: 'hours',
        defaultValue: '17:00',
      },
      {
        id: 'monday_close',
        label: 'Monday Close',
        type: 'time',
        editable: true,
        category: 'hours',
        defaultValue: '23:00',
      },
      {
        id: 'tuesday_open',
        label: 'Tuesday Open',
        type: 'time',
        editable: true,
        category: 'hours',
        defaultValue: '17:00',
      },
      {
        id: 'tuesday_close',
        label: 'Tuesday Close',
        type: 'time',
        editable: true,
        category: 'hours',
        defaultValue: '23:00',
      },
      {
        id: 'wednesday_open',
        label: 'Wednesday Open',
        type: 'time',
        editable: true,
        category: 'hours',
        defaultValue: '17:00',
      },
      {
        id: 'wednesday_close',
        label: 'Wednesday Close',
        type: 'time',
        editable: true,
        category: 'hours',
        defaultValue: '23:00',
      },
      {
        id: 'thursday_open',
        label: 'Thursday Open',
        type: 'time',
        editable: true,
        category: 'hours',
        defaultValue: '17:00',
      },
      {
        id: 'thursday_close',
        label: 'Thursday Close',
        type: 'time',
        editable: true,
        category: 'hours',
        defaultValue: '00:00',
      },
      {
        id: 'friday_open',
        label: 'Friday Open',
        type: 'time',
        editable: true,
        category: 'hours',
        defaultValue: '17:00',
      },
      {
        id: 'friday_close',
        label: 'Friday Close',
        type: 'time',
        editable: true,
        category: 'hours',
        defaultValue: '02:00',
      },
      {
        id: 'saturday_open',
        label: 'Saturday Open',
        type: 'time',
        editable: true,
        category: 'hours',
        defaultValue: '17:00',
      },
      {
        id: 'saturday_close',
        label: 'Saturday Close',
        type: 'time',
        editable: true,
        category: 'hours',
        defaultValue: '02:00',
      },
      {
        id: 'sunday_open',
        label: 'Sunday Open',
        type: 'time',
        editable: true,
        category: 'hours',
        defaultValue: '16:00',
      },
      {
        id: 'sunday_close',
        label: 'Sunday Close',
        type: 'time',
        editable: true,
        category: 'hours',
        defaultValue: '22:00',
      },
      {
        id: 'monday_closed',
        label: 'Monday Closed',
        type: 'boolean',
        editable: true,
        category: 'hours',
        defaultValue: false,
      },
      {
        id: 'tuesday_closed',
        label: 'Tuesday Closed',
        type: 'boolean',
        editable: true,
        category: 'hours',
        defaultValue: false,
      },
      {
        id: 'wednesday_closed',
        label: 'Wednesday Closed',
        type: 'boolean',
        editable: true,
        category: 'hours',
        defaultValue: false,
      },
      {
        id: 'thursday_closed',
        label: 'Thursday Closed',
        type: 'boolean',
        editable: true,
        category: 'hours',
        defaultValue: false,
      },
      {
        id: 'friday_closed',
        label: 'Friday Closed',
        type: 'boolean',
        editable: true,
        category: 'hours',
        defaultValue: false,
      },
      {
        id: 'saturday_closed',
        label: 'Saturday Closed',
        type: 'boolean',
        editable: true,
        category: 'hours',
        defaultValue: false,
      },
      {
        id: 'sunday_closed',
        label: 'Sunday Closed',
        type: 'boolean',
        editable: true,
        category: 'hours',
        defaultValue: false,
      },
    ],
    social: [
      {
        id: 'instagram',
        label: 'Instagram',
        type: 'url',
        placeholder: 'https://instagram.com/pave46',
        editable: true,
        category: 'social',
      },
      {
        id: 'facebook',
        label: 'Facebook',
        type: 'url',
        placeholder: 'https://facebook.com/pave46',
        editable: true,
        category: 'social',
      },
      {
        id: 'twitter',
        label: 'Twitter/X',
        type: 'url',
        placeholder: 'https://twitter.com/pave46',
        editable: true,
        category: 'social',
      },
      {
        id: 'yelp',
        label: 'Yelp',
        type: 'url',
        placeholder: 'https://yelp.com/biz/pave46',
        editable: true,
        category: 'social',
      },
      {
        id: 'opentable',
        label: 'OpenTable',
        type: 'url',
        placeholder: 'https://opentable.com/pave46',
        editable: true,
        category: 'social',
      },
    ],
  },
};

// Helper functions to work with the configuration
export function getEditableFields(category?: string): FieldConfig[] {
  const allFields = [
    ...config.restaurant.general,
    ...config.restaurant.contact,
    ...config.restaurant.hours,
    ...config.restaurant.social,
  ];

  if (category) {
    return allFields.filter(field => field.category === category && field.editable);
  }

  return allFields.filter(field => field.editable);
}

export function getFieldConfig(fieldId: string): FieldConfig | undefined {
  const allFields = [
    ...config.restaurant.general,
    ...config.restaurant.contact,
    ...config.restaurant.hours,
    ...config.restaurant.social,
  ];

  return allFields.find(field => field.id === fieldId);
}

export function isFieldEditable(fieldId: string): boolean {
  const field = getFieldConfig(fieldId);
  return field?.editable ?? false;
}

export default config;