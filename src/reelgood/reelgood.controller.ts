import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { Series } from 'src/series/series.dto';
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
  storeAllSeriesInNeo4j(): void {
    let session = this.neo4jService.session;

    this.getAllSeries().then(async seriesArray => {
      let queries: string[] = [];
      for(let i=0; i<seriesArray.length; i++) {
        queries.push(ReelGoodController.seriesCreateQuery(seriesArray[i], i));
      }

      let batchQuery = queries.join(' ');
      const result = await session.run(batchQuery);

      console.log(result);
      console.log("Done");
    });
  }

  static seriesCreateQuery(series: Series, index: number): string {
    let properties: string[] = [];
    // properties.push(`id: "${series.id}"`); 
    properties.push(`title: "${ReelGoodController.escapeString(series.title)}"`);
    properties.push(`contentType: "${series.content_type}"`);
    properties.push(`overview: "${ReelGoodController.escapeString(series.overview)}"`);
    properties.push(`imdb_rating: ${series.imdb_rating}`);
    properties.push(`rt_critics_rating: ${series.rt_critics_rating}`);
    properties.push(`rg_content_score: ${series.rg_content_score}`);
    properties.push(`rg_content_score: ${series.rg_content_score}`);
    properties.push(`released_on: datetime("${series.released_on}")`);
    properties.push(`classification: "${series.classification}"`);

    let propertyString = properties.filter(property => property != '').join(", ");

    return `MERGE (n${index}:Series { id: "${series.id}" }) SET n${index} += { ${propertyString} }`;
  }

  static seriesGenreRelationshipQuery(series: Series, index: number): string {
    let queries: string[] = [];
    if (series.genres.length == 0) return "";
    series.genres.forEach(genre => {
      queries.push(`MERGE (:Genre {id: ${genre}})<-[:HAS_GENRE]-(n${index})`);
    })
    return queries.join(" ");
  }

  static escapeString(str: string): string {
    if (str == null) return null;
    str = str.replace(/'/gi, "\\'");
    str = str.replace(/"/gi, "\\\"");
    return str;
  }
}
