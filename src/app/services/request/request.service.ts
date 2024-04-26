import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, retry, timeout } from 'rxjs';
import { environment } from '@environments';

@Injectable({
    providedIn: 'root',
})
export class RequestService {
    constructor(private _http: HttpClient) {}

    public getRequest(endpoint: string, overwriteBase = false): Observable<any> {
        const url = !overwriteBase ? `${this.baseApiUrl}${endpoint}` : endpoint;
        return this._http.get(url).pipe(timeout(50000), retry(2));
    }

    public postRequest(endpoint: string, body: any): Observable<any> {
        const url = `${this.baseApiUrl}${endpoint}`;
        return this._http.post(url, body).pipe(timeout(50000));
    }

    public putRequest(endpoint: string, body: any): Observable<any> {
        const url = `${this.baseApiUrl}${endpoint}`;
        return this._http.put(url, body).pipe(timeout(20000));
    }

    public deleteRequest(endpoint: string, id: any): Observable<any> {
        const url = `${this.baseApiUrl}${endpoint}/${id}`;
        return this._http.delete(url).pipe(timeout(20000));
    }

    protected get baseApiUrl() {
        return `${environment.api}/api/`;
    }

    // protected getItem(key: string) {
    //     return this._localStorage.getItem(key);
    // }

    // protected setItem(key: string, value: string) {
    //     return this._localStorage.setItem(key, value);
    // }

    // protected removeItem(key: string) {
    //     return this._localStorage.removeItem(key);
    // }
}
