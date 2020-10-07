import { Inject, Injectable } from "@nestjs/common";
import { driver, Driver, Session } from "neo4j-driver";
import { Neo4jConfig } from "./neo4j-config.interface";
import { NEO4J_CONFIG, NEO4J_DRIVER } from "./neo4j.constants";

@Injectable()
export class Neo4jService {

    readonly session: Session

    constructor(
        @Inject(NEO4J_CONFIG) private readonly config: Neo4jConfig,
        @Inject(NEO4J_DRIVER) private readonly driver: Driver
    ) {
        this.session = driver.session();
    }

}