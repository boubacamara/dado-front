import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CategorieService {

  private url:string = 'https://192.168.1.46:8000/api/';
  private http = inject(HttpClient);

  recuperer(id:number) {
    return this.http.get<any[]>(this.url+`categorie/${id}/recuperer`);
  }

  enregistrerCategorie(categorieDonnees:any) {
    return this.http.post<any>(this.url+'categorie/enregistrer', categorieDonnees);
  }

  getCategories() {
    return this.http.get<any[]>(this.url+'categorie/recuperers');
  }

  modifier(id:number, categorieDonnees:any) {
    return this.http.put<any[]>(this.url+`categorie/${id}/modifier`, categorieDonnees);
  }

  supprimer(id:number) {
    return this.http.delete<any[]>(this.url+`categorie/${id}/supprimer`);
  }


}
