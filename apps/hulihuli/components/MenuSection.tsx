'use client';

export default function MenuSection({ menu }: any) {
  if (!menu) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-amber-50">
      <div className="pt-12 pb-24 px-4">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-center mb-12">Menu</h1>

        <div className="max-w-4xl mx-auto space-y-12">
          {menu.sections?.map((section: any) => (
            <div key={section.name} className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6">{section.name}</h2>
              <div className="space-y-4">
                {section.items?.map((item: any) => (
                  <div key={item.name} className="flex justify-between pb-4 border-b last:border-0">
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      {item.description && <p className="text-sm text-gray-600 mt-1">{item.description}</p>}
                    </div>
                    {item.price && (
                      <span className="font-bold text-amber-700 ml-4">${item.price.toFixed(2)}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
