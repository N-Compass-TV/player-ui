import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, retry, timeout } from 'rxjs';
import { environment } from '@environments';

@Injectable({
    providedIn: 'root',
})
export class RequestService {
    constructor(private _http: HttpClient) {}

    /**
     * Sends a GET request to the specified endpoint.
     * @param {string} endpoint - The API endpoint to send the request to.
     * @param {boolean} [overwriteBase=false] - Whether to overwrite the base URL.
     * @returns {Observable<any>} An observable of the response.
     */
    public getRequest(endpoint: string, overwriteBase = false): Observable<any> {
        const url = !overwriteBase ? `${this.baseApiUrl}${endpoint}` : endpoint;
        return this._http.get(url).pipe(timeout(50000), retry(2));
    }

    /**
     * Sends a POST request to the specified endpoint with the given body.
     * @param {string} endpoint - The API endpoint to send the request to.
     * @param {any} body - The body of the POST request.
     * @returns {Observable<any>} An observable of the response.
     */
    public postRequest(endpoint: string, body: any): Observable<any> {
        const url = `${this.baseApiUrl}${endpoint}`;
        return this._http.post(url, body).pipe(timeout(50000));
    }

    /**
     * Sends a PUT request to the specified endpoint with the given body.
     * @param {string} endpoint - The API endpoint to send the request to.
     * @param {any} body - The body of the PUT request.
     * @returns {Observable<any>} An observable of the response.
     */
    public putRequest(endpoint: string, body: any): Observable<any> {
        const url = `${this.baseApiUrl}${endpoint}`;
        return this._http.put(url, body).pipe(timeout(20000));
    }

    /**
     * Sends a DELETE request to the specified endpoint with the given ID.
     * @param {string} endpoint - The API endpoint to send the request to.
     * @param {any} id - The ID of the resource to delete.
     * @returns {Observable<any>} An observable of the response.
     */
    public deleteRequest(endpoint: string, id: any): Observable<any> {
        const url = `${this.baseApiUrl}${endpoint}/${id}`;
        return this._http.delete(url).pipe(timeout(20000));
    }

    /**
     * The base URL for API requests.
     * @protected
     * @type {string}
     */
    protected get baseApiUrl() {
        return `${environment.api}/api/`;
    }
}
