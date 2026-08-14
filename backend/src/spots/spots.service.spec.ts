import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Spot } from './spot.entity';
import { SpotsService } from './spots.service';

describe('SpotsService', () => {
  let service: SpotsService;
  let getRawAndEntities: jest.Mock;

  beforeEach(async () => {
    getRawAndEntities = jest.fn();

    const mockQueryBuilder = {
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      setParameters: jest.fn().mockReturnThis(),
      getRawAndEntities,
    };

    const mockRepository = {
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
    };

    const module = await Test.createTestingModule({
      providers: [
        SpotsService,
        { provide: getRepositoryToken(Spot), useValue: mockRepository },
      ],
    }).compile();

    service = module.get(SpotsService);
  });

  it('検索結果を距離付きで近い順に返す', async () => {
    getRawAndEntities.mockResolvedValue({
      entities: [
        { id: 1, name: '東京タワー', category: '観光名所', address: '東京都港区', lat: 35.658, lng: 139.745 },
        { id: 2, name: '増上寺', category: '寺社', address: '東京都港区', lat: 35.656, lng: 139.748 },
      ],
      raw: [{ distance_m: '120.5' }, { distance_m: '450.9' }],
    });

    const result = await service.findNearby(35.658, 139.745, 3);

    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('東京タワー');
    expect(result[0].distanceM).toBe(121); // Math.roundで整数
    expect(result[1].distanceM).toBe(451);
  });

  it('検索結果が0件のとき空配列を返す', async () => {
    getRawAndEntities.mockResolvedValue({ entities: [], raw: [] });

    const result = await service.findNearby(0, 0, 1);

    expect(result).toEqual([]);
  });

  it('返却値にlocation（geography列）を含まない', async () => {
    getRawAndEntities.mockResolvedValue({
      entities: [
        { id: 1, name: 'A', category: 'B', address: 'C', lat: 1, lng: 2, location: { type: 'Point', coordinates: [2, 1] } },
      ],
      raw: [{ distance_m: '100' }],
    });

    const result = await service.findNearby(1, 2, 5);

    expect(result[0]).not.toHaveProperty('location');
    expect(result[0]).toHaveProperty('distanceM');
  });
});
