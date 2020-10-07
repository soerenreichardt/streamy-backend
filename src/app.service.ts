import { Injectable } from '@nestjs/common';
import { Neo4jService } from './neo4j/neo4j.service';

@Injectable()
export class AppService {

  constructor(private neo4j: Neo4jService) {}

  getHello(): string {
    return 'Hello World!';
  }
}
