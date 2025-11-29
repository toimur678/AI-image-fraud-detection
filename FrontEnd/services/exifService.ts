// FrontEnd/services/exifService.ts
import * as exifr from 'exifr';
import { ExifAnalysis } from '../types';

const EDITING_SOFTWARE_HINTS = [
  'photoshop',
  'lightroom',
  'snapseed',
  'picsart',
  'vsco',
  'canva',
  'gimp',
  'pixelmator',
  'affinity',
  'sketch',
  'figma',
  'paint.net',
  'krita',
  'darktable',
  'capture one',
  'luminar',
  'on1',
  'dxo'
];

const AI_GENERATION_HINTS = [
  'midjourney',
  'dall-e',
  'dalle',
  'stable diffusion',
  'firefly',
  'imagen',
  'leonardo',
  'nightcafe',
  'artbreeder'
];

/**
 * Debug function to log comprehensive EXIF data
 * This helps understand what metadata is available in the image
 */
export function logExifDebugInfo(metadata: any, fileName: string): void {
  console.group(`EXIF Debug Info for: ${fileName}`);
  
  // Basic Camera Info
  console.group('Camera Information');
  console.log('Make:', metadata.Make || 'N/A');
  console.log('Model:', metadata.Model || 'N/A');
  console.log('Lens Make:', metadata.LensMake || 'N/A');
  console.log('Lens Model:', metadata.LensModel || 'N/A');
  console.log('Serial Number:', metadata.SerialNumber || 'N/A');
  console.groupEnd();

  // Software & Processing
  console.group('Software Information');
  console.log('Software:', metadata.Software || 'N/A');
  console.log('Processing Software:', metadata.ProcessingSoftware || 'N/A');
  console.log('Creator Tool:', metadata.CreatorTool || 'N/A');
  console.log('Host Computer:', metadata.HostComputer || 'N/A');
  console.log('Creator:', metadata.Creator || 'N/A');
  console.log('XMP Creator Tool:', metadata.CreatorTool || 'N/A');
  console.groupEnd();

  // Date & Time Info
  console.group('Date & Time');
  console.log('Date Time Original:', metadata.DateTimeOriginal || 'N/A');
  console.log('Create Date:', metadata.CreateDate || 'N/A');
  console.log('Modify Date:', metadata.ModifyDate || 'N/A');
  console.log('Date Time Digitized:', metadata.DateTimeDigitized || 'N/A');
  console.log('Metadata Date:', metadata.MetadataDate || 'N/A');
  console.groupEnd();

  // GPS Data
  console.group('GPS Information');
  console.log('GPS Latitude:', metadata.GPSLatitude || 'N/A');
  console.log('GPS Longitude:', metadata.GPSLongitude || 'N/A');
  console.log('GPS Altitude:', metadata.GPSAltitude || 'N/A');
  console.log('GPS Date Stamp:', metadata.GPSDateStamp || 'N/A');
  console.groupEnd();

  // Image Properties
  console.group('Image Properties');
  console.log('Image Width:', metadata.ImageWidth || metadata.ExifImageWidth || 'N/A');
  console.log('Image Height:', metadata.ImageHeight || metadata.ExifImageHeight || 'N/A');
  console.log('Orientation:', metadata.Orientation || 'N/A');
  console.log('Resolution Unit:', metadata.ResolutionUnit || 'N/A');
  console.log('X Resolution:', metadata.XResolution || 'N/A');
  console.log('Y Resolution:', metadata.YResolution || 'N/A');
  console.log('Color Space:', metadata.ColorSpace || 'N/A');
  console.log('Bits Per Sample:', metadata.BitsPerSample || 'N/A');
  console.groupEnd();

  // Camera Settings
  console.group('Camera Settings');
  console.log('ISO:', metadata.ISO || 'N/A');
  console.log('Exposure Time:', metadata.ExposureTime || 'N/A');
  console.log('F Number:', metadata.FNumber || 'N/A');
  console.log('Aperture:', metadata.ApertureValue || 'N/A');
  console.log('Shutter Speed:', metadata.ShutterSpeedValue || 'N/A');
  console.log('Focal Length:', metadata.FocalLength || 'N/A');
  console.log('Flash:', metadata.Flash || 'N/A');
  console.log('White Balance:', metadata.WhiteBalance || 'N/A');
  console.log('Metering Mode:', metadata.MeteringMode || 'N/A');
  console.log('Exposure Mode:', metadata.ExposureMode || 'N/A');
  console.log('Scene Capture Type:', metadata.SceneCaptureType || 'N/A');
  console.groupEnd();

  // Editing & History
  console.group('Edit History & Flags');
  console.log('History:', metadata.History || 'N/A');
  console.log('Derived From:', metadata.DerivedFrom || 'N/A');
  console.log('Document ID:', metadata.DocumentID || 'N/A');
  console.log('Instance ID:', metadata.InstanceID || 'N/A');
  console.log('Original Document ID:', metadata.OriginalDocumentID || 'N/A');
  console.log('Format:', metadata.Format || 'N/A');
  console.groupEnd();

  // XMP & Adobe Metadata
  console.group('XMP & Adobe Metadata');
  console.log('Rating:', metadata.Rating || 'N/A');
  console.log('Marked:', metadata.Marked || 'N/A');
  console.log('Instructions:', metadata.Instructions || 'N/A');
  console.log('Photoshop History:', metadata.PhotoshopHistory || 'N/A');
  console.groupEnd();

  // Thumbnail Info
  console.group('Thumbnail');
  console.log('Has Thumbnail:', !!metadata.thumbnail);
  console.log('Thumbnail Length:', metadata.ThumbnailLength || 'N/A');
  console.groupEnd();

  // Raw metadata dump for advanced debugging
  console.group('Complete Raw Metadata');
  console.log(metadata);
  console.groupEnd();

  console.groupEnd();
}

