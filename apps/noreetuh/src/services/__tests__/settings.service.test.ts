import { SettingsService, RestaurantSettings } from '../settings.service';

describe('SettingsService', () => {
  let service: SettingsService;

  beforeEach(() => {
    service = new SettingsService();
  });

  describe('getSettings', () => {
    it('should return all restaurant settings', async () => {
      const settings = await service.getSettings();
      
      expect(settings).toBeDefined();
      expect(settings.name).toBe('Pavé46');
      expect(settings.phone).toBe('(212) 555-0123');
      expect(settings.email).toBe('info@pave46.com');
      expect(settings.monday_open).toBeDefined();
      expect(settings.monday_closed).toBeDefined();
    });
  });

  describe('updateSettings', () => {
    it('should update editable fields', async () => {
      const updates = {
        name: 'Updated Restaurant',
        phone: '(212) 555-9999',
        tagline: 'New Tagline',
      };

      const updated = await service.updateSettings(updates);
      
      expect(updated.name).toBe('Updated Restaurant');
      expect(updated.phone).toBe('(212) 555-9999');
      expect(updated.tagline).toBe('New Tagline');
      
      // Verify changes persist
      const settings = await service.getSettings();
      expect(settings.name).toBe('Updated Restaurant');
    });

    it('should throw error for non-editable fields', async () => {
      const updates = {
        nonExistentField: 'value',
      };

      await expect(service.updateSettings(updates as any)).rejects.toThrow(
        'Field nonExistentField is not editable'
      );
    });

    it('should validate required fields', async () => {
      const updates = {
        name: '', // Required field
      };

      await expect(service.updateSettings(updates)).rejects.toThrow(
        'Restaurant Name is required'
      );
    });

    it('should validate field patterns', async () => {
      const updates = {
        phone: '123-456-7890', // Invalid format
      };

      await expect(service.updateSettings(updates)).rejects.toThrow(
        'Phone Number format is invalid'
      );
    });

    it('should validate field length constraints', async () => {
      const updates = {
        state: 'NEW YORK', // Too long (max 2 characters)
      };

      await expect(service.updateSettings(updates)).rejects.toThrow(
        'State must be no more than 2 characters'
      );
    });

    it('should validate ZIP code pattern', async () => {
      const updates = {
        zip: '123', // Invalid ZIP format
      };

      await expect(service.updateSettings(updates)).rejects.toThrow(
        'ZIP Code format is invalid'
      );
    });
  });

  describe('getSettingsByCategory', () => {
    it('should return only settings for a specific category', async () => {
      const hoursSettings = await service.getSettingsByCategory('hours');
      
      expect(hoursSettings.monday_open).toBeDefined();
      expect(hoursSettings.monday_closed).toBeDefined();
      expect(hoursSettings.friday_open).toBeDefined();
      
      // Should not include non-hours fields
      expect(hoursSettings.name).toBeUndefined();
      expect(hoursSettings.phone).toBeUndefined();
    });

    it('should return contact settings', async () => {
      const contactSettings = await service.getSettingsByCategory('contact');
      
      expect(contactSettings.phone).toBeDefined();
      expect(contactSettings.email).toBeDefined();
      expect(contactSettings.address).toBeDefined();
      expect(contactSettings.city).toBeDefined();
      
      // Should not include non-contact fields
      expect(contactSettings.monday_open).toBeUndefined();
      expect(contactSettings.instagram).toBeUndefined();
    });

    it('should return social settings', async () => {
      const socialSettings = await service.getSettingsByCategory('social');
      
      expect(socialSettings.instagram).toBeDefined();
      expect(socialSettings.facebook).toBeDefined();
      
      // Should not include non-social fields
      expect(socialSettings.name).toBeUndefined();
      expect(socialSettings.phone).toBeUndefined();
    });
  });

  describe('updateSettingsByCategory', () => {
    it('should only update fields in the specified category', async () => {
      const updates = {
        monday_open: '18:00',
        tuesday_open: '18:00',
        name: 'Should Not Update', // This is in 'general' category
        phone: 'Should Not Update', // This is in 'contact' category
      };

      const updated = await service.updateSettingsByCategory('hours', updates);
      
      // Hours should be updated
      expect(updated.monday_open).toBe('18:00');
      expect(updated.tuesday_open).toBe('18:00');
      
      // Other categories should not be in the result
      expect(updated.name).toBeUndefined();
      expect(updated.phone).toBeUndefined();
      
      // Verify other categories were not actually updated
      const allSettings = await service.getSettings();
      expect(allSettings.name).not.toBe('Should Not Update');
      expect(allSettings.phone).not.toBe('Should Not Update');
    });
  });

  describe('formatHoursForDisplay', () => {
    it('should format hours for display', async () => {
      const settings = await service.getSettings();
      const formattedHours = service.formatHoursForDisplay(settings);
      
      expect(formattedHours).toHaveLength(7);
      expect(formattedHours[0]).toEqual({
        day: 'Monday',
        hours: expect.stringMatching(/\d{1,2}:\d{2} (AM|PM) - \d{1,2}:\d{2} (AM|PM)/),
      });
    });

    it('should show "Closed" for closed days', async () => {
      const settings = await service.getSettings();
      
      // Update Monday to closed
      await service.updateSettings({ monday_closed: true });
      const updatedSettings = await service.getSettings();
      
      const formattedHours = service.formatHoursForDisplay(updatedSettings);
      
      expect(formattedHours[0]).toEqual({
        day: 'Monday',
        hours: 'Closed',
      });
    });

    it('should format midnight correctly', async () => {
      const settings = await service.getSettings();
      
      // Set closing time to midnight
      await service.updateSettings({ thursday_close: '00:00' });
      const updatedSettings = await service.getSettings();
      
      const formattedHours = service.formatHoursForDisplay(updatedSettings);
      const thursday = formattedHours.find(h => h.day === 'Thursday');
      
      expect(thursday?.hours).toContain('12:00 AM');
    });

    it('should format late night hours correctly', async () => {
      const settings = await service.getSettings();
      
      // Set closing time to 2 AM
      await service.updateSettings({ friday_close: '02:00' });
      const updatedSettings = await service.getSettings();
      
      const formattedHours = service.formatHoursForDisplay(updatedSettings);
      const friday = formattedHours.find(h => h.day === 'Friday');
      
      expect(friday?.hours).toContain('2:00 AM');
    });
  });
});