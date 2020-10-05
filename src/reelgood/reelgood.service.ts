import { HttpService, Injectable, ParseArrayPipe, UsePipes } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { Series } from 'src/models/series';


const API = "https://api.reelgood.com/v2";

@Injectable()
export class ReelGoodService {
    constructor(private http: HttpService) {}

    getFirstPage(platformName: string): Observable<AxiosResponse<Series[]>> {
        const query = `${API}/browse/source/${platformName}`;
        return this.http.get(query);
    }
}
