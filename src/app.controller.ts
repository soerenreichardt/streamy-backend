import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Neo4jService } from './neo4j/neo4j.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private neo4j: Neo4jService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
