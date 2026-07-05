import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { environment } from "../../environments/environment";
import { Observable, tap } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  http = inject(HttpClient);
  token = signal<string | null>(null);
  private apiUrl = environment.apiBaseUrl;

  registerUser(user: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  loginUser(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response: any) => {
        this.token.set(response?.token ?? null);
      })
    );
  }

  logout(): void {
    this.token.set(null);
  }
}