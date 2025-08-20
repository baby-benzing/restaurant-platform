import { 
  OperatingHours, 
  ContactInfo,
  type HoursData,
  type ContactData 
} from '@restaurant-platform/web-common';

interface RestaurantInfoProps {
  hours: HoursData[];
  contacts: ContactData[];
}

export default function RestaurantInfo({ hours, contacts }: RestaurantInfoProps) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">
          Hours of Operation
        </h3>
        <OperatingHours 
          hours={hours} 
          showToday 
          groupSimilar 
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">
          Contact Us
        </h3>
        <ContactInfo 
          contacts={contacts} 
          showIcons 
        />
      </div>
    </div>
  );
}