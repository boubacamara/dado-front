import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class MediaService {
  
  private uri:string = environment.apiUrl;
  private http = inject(HttpClient);

  chargerCv(file:any) {
    return this.http.post<any>(this.uri+`utilisateur/charger/cv`, file);
  }

  chargerAvatar(file:any) {
    return this.http.post<any>(this.uri+`utilisateur/charger/avatar`, file);
  }
}
