// Bileşenleri yenilemek için kullanılan props tipi
export interface RefreshProps {
  refreshKey: number; // Yenileme anahtarı - değiştiğinde bileşenler veriyi yeniden çeker
  setRefreshKey: (key: number) => void; // Yenileme anahtarını güncelleyen fonksiyon
}
