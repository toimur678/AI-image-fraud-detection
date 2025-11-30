import React, { useState, useEffect } from 'react';
import { ExifAnalysis } from '../types';
import { Database, Camera, Settings, Cpu, MapPin, FileImage, ChevronDown, ChevronUp } from 'lucide-react';
import { Language, translations } from '../translations';

interface ExifDisplayProps {
  exifData: ExifAnalysis | null;
  language: Language;
}

export const ExifDisplay: React.FC<ExifDisplayProps> = ({ exifData, language }) => {
  const [showAll, setShowAll] = useState(false);
  const t = translations[language].exifDisplay;

  if (!exifData || !exifData.rawMetadata) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-400 bg-transparent p-8">
        <div className="p-4 bg-white/10 rounded-full mb-3">
          <Database size={24} className="text-slate-400" />
        </div>
        <p className="text-sm font-medium text-slate-300">{t.noData}</p>
        <p className="text-xs text-slate-400 mt-1">{t.uploadPrompt}</p>
      </div>
    );
  }

  const { rawMetadata } = exifData;

  // Helper to format values
  const formatValue = (val: any) => {
    if (val instanceof Date) return val.toLocaleString();
    if (typeof val === 'object') return JSON.stringify(val);
    return String(val);
  };

  // Group definitions
  const groups = {
    device: {
      title: t.deviceInfo,
      icon: <Camera size={18} />,
      keys: ['Make', 'Model', 'LensMake', 'LensModel', 'SerialNumber', 'BodySerialNumber']
    },
    capture: {
      title: t.captureSettings,
      icon: <Settings size={18} />,
      keys: ['ISO', 'FNumber', 'ExposureTime', 'ShutterSpeedValue', 'FocalLength', 'Flash', 'WhiteBalance', 'MeteringMode']
    },
    software: {
      title: t.softwareEditing,
      icon: <Cpu size={18} />,
      keys: ['Software', 'ProcessingSoftware', 'CreatorTool', 'ModifyDate', 'DateTimeOriginal', 'CreateDate', 'OffsetTime']
    },
    file: {
      title: t.fileProperties,
      icon: <FileImage size={18} />,
      keys: ['ImageWidth', 'ImageHeight', 'MIMEType', 'FileType', 'FileSize', 'ColorSpace', 'Orientation']
    },
    location: {
      title: t.locationData,
      icon: <MapPin size={18} />,
      keys: ['GPSLatitude', 'GPSLongitude', 'GPSAltitude', 'GPSDateStamp']
    }
  };

  // Helper to get data for a group
  const getGroupData = (groupKeys: string[]) => {
    return groupKeys.reduce((acc, key) => {
      if (rawMetadata[key] !== undefined && rawMetadata[key] !== null) {
        acc[key] = rawMetadata[key];
      }
      return acc;
    }, {} as Record<string, any>);
  };

  // Check if main data is missing
  const hasMainData = 
    Object.keys(getGroupData(groups.device.keys)).length > 0 ||
    Object.keys(getGroupData(groups.capture.keys)).length > 0 ||
    Object.keys(getGroupData(groups.software.keys)).length > 0;

  // If main data is missing, we force show all available data
  const effectiveShowAll = showAll || !hasMainData;

  // Render a card for a group
  const renderCard = (groupKey: keyof typeof groups) => {
    const group = groups[groupKey];
    const data = getGroupData(group.keys);
    
    if (Object.keys(data).length === 0) return null;

    return (
      <div key={groupKey} className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/50 shadow-sm hover:bg-slate-800/70 transition-all">
        <div className="flex items-center gap-2 mb-3 text-slate-100">
          <div className="p-2 bg-indigo-500/20 rounded-lg border border-indigo-400/30 text-indigo-300">
            {group.icon}
          </div>
          <h4 className="font-semibold text-sm">{group.title}</h4>
        </div>
        <div className="space-y-2.5">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="flex flex-col gap-0.5">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">{key}</span>
              <span className="text-sm text-slate-200 font-medium break-words overflow-hidden">{formatValue(value)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-transparent">
      <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-transparent sticky top-0 z-10 backdrop-blur-xl">
        <div>
          <h3 className="text-lg font-bold text-white">{t.title}</h3>
          <p className="text-xs text-white/60 mt-0.5">{t.subtitle}</p>
        </div>
        <button 
          onClick={() => setShowAll(!showAll)}
          className="flex items-center gap-2 px-3 py-2 bg-white/10 border border-white/10 rounded-full text-xs font-semibold text-white/80 hover:bg-white/20 transition-colors flex-shrink-0"
        >
          {effectiveShowAll ? (
            <>{t.showLess} <ChevronUp size={14} /></>
          ) : (
            <>{t.showAll} <ChevronDown size={14} /></>
          )}
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Always show important groups */}
          {renderCard('software')}
          {renderCard('device')}
          {renderCard('capture')}
          
          {/* Show others only if requested or if main data is missing */}
          {effectiveShowAll && (
            <>
              {renderCard('file')}
              {renderCard('location')}
              {/* Fallback for other keys could go here if needed */}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
