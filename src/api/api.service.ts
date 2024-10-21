import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PlayerResponse, ShipResponse } from './api.models';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'https://www.swapi.tech/api/';

  constructor(private http: HttpClient) {}

  getRandomPlayer(): Observable<PlayerResponse> {
    const randomId = Math.floor(Math.random() * 83) + 1;
    return this.http.get<PlayerResponse>(`${this.baseUrl}people/${randomId}`);
  }

  getRandomShip(): Observable<ShipResponse> {
    const randomId = Math.floor(Math.random() * 30) + 1;
    return this.http.get<ShipResponse>(`${this.baseUrl}starships/${randomId}`);
  }
}
