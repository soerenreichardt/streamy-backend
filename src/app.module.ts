import { Module } from '@nestjs/common';
import { ReelGoodModule } from './reelgood/reelgood.module';

@Module({
  imports: [ReelGoodModule],
})
export class AppModule {}