export async function analyzeExif(file: File): Promise<ExifAnalysis> {
  try {
    // Use comprehensive parsing options to extract ALL available metadata
    const metadata = await exifr.parse(file, {
      tiff: true,
      exif: true,
      gps: true,
      iptc: true,
      xmp: true,
      icc: true,
      mergeOutput: true,
      translateValues: true,
      translateKeys: true
    }).catch((err) => {
      console.error('EXIF parsing error:', err);
      return null;
    });

    // Log comprehensive debug information
    logExifDebugInfo(metadata || {}, file.name);

    if (!metadata) {
      console.warn('No EXIF metadata found in image');
      return {
        isOriginal: false,
        reasons: ['No EXIF metadata found; cannot verify camera origin.'],
        hasExif: false,
        hasGps: false
      };
    }

    // Extract comprehensive metadata fields
    const make = (metadata.Make || '').toString().trim();
    const model = (metadata.Model || '').toString().trim();
    const software = (metadata.Software || metadata.ProcessingSoftware || metadata.CreatorTool || '').toString().trim();
    const creator = (metadata.Creator || '').toString().trim();
    const hasGps = !!(metadata.GPSLatitude && metadata.GPSLongitude);
    const dateOriginal = metadata.DateTimeOriginal?.toString() ?? '';
    const dateModified = metadata.ModifyDate?.toString() ?? '';
    const createDate = metadata.CreateDate?.toString() ?? '';
    const metadataDate = metadata.MetadataDate?.toString() ?? '';
    const history = metadata.History?.toString() ?? '';
    const derivedFrom = metadata.DerivedFrom?.toString() ?? '';
    const documentId = metadata.DocumentID?.toString() ?? '';
    const originalDocId = metadata.OriginalDocumentID?.toString() ?? '';
    const hostComputer = metadata.HostComputer?.toString() ?? '';
    
    // Camera settings that real cameras would have
    const iso = metadata.ISO;
    const exposureTime = metadata.ExposureTime;
    const fNumber = metadata.FNumber;
    const focalLength = metadata.FocalLength;
    const flash = metadata.Flash;
    const lensMake = metadata.LensMake?.toString() ?? '';
    const lensModel = metadata.LensModel?.toString() ?? '';

    const reasons: string[] = [];
    let isOriginal = true;

    console.group('EXIF Analysis Results');

    // Heuristic 1 – obvious editing software
    if (software) {
      const swLower = software.toLowerCase();
      if (EDITING_SOFTWARE_HINTS.some(h => swLower.includes(h))) {
        isOriginal = false;
        reasons.push(`Editing software detected: "${software}"`);
        console.log('Editing software found:', software);
      } else if (AI_GENERATION_HINTS.some(h => swLower.includes(h))) {
        isOriginal = false;
        reasons.push(`AI generation tool detected: "${software}"`);
        console.log('AI generation tool found:', software);
      } else {
        console.log('Software field present but no editing hints:', software);
      }
    }

    // Heuristic 2 – check creator field for AI hints
    if (creator) {
      const creatorLower = creator.toLowerCase();
      if (AI_GENERATION_HINTS.some(h => creatorLower.includes(h))) {
        isOriginal = false;
        reasons.push(`AI generation detected in creator field: "${creator}"`);
        console.log('AI generation in creator field:', creator);
      }
    }

    // Heuristic 3 – missing camera info
    if (!make && !model) {
      isOriginal = false;
      reasons.push('Camera make/model missing in EXIF.');
      console.log('No camera make/model found');
    } else {
      console.log('Camera info present:', make, model);
    }

    // Heuristic 4 – different original vs modified timestamps
    if (dateOriginal && dateModified && dateOriginal !== dateModified) {
      isOriginal = false;
      reasons.push(`Image modified after capture. Original: ${dateOriginal}, Modified: ${dateModified}`);
      console.log('Timestamp mismatch - Original:', dateOriginal, 'Modified:', dateModified);
    }

    // Heuristic 5 – check for edit history
    if (history && history.length > 0) {
      isOriginal = false;
      reasons.push('Edit history detected in metadata.');
      console.log('Edit history found:', history);
    }

    // Heuristic 6 – derived from another document
    if (derivedFrom) {
      isOriginal = false;
      reasons.push('Image derived from another document.');
      console.log('Derived from:', derivedFrom);
    }

    // Heuristic 7 – document ID mismatch
    if (documentId && originalDocId && documentId !== originalDocId) {
      isOriginal = false;
      reasons.push('Document ID differs from original, indicating editing.');
      console.log('Document ID mismatch');
    }

    // Heuristic 8 – missing typical camera EXIF data
    if (make && model && !iso && !exposureTime && !fNumber) {
      isOriginal = false;
      reasons.push('Camera info present but missing typical camera settings (ISO, exposure, aperture).');
      console.log('Camera present but missing camera settings');
    }

    // Heuristic 9 – check for suspicious host computer names
    if (hostComputer) {
      const hostLower = hostComputer.toLowerCase();
      if (AI_GENERATION_HINTS.some(h => hostLower.includes(h))) {
        isOriginal = false;
        reasons.push(`AI generation detected in host computer: "${hostComputer}"`);
        console.log('AI hints in host computer:', hostComputer);
      }
    }

    if (isOriginal && reasons.length === 0) {
      reasons.push('No obvious signs of editing were found in EXIF metadata.');
      console.log('Image appears original - no editing signs detected');
    }

    console.groupEnd();

    return {
      isOriginal,
      reasons,
      cameraMake: make || undefined,
      cameraModel: model || undefined,
      software: software || undefined,
      hasGps,
      hasExif: true,
      rawMetadata: metadata
    };
  } catch (err) {
    console.error('EXIF analysis failed:', err);
    // On failure we fail-safe as suspicious
    return {
      isOriginal: false,
      reasons: ['Failed to read EXIF metadata; treating as suspicious.'],
      hasExif: false,
      hasGps: false
    };
  }
}
