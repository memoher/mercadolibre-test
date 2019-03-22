import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError as observableThrowError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class APIService {

    constructor(
        private http: HttpClient
    ) { }

    public searchItems(search: string) {
        return this.http
            .get<SearchItemsResponseBody>(`/api/items?q=${search}`)
            .pipe(map(data => data), catchError(this.handleError));
    }

    public getItem(id: string) {
        return this.http
            .get<GetItemResponseBody>(`/api/items/${id}`)
            .pipe(map(data => data), catchError(this.handleError));
    }

    private handleError(res: HttpErrorResponse | any) {
        console.error(res);
        return observableThrowError(res || 'Server error');
    }
}

export interface SearchItemsResponseBody {
    author: {
        name: string;
        lastname: string;
    };
    categories: string[];
    items: {
        id: string;
        title: string;
        price: {
            currency: number;
            amount: number;
            decimals: number;
        },
        picture: string;
        condition: string;
        free_shipping: boolean;
        location: {
            state: string;
            city: string;
        };
    }[];
}

export interface GetItemResponseBody {
    author: {
        name: string;
        lastname: string;
    };
    categories: string[];
    item: {
        id: string;
        title: string;
        price: {
            currency: number;
            amount: number;
            decimals: number;
        };
        picture: string;
        condition: string;
        free_shipping: boolean;
        sold_quantity: number;
        description: string;
    };
}
