import { Plane } from 'lucide-react';


const DigitalBoardingPass = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
      <div className="relative w-full max-w-md rounded-3xl text-white shadow-xl bg-purple-950 h-[80vh]">
        {/* Left notch */}
        <div className="absolute -left-3 top-[30%] -translate-y-1/2 w-6 h-6 bg-gray-100 rounded-full" />
        
        {/* Right notch */}
        <div className="absolute -right-3 top-[30%] -translate-y-1/2 w-6 h-6 bg-gray-100 rounded-full" />

        {/* Perforated line */}
        <div className="absolute left-0 right-0 top-[30%] -translate-y-1/2 border-t border-dotted border-gray-300" />
        
        {/* Content */}
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-around mb-6 w-full">
            <div className="flex items-center">
              <div className="text-5xl font-parisienne">Save the Date</div>
            </div>
          </div>

          {/* Flight info */}
          <div className="flex justify-between items-center">
            <div>
              <div className="text-md font-parisienne">Nana</div>
              <div className="text-3xl font-parisienne">Nimako</div>
            </div>
            
            <div className="text-right">
              <div className="text-md font-parisienne">Wahab</div>
              <div className="text-4xl font-parisienne">Bandau</div>
            </div>
          </div>

          {/* Flight info */}
          <div className="flex justify-between items-center mt-8 mb-4">
            <div>
              <div className="text-sm">LOS ANGELES</div>
              <div className="text-4xl font-bold">LAX</div>
            </div>
            <Plane className="mr-6" />
            <div className="text-right">
              <div className="text-sm">ACCRA</div>
              <div className="text-4xl font-bold">ACC</div>
            </div>
          </div>

          {/* Details grid */}
          <div className="flex flex-row mb-8 space-x-4">
            <div>
              <div className="text-sm">SCHEDULED</div>
              <div className="text-xl font-bold grid-cols-3">3rd of Jan 2026</div>
            </div>
            
            <div>
              <div className="text-sm">SEAT</div>
              <div className="text-xl font-bold">1A</div>
            </div>
            <div>
              <div className="text-sm">GROUP</div>
              <div className="text-xl font-bold">A</div>
            </div>
          </div>

          {/* Passenger name */}
          <div className="mb-8">
            <div className="text-sm">PASSENGER</div>
            <div className="text-2xl font-bold">LIZ CHETELAT</div>
          </div>

          {/* QR Code placeholder */}
          {/* <div className="flex justify-center">
            <div className="w-48 h-48 bg-white rounded-lg" />
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default DigitalBoardingPass;