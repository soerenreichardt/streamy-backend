import { HttpService, HttpStatus, Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Series } from 'src/series/series.dto';
import { map, filter } from 'rxjs/operators';
import { Observable } from 'rxjs';

const API = "https://api.reelgood.com/v2"; // TODO: upgrade to v3.0

@Injectable()
export class ReelGoodService {
    static readonly PAGE_SIZE: number = 250;

    currenctPage: number

    constructor(private http: HttpService) {
        this.currenctPage = 0;
    }

    getPage(serviceName: string, page: number): Observable<AxiosResponse<Series[]>> {
        const skip = ReelGoodService.PAGE_SIZE * page;
        const query = `${API}/browse/source/${serviceName}?skip=${skip}&take=${ReelGoodService.PAGE_SIZE}`;
        return this.http.get(query).pipe(map(response => {
            if (Object.keys(response.data).length == 0) {
                response.status = HttpStatus.NO_CONTENT;
                response.statusText = 'Empty result';
            }
            return response;
        }));
    }

    async getAllPages(serviceName: string): Promise<Series[]> {
        let page = 0;

        let seriesData: Series[] = [];

        while(true) {
            let response = await this.getPage(serviceName, page++).toPromise();
            if (response.status == HttpStatus.NO_CONTENT || page == 2) break;
            response.data.forEach(data => seriesData.push(data));
        }

        return new Promise(resolve => resolve(seriesData));
    }
}
