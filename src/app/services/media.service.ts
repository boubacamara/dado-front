import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MediaService {
  
  private uri:string = 'https://192.168.1.7:8000/api/';
  private http = inject(HttpClient);

  chargerCv(file:any) {
    return this.http.post<any>(this.uri+`utilisateur/charger/cv`, file);
  }

  chargerAvatar(file:any) {
    return this.http.post<any>(this.uri+`utilisateur/charger/avatar`, file);
  }
}
