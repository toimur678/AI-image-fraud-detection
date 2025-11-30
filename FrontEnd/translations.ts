export type Language = 'en' | 'tr';

export const translations = {
  en: {
    header: {
      subtitle: "Next-Gen Fraud Detection",
      version: "v1.1.0-beta"
    },
    imageUploader: {
      uploadEvidence: "Upload Evidence",
      dragDrop: "Drag and drop your file here or click to browse from your computer",
      dropHere: "Drop image here",
      errorType: "Please upload a valid image file.",
      errorSize: "File size too large. Please upload an image under 20MB."
    },
    resultDisplay: {
      scanning: "Scanning Image...",
      analyzing: "Analyzing metadata and visual patterns",
      analyzingGemini: "Checking for SynthID to check if it was made with gemini nano banana",
      ready: "Ready to Scan",
      uploadPrompt: "Upload an image to begin the forensic analysis process.",
      scanGemini: "Scan with Gemini",
      scanNew: "Scan New File",
      metaComplete: "Metadata Analysis Complete",
      aiComplete: "AI Analysis Complete",
      total: "Total",
      unedited: "Unedited",
      edited: "Edited",
      aiGenerated: "Fake",
      realImage: "Real",
      verdictYes: "Yes",
      verdictNo: "No",
      verdictNotSure: "Not sure"
    },
    exifDisplay: {
      title: "Metadata Analysis",
      subtitle: "Technical specifications and hidden tags",
      showLess: "Show Less",
      showAll: "Show All",
      noData: "No EXIF data available",
      uploadPrompt: "Upload an image to view technical details",
      deviceInfo: "Device Information",
      captureSettings: "Capture Settings",
      softwareEditing: "Software & Editing",
      fileProperties: "File Properties",
      locationData: "Location Data"
    },
    chatSection: {
      customerChat: "Customer Chat",
      supportAgent: "Support Agent",
      activeNow: "Active Now",
      typeMessage: "Type your message...",
      clearChat: "Clear Chat"
    }
  },
  tr: {
    header: {
      subtitle: "Yeni Nesil Sahtecilik Tespiti",
      version: "v1.1.0-beta"
    },
    imageUploader: {
      uploadEvidence: "Kanıt Yükle",
      dragDrop: "Dosyanızı buraya sürükleyip bırakın veya bilgisayarınızdan seçmek için tıklayın",
      dropHere: "Resmi buraya bırakın",
      errorType: "Lütfen geçerli bir resim dosyası yükleyin.",
      errorSize: "Dosya boyutu çok büyük. Lütfen 20MB'ın altında bir resim yükleyin."
    },
    resultDisplay: {
      scanning: "Resim Taranıyor...",
      analyzing: "Meta veriler ve görsel desenler analiz ediliyor",
      analyzingGemini: "Checking for SynthID to check if it was made with gemini nano banana",
      ready: "Taramaya Hazır",
      uploadPrompt: "Adli analiz sürecini başlatmak için bir resim yükleyin.",
      scanGemini: "Gemini ile Tara",
      scanNew: "Yeni Dosya Tara",
      metaComplete: "Meta Veri Analizi Tamamlandı",
      aiComplete: "Yapay Zeka Analizi Tamamlandı",
      total: "Toplam",
      unedited: "Düzenlenmemiş",
      edited: "Düzenlenmiş",
      aiGenerated: "Sahte",
      realImage: "Gerçek",
      verdictYes: "Evet",
      verdictNo: "Hayır",
      verdictNotSure: "Emin değilim"
    },
    exifDisplay: {
      title: "Meta Veri Analizi",
      subtitle: "Teknik özellikler ve gizli etiketler",
      showLess: "Daha Az Göster",
      showAll: "Tümünü Göster",
      noData: "EXIF verisi mevcut değil",
      uploadPrompt: "Teknik detayları görmek için bir resim yükleyin",
      deviceInfo: "Cihaz Bilgileri",
      captureSettings: "Çekim Ayarları",
      softwareEditing: "Yazılım & Düzenleme",
      fileProperties: "Dosya Özellikleri",
      locationData: "Konum Verileri"
    },
    chatSection: {
      customerChat: "Müşteri Sohbeti",
      supportAgent: "Destek Temsilcisi",
      activeNow: "Şu An Aktif",
      typeMessage: "Mesajınızı yazın...",
      clearChat: "Sohbeti Temizle"
    }
  }
};
