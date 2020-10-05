import { Test, TestingModule } from '@nestjs/testing';
import { Observable } from 'rxjs';
import { Series } from 'src/models/series';
import { ReelGoodController } from './reelgood.controller';
import { ReelGoodService } from './reelgood.service';
import { AxiosResponse } from 'axios';
import { ReelGoodModule } from './reelgood.module';

describe('ReelGoodController', () => {
  let controller: ReelGoodController;
  let service: ReelGoodService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [ReelGoodModule]
    }).compile();

    controller = await moduleRef.resolve(ReelGoodController);
    service = await moduleRef.resolve(ReelGoodService);
  });

  describe('getSeries', () => {
    it('should return some data', async () => {
        var mockData: Series[] = [{ id: '0', title: 'test'}];
        var response: AxiosResponse<Series[]> = { data: mockData, status: null, statusText: null, headers: null, config: null };
        jest.spyOn(service, 'getFirstPage').mockImplementation(() => new Observable(subscriber => subscriber.next(response)))
      expect(await controller.getSeries()).toBe(mockData);
    });
  });
});