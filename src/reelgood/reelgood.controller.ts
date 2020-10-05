import { Controller, Get } from '@nestjs/common';
import { Series } from 'src/models/series';
import { ReelGoodService } from './reelgood.service';

const NETFLIX = "netflix";

@Controller()
export class ReelGoodController {
  constructor(private reelgoodService: ReelGoodService) {}

  @Get()
  async getSeries(): Promise<Series[]> {
    return new Promise((resolve) => this.reelgoodService.getFirstPage(NETFLIX).subscribe((result) => {
      resolve(result.data);
    }));
  }
}
