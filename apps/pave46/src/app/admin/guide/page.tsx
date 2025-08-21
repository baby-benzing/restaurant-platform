'use client';

import { useState } from 'react';
import { 
  BookOpen, 
  Phone, 
  Image, 
  Clock, 
  Mail, 
  MapPin, 
  ChefHat,
  Settings,
  HelpCircle,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function AdminGuidePage() {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', label: 'Overview', icon: BookOpen },
    { id: 'menu', label: 'Menu Management', icon: ChefHat },
    { id: 'contact', label: 'Contact Info', icon: Phone },
    { id: 'images', label: 'Images & Media', icon: Image },
    { id: 'hours', label: 'Business Hours', icon: Clock },
    { id: 'settings', label: 'General Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Guide & Documentation
          </h1>
          <p className="text-gray-600">
            Everything you need to know about managing your restaurant website
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-4">
              <nav className="space-y-1">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        activeSection === section.id
                          ? 'bg-blue-50 text-blue-600 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {section.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            {activeSection === 'overview' && <OverviewGuide />}
            {activeSection === 'menu' && <MenuGuide />}
            {activeSection === 'contact' && <ContactGuide />}
            {activeSection === 'images' && <ImagesGuide />}
            {activeSection === 'hours' && <HoursGuide />}
            {activeSection === 'settings' && <SettingsGuide />}
          </div>
        </div>
      </div>
    </div>
  );
}

function OverviewGuide() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Welcome to Your Admin Dashboard
      </h2>
      
      <div className="prose max-w-none">
        <p className="text-gray-600 mb-6">
          This guide will help you manage all aspects of your restaurant website efficiently. 
          Each section is designed to be simple and intuitive.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <QuickStartCard
            title="Quick Actions"
            items={[
              'Update menu items and prices',
              'Change business hours',
              'Upload new photos',
              'Edit contact information',
            ]}
          />
          <QuickStartCard
            title="Most Common Tasks"
            items={[
              'Add daily specials to menu',
              'Update holiday hours',
              'Change phone number',
              'Upload new dish photos',
            ]}
          />
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <HelpCircle className="w-5 h-5" />
            Getting Started Tips
          </h3>
          <ul className="space-y-2 text-blue-800">
            <li>• All changes are saved automatically</li>
            <li>• Use the preview button to see changes before publishing</li>
            <li>• Keep menu descriptions short and appetizing</li>
            <li>• Upload high-quality images (at least 1200px wide)</li>
            <li>• Update hours immediately for holidays or special events</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function MenuGuide() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Menu Management Guide
      </h2>

      <div className="space-y-8">
        <GuideSection
          title="Adding a New Menu Item"
          steps={[
            'Click the "Add Item" button in the menu section',
            'Enter the item name (e.g., "Chocolate Croissant")',
            'Add a short, appetizing description',
            'Set the price (numbers only, system adds $ automatically)',
            'Select the category (Breakfast, Lunch, Pastries, etc.)',
            'Upload a photo (optional but recommended)',
            'Click "Save" - your item is now live!',
          ]}
          tips={[
            'Keep descriptions under 50 words',
            'Mention key ingredients or dietary info',
            'Use appetizing adjectives (fresh, crispy, creamy)',
            'Update prices immediately when costs change',
          ]}
        />

        <GuideSection
          title="Editing Existing Items"
          steps={[
            'Find the item in your menu list',
            'Click the pencil icon to edit',
            'Make your changes',
            'Click "Update" to save',
          ]}
          tips={[
            'Mark items as "Out of Stock" instead of deleting',
            'Use the "Featured" toggle for daily specials',
            'Batch edit similar items for efficiency',
          ]}
        />

        <GuideSection
          title="Organizing Your Menu"
          steps={[
            'Drag and drop items to reorder',
            'Create categories for better organization',
            'Use the sort options (price, alphabetical, popularity)',
            'Archive seasonal items instead of deleting',
          ]}
          tips={[
            'Group similar items together',
            'Put bestsellers at the top of each category',
            'Keep the total menu concise and focused',
          ]}
        />

        <ExampleBox title="Good Menu Description Example">
          <div className="bg-gray-50 p-4 rounded">
            <p className="font-semibold">Almond Croissant</p>
            <p className="text-gray-600 text-sm mt-1">
              Buttery croissant filled with sweet almond cream, topped with sliced almonds and powdered sugar. 
              Made fresh daily.
            </p>
            <p className="text-green-600 text-sm mt-2">✓ Mentions key ingredients</p>
            <p className="text-green-600 text-sm">✓ Appetizing description</p>
            <p className="text-green-600 text-sm">✓ Highlights freshness</p>
          </div>
        </ExampleBox>
      </div>
    </div>
  );
}

