import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { pageInterface } from '../models/paginacion.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = "http://localhost:3000/api/user";  // Usar apiUrl desde environment

  constructor(private http: HttpClient) {}

  // Obtener todos los usuarios
  getUsers(paginacion: pageInterface): Observable<User[]> {
    return this.http.post<User[]>(`${this.apiUrl}/all`, paginacion);
  }

  // Agregar un nuevo usuario
  addUser(usuario: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, usuario);
  }

  // Actualizar un usuario existente
  updateUser(usuario: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${usuario._id}`, usuario);
  }

  // Eliminar un usuario por su _id
  deleteUserById(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  //Habilitar o deshabilitar un usuario
  toggleHabilitacion(id: string, habilitado: boolean): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${id}/habilitacion`, { habilitado });
  }
  // Obtener el ID del usuario según su nombre
  getUserByName(name: string): Observable<{ _id: string } | null> {
    return this.http.get<{ _id: string } | null>(`${this.apiUrl}/findByName/${name}`);
  }
}


