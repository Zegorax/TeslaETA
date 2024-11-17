import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ShareDTO } from '../../../dtos/share-dto';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient,
  ) { }

  getShares(): Observable<Array<ShareDTO>> {
    return this.http.get<Array<ShareDTO>>(`${environment.apiUrl}/share`);
  }

  getShare(uuid: string): Observable<ShareDTO> {
    return this.http.get<ShareDTO>(`${environment.apiUrl}/share/${uuid}`);
  }

  addShare(share: ShareDTO): Observable<ShareDTO> {
    return this.http.post<ShareDTO>(`${environment.apiUrl}/share`, share);
  }
}
