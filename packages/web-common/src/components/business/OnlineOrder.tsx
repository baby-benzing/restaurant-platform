import React from 'react';
import { cn } from '../../utils/cn';

export interface OrderProvider {
  name: string;
  url: string;
  type: 'pickup' | 'delivery' | 'both';
  logo?: string;
  description?: string;
}

export interface OnlineOrderProps extends React.HTMLAttributes<HTMLDivElement> {
  providers: OrderProvider[];
  variant?: 'default' | 'compact' | 'cards' | 'inline';
  showLogos?: boolean;
  primaryProvider?: string;
  title?: string;
  description?: string;
  reservationUrl?: string;
  reservationProvider?: string;
}

const ProviderButton: React.FC<{
  provider: OrderProvider;
  variant: OnlineOrderProps['variant'];
  isPrimary?: boolean;
  showLogo?: boolean;
  className?: string;
}> = ({ provider, variant, isPrimary, showLogo, className }) => {
  const buttonContent = (
    <>
      {showLogo && provider.logo && (
        <img 
          src={provider.logo} 
          alt={provider.name} 
          className="h-6 w-auto"
        />
      )}
      <span className={cn({ 'ml-2': showLogo && provider.logo })}>
        {provider.type === 'both' ? 'Order' : provider.type === 'pickup' ? 'Pick Up' : 'Delivery'}
        {variant !== 'compact' && ` on ${provider.name}`}
      </span>
    </>
  );

  const baseClasses = cn(
    'inline-flex items-center justify-center transition-all duration-200',
    {
      'px-6 py-3 rounded-lg font-medium': variant === 'default' || variant === 'cards',
      'px-4 py-2 rounded text-sm': variant === 'compact',
      'px-3 py-1 rounded text-sm': variant === 'inline',
      'bg-primary-600 text-white hover:bg-primary-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5': isPrimary,
      'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50': !isPrimary && variant !== 'cards',
      'bg-white shadow-md hover:shadow-lg': !isPrimary && variant === 'cards',
    },
    className
  );

  return (
    <a
      href={provider.url}
      target="_blank"
      rel="noopener noreferrer"
      className={baseClasses}
      aria-label={`Order ${provider.type === 'pickup' ? 'pickup' : 'delivery'} from ${provider.name}`}
    >
      {buttonContent}
    </a>
  );
};

export const OnlineOrder = React.forwardRef<HTMLDivElement, OnlineOrderProps>(
  ({
    providers,
    variant = 'default',
    showLogos = false,
    primaryProvider,
    title = 'Order Online',
    description,
    reservationUrl,
    reservationProvider = 'Resy',
    className,
    ...props
  }, ref) => {
    const safeProviders = providers || [];
    const primaryProviders = primaryProvider 
      ? safeProviders.filter(p => p.name === primaryProvider)
      : [];
    const otherProviders = primaryProvider
      ? safeProviders.filter(p => p.name !== primaryProvider)
      : safeProviders;

    if (variant === 'inline') {
      return (
        <div ref={ref} className={cn('inline-flex items-center gap-2', className)} {...props}>
          {safeProviders.map((provider) => (
            <ProviderButton
              key={provider.name}
              provider={provider}
              variant={variant}
              isPrimary={provider.name === primaryProvider}
              showLogo={showLogos}
            />
          ))}
          {reservationUrl && (
            <a
              href={reservationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 rounded text-sm bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              Reserve Table
            </a>
          )}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn('online-order', className)}
        {...props}
      >
        {(title || description) && (
          <div className="text-center mb-6">
            {title && (
              <h3 className="text-2xl font-bold mb-2">{title}</h3>
            )}
            {description && (
              <p className="text-gray-600">{description}</p>
            )}
          </div>
        )}

        {variant === 'cards' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {safeProviders.map((provider) => (
              <div
                key={provider.name}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-lg">{provider.name}</h4>
                  {provider.type === 'both' ? (
                    <span className="text-sm text-gray-500">Pickup & Delivery</span>
                  ) : (
                    <span className="text-sm text-gray-500 capitalize">{provider.type}</span>
                  )}
                </div>
                {provider.description && (
                  <p className="text-sm text-gray-600 mb-4">{provider.description}</p>
                )}
                <ProviderButton
                  provider={provider}
                  variant="default"
                  isPrimary={provider.name === primaryProvider}
                  showLogo={showLogos}
                  className="w-full"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className={cn({
            'space-y-4': variant === 'default',
            'flex flex-wrap gap-2': variant === 'compact',
          })}>
            {primaryProviders.length > 0 && (
              <div className={cn({
                'mb-4': variant === 'default',
              })}>
                {primaryProviders.map((provider) => (
                  <ProviderButton
                    key={provider.name}
                    provider={provider}
                    variant={variant}
                    isPrimary={true}
                    showLogo={showLogos}
                    className={cn({
                      'w-full sm:w-auto': variant === 'default',
                    })}
                  />
                ))}
              </div>
            )}

            {otherProviders.length > 0 && (
              <div className={cn({
                'flex flex-wrap gap-2': variant === 'default' || variant === 'compact',
              })}>
                {otherProviders.map((provider) => (
                  <ProviderButton
                    key={provider.name}
                    provider={provider}
                    variant={variant}
                    isPrimary={false}
                    showLogo={showLogos}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {reservationUrl && variant !== 'inline' && (
          <div className={cn('mt-6 pt-6 border-t', {
            'text-center': variant === 'default' || variant === 'cards',
          })}>
            <p className="text-sm text-gray-600 mb-3">Prefer to dine in?</p>
            <a
              href={reservationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium',
                'bg-gray-900 text-white hover:bg-gray-800 transition-colors'
              )}
            >
              Make a Reservation
              {reservationProvider && ` on ${reservationProvider}`}
            </a>
          </div>
        )}
      </div>
    );
  }
);

OnlineOrder.displayName = 'OnlineOrder';

export default OnlineOrder;