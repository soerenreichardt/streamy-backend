import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { Series } from 'src/models/series';
import { ReelGoodService } from './reelgood.service';

const NETFLIX = "netflix";
const APPLE_TV = "appletv";

@Controller()
export class ReelGoodController {
  constructor(private reelgoodService: ReelGoodService) {}

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
}
