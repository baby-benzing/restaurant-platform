import { getFieldConfig, getEditableFields } from '@/config/editable-fields.config';

export interface RestaurantSettings {
  // General
  name: string;
  tagline: string;
  description: string;
  cuisine: string;
  
  // Contact
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  
  // Hours
  monday_open?: string;
  monday_close?: string;
  monday_closed: boolean;
  tuesday_open?: string;
  tuesday_close?: string;
  tuesday_closed: boolean;
  wednesday_open?: string;
  wednesday_close?: string;
  wednesday_closed: boolean;
  thursday_open?: string;
  thursday_close?: string;
  thursday_closed: boolean;
  friday_open?: string;
  friday_close?: string;
  friday_closed: boolean;
  saturday_open?: string;
  saturday_close?: string;
  saturday_closed: boolean;
  sunday_open?: string;
  sunday_close?: string;
  sunday_closed: boolean;
  
  // Social
  instagram?: string;
  facebook?: string;
  twitter?: string;
  yelp?: string;
  opentable?: string;
}

// Mock data storage
let mockSettings: RestaurantSettings = {
  name: 'Pavé46',
  tagline: 'French Bistro in Hudson Square',
  description: 'An intimate neighborhood cocktail bar in Hudson Square blending Parisian charm with New York sophistication.',
  cuisine: 'french',
  phone: '(212) 555-0123',
  email: 'info@pave46.com',
  address: '46 Hudson Square',
  city: 'New York',
  state: 'NY',
  zip: '10013',
  monday_open: '17:00',
  monday_close: '23:00',
  monday_closed: false,
  tuesday_open: '17:00',
  tuesday_close: '23:00',
  tuesday_closed: false,
  wednesday_open: '17:00',
  wednesday_close: '23:00',
  wednesday_closed: false,
  thursday_open: '17:00',
  thursday_close: '00:00',
  thursday_closed: false,
  friday_open: '17:00',
  friday_close: '02:00',
  friday_closed: false,
  saturday_open: '17:00',
  saturday_close: '02:00',
  saturday_closed: false,
  sunday_open: '16:00',
  sunday_close: '22:00',
  sunday_closed: false,
  instagram: 'https://instagram.com/pave46',
  facebook: 'https://facebook.com/pave46',
};

export class SettingsService {
  async getSettings(): Promise<RestaurantSettings> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    return { ...mockSettings };
  }

  async updateSettings(updates: Partial<RestaurantSettings>): Promise<RestaurantSettings> {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Validate each field based on configuration
    for (const [key, value] of Object.entries(updates)) {
      const fieldConfig = getFieldConfig(key);
      
      if (!fieldConfig || !fieldConfig.editable) {
        throw new Error(`Field ${key} is not editable`);
      }
      
      // Validate required fields
      if (fieldConfig.required && !value) {
        throw new Error(`${fieldConfig.label} is required`);
      }
      
      // Validate based on field type and validation rules
      if (value && fieldConfig.validation) {
        const { pattern, minLength, maxLength, min, max } = fieldConfig.validation;
        
        if (pattern && typeof value === 'string' && !pattern.test(value)) {
          throw new Error(`${fieldConfig.label} format is invalid`);
        }
        
        if (minLength && typeof value === 'string' && value.length < minLength) {
          throw new Error(`${fieldConfig.label} must be at least ${minLength} characters`);
        }
        
        if (maxLength && typeof value === 'string' && value.length > maxLength) {
          throw new Error(`${fieldConfig.label} must be no more than ${maxLength} characters`);
        }
        
        if (min !== undefined && typeof value === 'number' && value < min) {
          throw new Error(`${fieldConfig.label} must be at least ${min}`);
        }
        
        if (max !== undefined && typeof value === 'number' && value > max) {
          throw new Error(`${fieldConfig.label} must be no more than ${max}`);
        }
      }
    }
    
    // Update mock settings
    mockSettings = { ...mockSettings, ...updates };
    return { ...mockSettings };
  }

  async getSettingsByCategory(category: string): Promise<Partial<RestaurantSettings>> {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const fields = getEditableFields(category);
    const result: Partial<RestaurantSettings> = {};
    
    for (const field of fields) {
      if (field.id in mockSettings) {
        (result as any)[field.id] = mockSettings[field.id as keyof RestaurantSettings];
      }
    }
    
    return result;
  }

  async updateSettingsByCategory(category: string, updates: Partial<RestaurantSettings>): Promise<Partial<RestaurantSettings>> {
    // Filter updates to only include fields from the specified category
    const categoryFields = getEditableFields(category);
    const categoryFieldIds = categoryFields.map(f => f.id);
    
    const filteredUpdates: Partial<RestaurantSettings> = {};
    for (const [key, value] of Object.entries(updates)) {
      if (categoryFieldIds.includes(key)) {
        (filteredUpdates as any)[key] = value;
      }
    }
    
    await this.updateSettings(filteredUpdates);
    return this.getSettingsByCategory(category);
  }

  formatHoursForDisplay(settings: RestaurantSettings): Array<{ day: string; hours: string }> {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const dayLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    return days.map((day, index) => {
      const isClosed = settings[`${day}_closed` as keyof RestaurantSettings];
      
      if (isClosed) {
        return { day: dayLabels[index] || day, hours: 'Closed' };
      }
      
      const open = settings[`${day}_open` as keyof RestaurantSettings] || '17:00';
      const close = settings[`${day}_close` as keyof RestaurantSettings] || '23:00';
      
      return { 
        day: dayLabels[index] || day, 
        hours: `${this.formatTime(open as string)} - ${this.formatTime(close as string)}` 
      };
    });
  }

  private formatTime(time: string): string {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours || '0', 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  }
}