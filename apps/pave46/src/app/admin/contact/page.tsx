'use client';

import { useState, useEffect } from 'react';
import { Container, Section, Card, Button } from '@restaurant-platform/web-common';
import Link from 'next/link';
import { SettingsService, RestaurantSettings } from '@/services/settings.service';
import { getEditableFields, getFieldConfig } from '@/config/editable-fields.config';

export default function ContactManagementPage() {
  const [settings, setSettings] = useState<Partial<RestaurantSettings>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = ['general', 'contact', 'social'];

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const service = new SettingsService();
      const [generalSettings, contactSettings, socialSettings] = await Promise.all([
        service.getSettingsByCategory('general'),
        service.getSettingsByCategory('contact'),
        service.getSettingsByCategory('social'),
      ]);
      
      setSettings({
        ...generalSettings,
        ...contactSettings,
        ...socialSettings,
      });
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateField = (fieldId: string, value: any): string | null => {
    const config = getFieldConfig(fieldId);
    if (!config) return null;

    if (config.required && !value) {
      return `${config.label} is required`;
    }

    if (value && config.validation) {
      const { pattern, minLength, maxLength } = config.validation;

      if (pattern && typeof value === 'string' && !pattern.test(value)) {
        return `Invalid format for ${config.label}`;
      }

      if (minLength && typeof value === 'string' && value.length < minLength) {
        return `${config.label} must be at least ${minLength} characters`;
      }

      if (maxLength && typeof value === 'string' && value.length > maxLength) {
        return `${config.label} must be no more than ${maxLength} characters`;
      }
    }

    return null;
  };

  const handleFieldChange = (fieldId: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [fieldId]: value,
    }));
    
    // Validate field
    const error = validateField(fieldId, value);
    setErrors(prev => {
      const newErrors = { ...prev };
      if (error) {
        newErrors[fieldId] = error;
      } else {
        delete newErrors[fieldId];
      }
      return newErrors;
    });
    
    setHasChanges(true);
  };

  const handleSave = async () => {
    // Validate all fields
    const newErrors: Record<string, string> = {};
    for (const category of categories) {
      const fields = getEditableFields(category);
      for (const field of fields) {
        const value = settings[field.id as keyof RestaurantSettings];
        const error = validateField(field.id, value);
        if (error) {
          newErrors[field.id] = error;
        }
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      alert('Please fix the errors before saving');
      return;
    }

    setSaving(true);
    try {
      const service = new SettingsService();
      await service.updateSettings(settings);
      setHasChanges(false);
      alert('Settings updated successfully!');
    } catch (error: any) {
      alert(error.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    loadSettings();
    setHasChanges(false);
    setErrors({});
  };

  const renderField = (fieldId: string) => {
    const config = getFieldConfig(fieldId);
    if (!config || !config.editable) return null;

    const value = settings[fieldId as keyof RestaurantSettings] || '';
    const error = errors[fieldId];

    switch (config.type) {
      case 'textarea':
        return (
          <div key={fieldId} className="mb-4">
            <label htmlFor={fieldId} className="block text-sm font-medium text-neutral-700 mb-1">
              {config.label} {config.required && '*'}
            </label>
            <textarea
              id={fieldId}
              value={value as string}
              onChange={(e) => handleFieldChange(fieldId, e.target.value)}
              placeholder={config.placeholder}
              rows={3}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                error ? 'border-red-500' : 'border-neutral-300'
              }`}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>
        );

      case 'select':
        return (
          <div key={fieldId} className="mb-4">
            <label htmlFor={fieldId} className="block text-sm font-medium text-neutral-700 mb-1">
              {config.label} {config.required && '*'}
            </label>
            <select
              id={fieldId}
              value={value as string}
              onChange={(e) => handleFieldChange(fieldId, e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                error ? 'border-red-500' : 'border-neutral-300'
              }`}
            >
              {config.options?.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>
        );

      default:
        return (
          <div key={fieldId} className="mb-4">
            <label htmlFor={fieldId} className="block text-sm font-medium text-neutral-700 mb-1">
              {config.label} {config.required && '*'}
            </label>
            <input
              type={config.type}
              id={fieldId}
              value={value as string}
              onChange={(e) => handleFieldChange(fieldId, e.target.value)}
              placeholder={config.placeholder}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                error ? 'border-red-500' : 'border-neutral-300'
              }`}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>
        );
    }
  };

  if (loading) {
    return (
      <main>
        <Section spacing="lg" className="pt-24">
          <Container>
            <div className="flex justify-center items-center h-64">
              <div className="text-neutral-500">Loading settings...</div>
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
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-serif font-bold text-neutral-900">
                  Contact & Information
                </h1>
                <p className="text-neutral-600 mt-2">
                  Manage your restaurant information and contact details
                </p>
              </div>
              <Link
                href="/admin/dashboard"
                className="px-4 py-2 text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                Back to Dashboard
              </Link>
            </div>

            {/* General Information */}
            <Card padding="lg" variant="shadow" className="mb-6">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">General Information</h2>
              <div className="space-y-4">
                {getEditableFields('general').map(field => renderField(field.id))}
              </div>
            </Card>

            {/* Contact Information */}
            <Card padding="lg" variant="shadow" className="mb-6">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getEditableFields('contact').map(field => renderField(field.id))}
              </div>
            </Card>

            {/* Social Media */}
            <Card padding="lg" variant="shadow" className="mb-6">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">Social Media</h2>
              <div className="space-y-4">
                {getEditableFields('social').map(field => renderField(field.id))}
              </div>
            </Card>

            {/* Actions */}
            <div className="flex justify-end gap-4 mt-8">
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
                disabled={!hasChanges || saving || Object.keys(errors).length > 0}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>

            {hasChanges && (
              <div className="mt-4 text-sm text-amber-600 text-center">
                You have unsaved changes
              </div>
            )}
          </div>
        </Container>
      </Section>
    </main>
  );
}