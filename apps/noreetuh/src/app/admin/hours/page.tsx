'use client';

import { useState, useEffect } from 'react';
import { Container, Section, Card, Button } from '@restaurant-platform/web-common';
import Link from 'next/link';
import { SettingsService, RestaurantSettings } from '@/services/settings.service';

export default function HoursManagementPage() {
  const [settings, setSettings] = useState<Partial<RestaurantSettings>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const dayLabels = {
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday',
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const service = new SettingsService();
      const hoursSettings = await service.getSettingsByCategory('hours');
      setSettings(hoursSettings);
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTimeChange = (day: string, type: 'open' | 'close', value: string) => {
    setSettings(prev => ({
      ...prev,
      [`${day}_${type}`]: value,
    }));
    setHasChanges(true);
  };

  const handleClosedToggle = (day: string) => {
    setSettings(prev => ({
      ...prev,
      [`${day}_closed`]: !prev[`${day}_closed` as keyof RestaurantSettings],
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const service = new SettingsService();
      await service.updateSettingsByCategory('hours', settings);
      setHasChanges(false);
      alert('Hours updated successfully!');
    } catch (error: any) {
      alert(error.message || 'Failed to update hours');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    loadSettings();
    setHasChanges(false);
  };

  const copyHours = (fromDay: string, toDay: string) => {
    setSettings(prev => ({
      ...prev,
      [`${toDay}_open`]: prev[`${fromDay}_open` as keyof RestaurantSettings],
      [`${toDay}_close`]: prev[`${fromDay}_close` as keyof RestaurantSettings],
      [`${toDay}_closed`]: prev[`${fromDay}_closed` as keyof RestaurantSettings],
    }));
    setHasChanges(true);
  };

  const applyToWeekdays = () => {
    const mondayOpen = settings.monday_open;
    const mondayClose = settings.monday_close;
    const mondayClosed = settings.monday_closed;

    const weekdays = ['tuesday', 'wednesday', 'thursday', 'friday'];
    const updates: Partial<RestaurantSettings> = {};
    
    weekdays.forEach(day => {
      updates[`${day}_open` as keyof RestaurantSettings] = mondayOpen as any;
      updates[`${day}_close` as keyof RestaurantSettings] = mondayClose as any;
      updates[`${day}_closed` as keyof RestaurantSettings] = mondayClosed as any;
    });

    setSettings(prev => ({ ...prev, ...updates }));
    setHasChanges(true);
  };

  if (loading) {
    return (
      <main>
        <Section spacing="lg" className="pt-24">
          <Container>
            <div className="flex justify-center items-center h-64">
              <div className="text-neutral-500">Loading hours...</div>
            </div>
          </Container>
        </Section>
      </main>
    );
  }

  return (
    <main>
      <Section spacing="lg" className="pt-24">
        <Container>
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-serif font-bold text-neutral-900">
                  Operating Hours
                </h1>
                <p className="text-neutral-600 mt-2">
                  Manage your restaurant operating hours
                </p>
              </div>
              <Link
                href="/admin/dashboard"
                className="px-4 py-2 text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                Back to Dashboard
              </Link>
            </div>

            {/* Quick Actions */}
            <Card padding="md" variant="bordered" className="mb-6">
              <div className="flex gap-4">
                <button
                  onClick={applyToWeekdays}
                  className="px-4 py-2 bg-primary-100 text-primary-700 rounded-md hover:bg-primary-200 transition-colors text-sm"
                >
                  Apply Monday to Weekdays
                </button>
              </div>
            </Card>

            {/* Hours Form */}
            <Card padding="lg" variant="shadow">
              <div className="space-y-6">
                {days.map(day => {
                  const isClosed = settings[`${day}_closed` as keyof RestaurantSettings];
                  const openTime = settings[`${day}_open` as keyof RestaurantSettings] || '17:00';
                  const closeTime = settings[`${day}_close` as keyof RestaurantSettings] || '23:00';

                  return (
                    <div key={day} className="border-b border-neutral-200 pb-4 last:border-0">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-neutral-900">
                            {dayLabels[day as keyof typeof dayLabels]}
                          </h3>
                        </div>

                        <div className="flex items-center gap-4">
                          {!isClosed && (
                            <>
                              <div className="flex items-center gap-2">
                                <label className="text-sm text-neutral-600">Open:</label>
                                <input
                                  type="time"
                                  value={openTime as string}
                                  onChange={(e) => handleTimeChange(day, 'open', e.target.value)}
                                  className="px-3 py-1 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                              </div>

                              <div className="flex items-center gap-2">
                                <label className="text-sm text-neutral-600">Close:</label>
                                <input
                                  type="time"
                                  value={closeTime as string}
                                  onChange={(e) => handleTimeChange(day, 'close', e.target.value)}
                                  className="px-3 py-1 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                              </div>
                            </>
                          )}

                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id={`${day}_closed`}
                              checked={!!isClosed}
                              onChange={() => handleClosedToggle(day)}
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                            />
                            <label htmlFor={`${day}_closed`} className="text-sm text-neutral-600">
                              Closed
                            </label>
                          </div>

                          {day !== 'monday' && (
                            <button
                              onClick={() => copyHours('monday', day)}
                              className="text-sm text-primary-600 hover:text-primary-700"
                              title="Copy from Monday"
                            >
                              Copy Mon
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-neutral-200">
                <button
                  onClick={handleReset}
                  disabled={!hasChanges || saving}
                  className="px-4 py-2 text-neutral-600 hover:text-neutral-900 transition-colors disabled:opacity-50"
                >
                  Reset
                </button>
                <Button
                  onClick={handleSave}
                  variant="primary"
                  disabled={!hasChanges || saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>

              {hasChanges && (
                <div className="mt-4 text-sm text-amber-600 text-center">
                  You have unsaved changes
                </div>
              )}
            </Card>

            {/* Preview */}
            <Card padding="lg" variant="bordered" className="mt-6">
              <h3 className="text-lg font-medium text-neutral-900 mb-4">Preview</h3>
              <div className="space-y-2">
                {days.map(day => {
                  const isClosed = settings[`${day}_closed` as keyof RestaurantSettings];
                  const openTime = settings[`${day}_open` as keyof RestaurantSettings] || '17:00';
                  const closeTime = settings[`${day}_close` as keyof RestaurantSettings] || '23:00';
                  
                  const formatTime = (time: string) => {
                    const [hours, minutes] = time.split(':');
                    const hour = parseInt(hours || '0', 10);
                    const ampm = hour >= 12 ? 'PM' : 'AM';
                    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
                    return `${displayHour}:${minutes} ${ampm}`;
                  };

                  return (
                    <div key={day} className="flex justify-between text-sm">
                      <span className="font-medium text-neutral-700">
                        {dayLabels[day as keyof typeof dayLabels]}:
                      </span>
                      <span className="text-neutral-600">
                        {isClosed ? 'Closed' : `${formatTime(openTime as string)} - ${formatTime(closeTime as string)}`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </Container>
      </Section>
    </main>
  );
}