function ContactGuide() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Contact Information Guide
      </h2>

      <div className="space-y-8">
        <GuideSection
          title="Updating Contact Details"
          steps={[
            'Navigate to Settings → Contact Info',
            'Click on the field you want to update',
            'Enter the new information',
            'Changes save automatically',
          ]}
          tips={[
            'Double-check phone numbers for accuracy',
            'Use a professional email address',
            'Include area code for phone numbers',
            'Update immediately if info changes',
          ]}
        />

        <div className="grid md:grid-cols-2 gap-6">
          <InfoCard
            icon={Phone}
            title="Phone Number"
            example="(646) 454-1387"
            notes="Include area code, format automatically applied"
          />
          <InfoCard
            icon={Mail}
            title="Email Address"
            example="info@pave.com"
            notes="Use a monitored email, responds within 24hrs"
          />
          <InfoCard
            icon={MapPin}
            title="Address"
            example="511 10th Avenue, New York, NY 10018"
            notes="Include street, city, state, and ZIP"
          />
          <InfoCard
            icon={Clock}
            title="Response Time"
            example="Within 24 hours"
            notes="Set realistic expectations for customers"
          />
        </div>

        <WarningBox>
          <p className="font-semibold">Important:</p>
          <p>Always verify contact information after updating. Incorrect contact details can result in lost business!</p>
        </WarningBox>
      </div>
    </div>
  );
}

function ImagesGuide() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Images & Media Guide
      </h2>

      <div className="space-y-8">
        <GuideSection
          title="Uploading Images"
          steps={[
            'Click "Upload Images" button',
            'Select images from your computer (multiple allowed)',
            'Wait for upload to complete',
            'Add alt text for accessibility',
            'Choose where to display the image',
            'Click "Save" to publish',
          ]}
          tips={[
            'Use high-resolution images (min 1200px wide)',
            'Keep file sizes under 5MB',
            'Use JPEG for photos, PNG for logos',
            'Name files descriptively before uploading',
          ]}
        />

        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Image Requirements</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="font-medium text-gray-700 mb-2">Homepage Slideshow</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Size: 1920x1080px recommended</li>
                <li>• Format: JPEG</li>
                <li>• Max file size: 3MB</li>
                <li>• Landscape orientation</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-gray-700 mb-2">Menu Items</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Size: 800x800px minimum</li>
                <li>• Format: JPEG or PNG</li>
                <li>• Max file size: 2MB</li>
                <li>• Square format preferred</li>
              </ul>
            </div>
          </div>
        </div>

        <GuideSection
          title="Image Best Practices"
          steps={[
            'Take photos in natural light when possible',
            'Show the actual product (not stock photos)',
            'Keep backgrounds clean and uncluttered',
            'Update seasonally for freshness',
            'Compress images before uploading',
          ]}
          tips={[
            'Hire a professional photographer annually',
            'Maintain consistent style across all images',
            'Show portion sizes accurately',
            'Include people for lifestyle shots',
          ]}
        />

        <ExampleBox title="Good vs Bad Images">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="text-center">
              <div className="bg-green-50 p-4 rounded">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="font-medium text-green-900">Good</p>
                <ul className="text-sm text-green-700 mt-2 text-left">
                  <li>• Well-lit</li>
                  <li>• Sharp focus</li>
                  <li>• Appetizing presentation</li>
                  <li>• Clean background</li>
                </ul>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-red-50 p-4 rounded">
                <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <p className="font-medium text-red-900">Avoid</p>
                <ul className="text-sm text-red-700 mt-2 text-left">
                  <li>• Dark/underexposed</li>
                  <li>• Blurry</li>
                  <li>• Messy presentation</li>
                  <li>• Cluttered background</li>
                </ul>
              </div>
            </div>
          </div>
        </ExampleBox>
      </div>
    </div>
  );
}

