import React from 'react';
import { cn } from '../../utils/cn';
import { formatPhoneNumber } from '../../utils/formatters';

export interface ContactData {
  type: 'phone' | 'email' | 'address' | 'social' | 'website';
  label?: string;
  value: string;
}

export interface ContactInfoProps extends React.HTMLAttributes<HTMLDivElement> {
  contacts: ContactData[];
  title?: string;
  showIcons?: boolean;
}

const ContactIcon: React.FC<{ type: ContactData['type'] }> = ({ type }) => {
  const icons = {
    phone: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" 
        />
      </svg>
    ),
    email: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
        />
      </svg>
    ),
    address: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
        />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
        />
      </svg>
    ),
    social: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
          d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" 
        />
      </svg>
    ),
    website: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
        />
      </svg>
    ),
  };

  return icons[type] || null;
};

export const ContactInfo = React.forwardRef<HTMLDivElement, ContactInfoProps>(
  ({ 
    contacts, 
    title,
    showIcons = true,
    className, 
    ...props 
  }, ref) => {
    if (contacts.length === 0) {
      return (
        <div ref={ref} className={cn('text-neutral-500 italic', className)} {...props}>
          Contact information not available
        </div>
      );
    }

    const formatValue = (contact: ContactData) => {
      if (contact.type === 'phone') {
        return formatPhoneNumber(contact.value);
      }
      return contact.value;
    };

    const renderContact = (contact: ContactData, index: number) => {
      const isClickable = contact.type === 'phone' || contact.type === 'email' || contact.type === 'website';
      const href = contact.type === 'phone' 
        ? `tel:${contact.value.replace(/\D/g, '')}`
        : contact.type === 'email'
        ? `mailto:${contact.value}`
        : contact.type === 'website'
        ? contact.value
        : undefined;

      const content = (
        <>
          {showIcons && (
            <span className="text-neutral-400">
              <ContactIcon type={contact.type} />
            </span>
          )}
          <div className="flex-1">
            {contact.label && (
              <span className="block text-sm text-neutral-500">{contact.label}</span>
            )}
            <span className="text-neutral-900">{formatValue(contact)}</span>
          </div>
        </>
      );

      if (isClickable && href) {
        return (
          <a
            key={index}
            href={href}
            className="flex items-start gap-3 py-2 text-neutral-900 hover:text-primary-600 transition-colors"
            target={contact.type === 'website' ? '_blank' : undefined}
            rel={contact.type === 'website' ? 'noopener noreferrer' : undefined}
          >
            {content}
          </a>
        );
      }

      return (
        <div key={index} className="flex items-start gap-3 py-2">
          {content}
        </div>
      );
    };

    return (
      <div ref={ref} className={cn('space-y-1', className)} {...props}>
        {title && (
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">
            {title}
          </h3>
        )}
        {contacts.map((contact, index) => renderContact(contact, index))}
      </div>
    );
  }
);

ContactInfo.displayName = 'ContactInfo';