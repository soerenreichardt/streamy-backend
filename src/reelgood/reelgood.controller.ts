import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { Series } from 'src/models/series';
import { Neo4jService } from '../neo4j/neo4j.service';
import { ReelGoodService } from './reelgood.service';

const NETFLIX = "netflix";
const APPLE_TV = "appletv";

@Controller()
export class ReelGoodController {

  constructor(
    private reelgoodService: ReelGoodService,
    private neo4jService: Neo4jService
  ) {}

  @Get()
  async getSeries(): Promise<Series[]> {
    return new Promise((resolve) => this.reelgoodService.getPage(NETFLIX, 0).subscribe((result) => {
      if (result.status == HttpStatus.NO_CONTENT) {
        throw new HttpException("Empty result", result.status);
      }
      resolve(result.data);
    }));
  }

  @Get('all')
  async getAllSeries(): Promise<Series[]> {
    return this.reelgoodService.getAllPages(NETFLIX);
  }

  @Get('store')
  storeDiffInNeo4j(): void {
    let session = this.neo4jService.session;

    this.getAllSeries().then(async seriesArray => {
      let queries: string[] = [];
      seriesArray.forEach(series => {
        queries.push(ReelGoodController.toCypher(series));
      });

      let batchQuery = queries.join(' ');
      const result = await session.run(batchQuery);

      console.log("Done");
    });
  }

  static toCypher(series: Series): string {
    return 'CREATE (:Series)';
  }
}
