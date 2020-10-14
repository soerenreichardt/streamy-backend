import { Test, TestingModule } from '@nestjs/testing';
import { Observable } from 'rxjs';
import { Series } from 'src/series/series.dto';
import { ReelGoodController } from './reelgood.controller';
import { ReelGoodService } from './reelgood.service';
import { AxiosResponse } from 'axios';
import { Neo4jService } from '../neo4j/neo4j.service';
import { HttpException } from '@nestjs/common';

class ReelGoodServiceMock {
  getPage(serviceName: string, page: number): Observable<AxiosResponse<Series[]>> {
    return new Observable();
  }
}

class Neo4jServiceMock {}

describe('ReelGoodController', () => {
  let controller: ReelGoodController;
  let service: ReelGoodService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [ReelGoodController],
      providers: [
        {
          provide: ReelGoodService,
          useValue: new ReelGoodServiceMock()
        },
        {
          provide: Neo4jService,
          useClass: Neo4jServiceMock
        }
      ]
    }).compile();

    controller = await moduleRef.resolve(ReelGoodController);
    service = await moduleRef.resolve(ReelGoodService);
  });

  describe('getSeries', () => {
    it('should return some data', async () => {
      var mockData: Series[] = [{ id: '0', title: 'test' }];
      var response: AxiosResponse<Series[]> = { data: mockData, status: null, statusText: null, headers: null, config: null };
      jest.spyOn(service, 'getPage').mockImplementation(() => new Observable(subscriber => subscriber.next(response)))
      expect(await controller.getSeries()).toBe(mockData);
    });

    it('should yield 204 when data is empty', async () => {
      var response: AxiosResponse<Series[]> = { data: null, status: 204, statusText: null, headers: null, config: null };
      jest.spyOn(service, 'getPage').mockImplementation(() => new Observable(subscriber => subscriber.next(response)));
      controller.getSeries().catch(e => expect(e).toBeInstanceOf(HttpException))
    });
  });
});