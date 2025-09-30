import ListingForm from "@/components/test/listing-form";

export const dynamic = "force-dynamic";

export default function TestTransformPage() {
  return (
    <div className="container mx-auto p-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-4">
          Testing ca101directory-logo.png with Transparency
        </h1>

        {/* Test the logo with transparency on different backgrounds */}
        <div className="space-y-8">
          {/* White Background */}
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              White Background
            </h2>
            <div className="flex flex-wrap gap-6 items-center justify-center">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Small (100x50)</p>
                <img
                  src="/ca101directory-logo.png"
                  alt="CA101 Directory Logo"
                  width={100}
                  height={50}
                  className="mx-auto"
                />
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Medium (200x100)</p>
                <img
                  src="/ca101directory-logo.png"
                  alt="CA101 Directory Logo"
                  width={200}
                  height={100}
                  className="mx-auto"
                />
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Large (400x200)</p>
                <img
                  src="/ca101directory-logo.png"
                  alt="CA101 Directory Logo"
                  width={400}
                  height={200}
                  className="mx-auto"
                />
              </div>
            </div>
          </div>

          {/* Dark Background */}
          <div className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-white">
              Dark Background
            </h2>
            <div className="flex flex-wrap gap-6 items-center justify-center">
              <div className="text-center">
                <p className="text-sm text-gray-300 mb-2">Small (100x50)</p>
                <img
                  src="/ca101directory-logo.png"
                  alt="CA101 Directory Logo"
                  width={100}
                  height={50}
                  className="mx-auto"
                />
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-300 mb-2">Medium (200x100)</p>
                <img
                  src="/ca101directory-logo.png"
                  alt="CA101 Directory Logo"
                  width={200}
                  height={100}
                  className="mx-auto"
                />
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-300 mb-2">Large (400x200)</p>
                <img
                  src="/ca101directory-logo.png"
                  alt="CA101 Directory Logo"
                  width={400}
                  height={200}
                  className="mx-auto"
                />
              </div>
            </div>
          </div>

          {/* Brand Blue Background */}
          <div className="bg-blue-600 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-white">
              Brand Blue Background
            </h2>
            <div className="flex flex-wrap gap-6 items-center justify-center">
              <div className="text-center">
                <p className="text-sm text-blue-100 mb-2">Small (100x50)</p>
                <img
                  src="/ca101directory-logo.png"
                  alt="CA101 Directory Logo"
                  width={100}
                  height={50}
                  className="mx-auto"
                />
              </div>
              <div className="text-center">
                <p className="text-sm text-blue-100 mb-2">Medium (200x100)</p>
                <img
                  src="/ca101directory-logo.png"
                  alt="CA101 Directory Logo"
                  width={200}
                  height={100}
                  className="mx-auto"
                />
              </div>
              <div className="text-center">
                <p className="text-sm text-blue-100 mb-2">Large (400x200)</p>
                <img
                  src="/ca101directory-logo.png"
                  alt="CA101 Directory Logo"
                  width={400}
                  height={200}
                  className="mx-auto"
                />
              </div>
            </div>
          </div>

          {/* Orange Background */}
          <div className="bg-orange-500 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-white">
              Orange Background
            </h2>
            <div className="flex flex-wrap gap-6 items-center justify-center">
              <div className="text-center">
                <p className="text-sm text-orange-100 mb-2">Small (100x50)</p>
                <img
                  src="/ca101directory-logo.png"
                  alt="CA101 Directory Logo"
                  width={100}
                  height={50}
                  className="mx-auto"
                />
              </div>
              <div className="text-center">
                <p className="text-sm text-orange-100 mb-2">Medium (200x100)</p>
                <img
                  src="/ca101directory-logo.png"
                  alt="CA101 Directory Logo"
                  width={200}
                  height={100}
                  className="mx-auto"
                />
              </div>
              <div className="text-center">
                <p className="text-sm text-orange-100 mb-2">Large (400x200)</p>
                <img
                  src="/ca101directory-logo.png"
                  alt="CA101 Directory Logo"
                  width={400}
                  height={200}
                  className="mx-auto"
                />
              </div>
            </div>
          </div>

          {/* Gradient Background */}
          <div className="bg-gradient-to-r from-blue-600 to-orange-500 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-white">
              Gradient Background
            </h2>
            <div className="flex flex-wrap gap-6 items-center justify-center">
              <div className="text-center">
                <p className="text-sm text-white/80 mb-2">Small (100x50)</p>
                <img
                  src="/ca101directory-logo.png"
                  alt="CA101 Directory Logo"
                  width={100}
                  height={50}
                  className="mx-auto"
                />
              </div>
              <div className="text-center">
                <p className="text-sm text-white/80 mb-2">Medium (200x100)</p>
                <img
                  src="/ca101directory-logo.png"
                  alt="CA101 Directory Logo"
                  width={200}
                  height={100}
                  className="mx-auto"
                />
              </div>
              <div className="text-center">
                <p className="text-sm text-white/80 mb-2">Large (400x200)</p>
                <img
                  src="/ca101directory-logo.png"
                  alt="CA101 Directory Logo"
                  width={400}
                  height={200}
                  className="mx-auto"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 p-4 bg-gray-100 rounded">
          <p className="text-sm text-gray-600">
            This shows how the logo looks with transparency on different
            backgrounds:
          </p>
          <ul className="text-sm text-gray-600 mt-2 text-left max-w-md mx-auto">
            <li>• White background - good for light themes</li>
            <li>• Dark background - good for dark themes</li>
            <li>• Brand blue - matches your color scheme</li>
            <li>• Orange - matches your accent color</li>
            <li>• Gradient - shows versatility</li>
          </ul>
        </div>
      </div>

      <div className="border-t pt-8">
        <h2 className="text-2xl font-bold mb-4">Original Listing Form</h2>
        <ListingForm />
      </div>
    </div>
  );
}
