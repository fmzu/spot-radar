import { GeocodingService } from './geocoding.service';

// fetchをモック
const mockFetch = jest.fn();
global.fetch = mockFetch as unknown as typeof fetch;

describe('GeocodingService', () => {
  let service: GeocodingService;

  beforeEach(() => {
    service = new GeocodingService();
    mockFetch.mockReset();
  });

  it('Nominatim APIから住所を取得できる', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        address: {
          city: '千代田区',
          neighbourhood: '丸の内一丁目',
        },
      }),
    });

    const result = await service.reverseGeocode(35.6812, 139.7671);

    expect(result).toBe('千代田区丸の内一丁目');
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('座標を約100m単位に丸めてキャッシュキーにする', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ address: { city: '千代田区' } }),
    });

    // 0.0001度（約11m）の差はキャッシュヒットする
    await service.reverseGeocode(35.6812, 139.7671);
    await service.reverseGeocode(35.6813, 139.7672);

    expect(mockFetch).toHaveBeenCalledTimes(1); // キャッシュヒットで2回目はAPI呼ばない
  });

  it('0.001度以上の差はキャッシュミスする', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ address: { city: '千代田区' } }),
    });

    await service.reverseGeocode(35.681, 139.767);
    await service.reverseGeocode(35.683, 139.769); // 約200m離れた地点

    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it('APIがエラーを返した場合にフォールバックメッセージを返す', async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 500 });

    const result = await service.reverseGeocode(35.0, 139.0);

    expect(result).toBe('住所を取得できませんでした');
  });

  it('ネットワークエラー時にフォールバックメッセージを返す', async () => {
    mockFetch.mockRejectedValue(new Error('network error'));

    const result = await service.reverseGeocode(35.0, 139.0);

    expect(result).toBe('住所を取得できませんでした');
  });
});