function HoursGuide() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Business Hours Guide
      </h2>

      <div className="space-y-8">
        <GuideSection
          title="Setting Regular Hours"
          steps={[
            'Go to Settings → Business Hours',
            'Click on the day you want to edit',
            'Set opening time using the time picker',
            'Set closing time',
            'Toggle "Closed" if not open that day',
            'Click "Save Hours"',
          ]}
          tips={[
            'Use 24-hour format for clarity',
            'Set hours for entire week at once',
            'Include prep/closing buffer time',
            'Update immediately for accuracy',
          ]}
        />

        <GuideSection
          title="Holiday & Special Hours"
          steps={[
            'Click "Add Special Hours"',
            'Select the date',
            'Enter special hours or mark as closed',
            'Add a note (e.g., "Christmas Day")',
            'Save the exception',
          ]}
          tips={[
            'Plan holiday hours in advance',
            'Notify customers 1 week before changes',
            'Remove expired special hours',
            'Consider local events and festivals',
          ]}
        />

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="font-semibold text-yellow-900 mb-3">
            Quick Hour Templates
          </h3>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-2 bg-white rounded border hover:bg-gray-50">
              <p className="font-medium">Standard Restaurant</p>
              <p className="text-sm text-gray-600">Mon-Thu: 11am-10pm, Fri-Sat: 11am-11pm, Sun: 10am-9pm</p>
            </button>
            <button className="w-full text-left px-4 py-2 bg-white rounded border hover:bg-gray-50">
              <p className="font-medium">Café Hours</p>
              <p className="text-sm text-gray-600">Mon-Fri: 7am-7pm, Sat-Sun: 8am-6pm</p>
            </button>
            <button className="w-full text-left px-4 py-2 bg-white rounded border hover:bg-gray-50">
              <p className="font-medium">Bakery Hours</p>
              <p className="text-sm text-gray-600">Tue-Fri: 7am-6pm, Sat: 8am-4pm, Sun: 9am-3pm, Mon: Closed</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsGuide() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        General Settings Guide
      </h2>

      <div className="space-y-8">
        <GuideSection
          title="Basic Information"
          steps={[
            'Navigate to Settings → General',
            'Update restaurant name if needed',
            'Edit description (shows on Google)',
            'Add/update social media links',
            'Save all changes',
          ]}
          tips={[
            'Keep descriptions SEO-friendly',
            'Include keywords customers search for',
            'Verify all links work correctly',
            'Update seasonally for relevance',
          ]}
        />

        <div className="grid md:grid-cols-2 gap-6">
          <ChecklistCard
            title="Weekly Maintenance"
            items={[
              { label: 'Review and update menu items', checked: false },
              { label: 'Check for out-of-stock items', checked: false },
              { label: 'Update special hours if needed', checked: false },
              { label: 'Upload new photos', checked: false },
              { label: 'Respond to customer inquiries', checked: false },
            ]}
          />
          <ChecklistCard
            title="Monthly Tasks"
            items={[
              { label: 'Review all contact information', checked: false },
              { label: 'Update seasonal menu items', checked: false },
              { label: 'Refresh homepage images', checked: false },
              { label: 'Review and update descriptions', checked: false },
              { label: 'Check all links and forms', checked: false },
            ]}
          />
        </div>

        <WarningBox>
          <p className="font-semibold">Remember:</p>
          <p>Always preview changes before publishing. Your website is often the first impression customers have of your restaurant!</p>
        </WarningBox>
      </div>
    </div>
  );
}

// Helper Components
function QuickStartCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h3 className="font-semibold text-gray-900 mb-3">{title}</h3>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-2 text-gray-600">
            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span className="text-sm">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function GuideSection({ title, steps, tips }: { title: string; steps: string[]; tips: string[] }) {
  return (
    <div className="border-l-4 border-blue-500 pl-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">{title}</h3>
      
      <div className="mb-6">
        <p className="font-medium text-gray-700 mb-3">Steps:</p>
        <ol className="space-y-2">
          {steps.map((step, index) => (
            <li key={index} className="flex gap-3 text-gray-600">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                {index + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="bg-blue-50 rounded-lg p-4">
        <p className="font-medium text-blue-900 mb-2">💡 Pro Tips:</p>
        <ul className="space-y-1">
          {tips.map((tip, index) => (
            <li key={index} className="text-sm text-blue-800">• {tip}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function InfoCard({ icon: Icon, title, example, notes }: any) {
  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <div className="flex items-start gap-4">
        <Icon className="w-6 h-6 text-blue-600 flex-shrink-0" />
        <div>
          <p className="font-semibold text-gray-900">{title}</p>
          <p className="text-gray-700 mt-1">Example: {example}</p>
          <p className="text-sm text-gray-500 mt-2">{notes}</p>
        </div>
      </div>
    </div>
  );
}

function ExampleBox({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-gray-200 rounded-lg p-6">
      <h4 className="font-semibold text-gray-900 mb-4">{title}</h4>
      {children}
    </div>
  );
}

function WarningBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
      <div className="flex gap-3">
        <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
        <div className="text-yellow-800">{children}</div>
      </div>
    </div>
  );
}

function ChecklistCard({ title, items }: { title: string; items: { label: string; checked: boolean }[] }) {
  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h3 className="font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-3">
        {items.map((item, index) => (
          <label key={index} className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              defaultChecked={item.checked}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-gray-700">{item.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}