import { Battery, Signal, MapPin } from 'lucide-react';

// Define the props interface for type safety
export default function MapPopUp({ 
  deviceName = "N/A", 
  status = "offline", 
  battery = 0, 
  signal = -1,
  width = "w-24",
  className = ""
}) {
  // Determine status styling based on status value
  const getStatusStyle = () => {
    switch(status.toLowerCase()) {
      case 'online':
        return 'bg-green-100 text-green-700';
      case 'offline':
        return 'bg-red-100 text-red-700';
      case 'warning':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className={` ${width} text-xs  ${className}`}>
      {/* Header with Icon and Name */}
      <div className="flex items-center gap-1 mb-1.5 border-b pb-1">
        <MapPin size={14} className="text-blue-600" />
        <span className="font-bold truncate">{deviceName}</span>
      </div>
      
      {/* Status Indicator */}
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-gray-600">Status:</span>
        <span className={`px-1 py-0.5 rounded text-xs font-medium ${getStatusStyle()}`}>
          {status}
        </span>
      </div>
      
      {/* Battery & Signal on same row with better icons */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1">
          <Battery size={12} className={`${battery > 20 ? 'text-green-500' : 'text-red-500'}`} />
          <span>{battery}%</span>
        </div>
        <div className="flex items-center gap-1">
          <Signal size={12} className="text-blue-500" />
          <span>{signal}</span>
        </div>
      </div>
    </div>
  );
}