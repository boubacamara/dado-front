import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  private http = inject(HttpClient);

  private url:string = 'https://192.168.1.46:8000/api/';

  recuperer(id:number) {
    return this.http.get<any[]>(this.url+`role/${id}/recuperer`);
  }

  getRoles() {
    return this.http.get<any[]>(this.url+'role/recuperers');
  }

  enregistrerRole(roleDonnees: any) {
    return this.http.post<any>(this.url+'role/enregistrer', roleDonnees)
  }

  supprimer(id: number) {
    return this.http.delete<any>(this.url+`role/${id}/supprimer`)
  }

  modifier(id: number, roleDonnees:any) {
    return this.http.put<any>(this.url+`role/${id}/modifier`, roleDonnees)
  }
}
