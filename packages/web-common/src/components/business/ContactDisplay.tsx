import React from 'react';
import { cn } from '../../utils/cn';

export interface ContactData {
  address?: {
    street: string;
    street2?: string;
    city: string;
    state: string;
    zip: string;
    country?: string;
  };
  phone?: string;
  email?: string;
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    tiktok?: string;
    yelp?: string;
  };
  reservations?: {
    provider?: string;
    url?: string;
    phone?: string;
  };
}

export interface ContactDisplayProps extends React.HTMLAttributes<HTMLDivElement> {
  data: ContactData;
  variant?: 'default' | 'compact' | 'detailed' | 'footer';
  showAddress?: boolean;
  showPhone?: boolean;
  showEmail?: boolean;
  showSocial?: boolean;
  showReservations?: boolean;
  showMap?: boolean;
  mapUrl?: string;
  addressClassName?: string;
  phoneClassName?: string;
  emailClassName?: string;
  socialClassName?: string;
}

const SocialIcon: React.FC<{ platform: string; url: string; className?: string }> = ({ 
  platform, 
  url, 
  className 
}) => {
  const icons: Record<string, string> = {
    instagram: 'Instagram',
    facebook: 'Facebook',
    twitter: 'Twitter',
    tiktok: 'TikTok',
    yelp: 'Yelp',
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors',
        className
      )}
      aria-label={icons[platform] || platform}
    >
      <span className="text-xs font-medium">{icons[platform]?.[0] || '?'}</span>
    </a>
  );
};

export const ContactDisplay = React.forwardRef<HTMLDivElement, ContactDisplayProps>(
  ({
    data,
    variant = 'default',
    showAddress = true,
    showPhone = true,
    showEmail = true,
    showSocial = true,
    showReservations = true,
    showMap = false,
    mapUrl,
    addressClassName,
    phoneClassName,
    emailClassName,
    socialClassName,
    className,
    ...props
  }, ref) => {
    // Handle undefined or null data
    if (!data) {
      return (
        <div ref={ref} className={cn('contact-display', className)} {...props}>
          <p className="text-gray-500">Contact information not available</p>
        </div>
      );
    }

    const { address, phone, email, socialMedia, reservations } = data;

    const formatPhone = (phoneNumber: string) => {
      const cleaned = phoneNumber.replace(/\D/g, '');
      if (cleaned.length === 10) {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
      }
      return phoneNumber;
    };

    const isCompact = variant === 'compact';
    const isFooter = variant === 'footer';
    const isDetailed = variant === 'detailed';

    return (
      <div
        ref={ref}
        className={cn(
          'contact-display',
          {
            'space-y-4': variant === 'default' || isDetailed,
            'space-y-2': isCompact,
            'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6': isFooter,
          },
          className
        )}
        {...props}
      >
        {showAddress && address && (
          <div className={cn('contact-address', addressClassName)}>
            {!isCompact && <h4 className="font-semibold mb-2">Address</h4>}
            <address className="not-italic">
              <p>{address.street}</p>
              {address.street2 && <p>{address.street2}</p>}
              <p>{address.city}, {address.state} {address.zip}</p>
              {address.country && <p>{address.country}</p>}
            </address>
            {showMap && mapUrl && (
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 text-sm text-blue-600 hover:underline"
              >
                View on Map →
              </a>
            )}
          </div>
        )}

        {(showPhone || showEmail) && (phone || email) && (
          <div className={cn('contact-info', { 'space-y-2': !isCompact })}>
            {!isCompact && <h4 className="font-semibold mb-2">Contact</h4>}
            {showPhone && phone && (
              <div className={phoneClassName}>
                <a
                  href={`tel:${phone.replace(/\D/g, '')}`}
                  className="text-blue-600 hover:underline"
                >
                  {formatPhone(phone)}
                </a>
              </div>
            )}
            {showEmail && email && (
              <div className={emailClassName}>
                <a
                  href={`mailto:${email}`}
                  className="text-blue-600 hover:underline"
                >
                  {email}
                </a>
              </div>
            )}
          </div>
        )}

        {showReservations && reservations && (reservations.url || reservations.phone) && (
          <div className="contact-reservations">
            {!isCompact && <h4 className="font-semibold mb-2">Reservations</h4>}
            {reservations.url && (
              <a
                href={reservations.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
              >
                {reservations.provider ? `Reserve on ${reservations.provider}` : 'Make a Reservation'}
              </a>
            )}
            {reservations.phone && (
              <p className="mt-2">
                Or call: <a href={`tel:${reservations.phone.replace(/\D/g, '')}`} className="text-blue-600 hover:underline">
                  {formatPhone(reservations.phone)}
                </a>
              </p>
            )}
          </div>
        )}

        {showSocial && socialMedia && Object.keys(socialMedia).length > 0 && (
          <div className={cn('contact-social', socialClassName)}>
            {!isCompact && <h4 className="font-semibold mb-2">Follow Us</h4>}
            <div className="flex gap-2">
              {Object.entries(socialMedia).map(([platform, url]) => (
                url && <SocialIcon key={platform} platform={platform} url={url} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
);

ContactDisplay.displayName = 'ContactDisplay';

export default ContactDisplay;