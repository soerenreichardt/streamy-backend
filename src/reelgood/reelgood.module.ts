import { HttpModule, HttpService, Module } from '@nestjs/common';
import { ReelGoodController } from './reelgood.controller';
import { ReelGoodService } from './reelgood.service';

@Module({
  imports: [HttpModule],
  controllers: [ReelGoodController],
  providers: [ReelGoodService],
})
export class ReelGoodModule {}