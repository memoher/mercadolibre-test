import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { APIService, GetItemResponseBody } from '../api.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-item-details',
    templateUrl: './item-details.component.html',
    styleUrls: ['./item-details.component.scss']
})
export class ItemDetailsComponent implements OnInit {

    categories: string[];

    article: {
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

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private api: APIService
    ) { }

    ngOnInit() {
        this.route.params
            .pipe(
                filter((params: Params) => params.id),
                map((params: Params) => params.id)
            )
            .subscribe((id: string) => {
                this.api.getItem(id)
                    .subscribe(data => {
                        this.categories = data.categories;
                        this.article = data.item;
                    }, err => {
                        let errHandled = false;
                        if (err instanceof HttpErrorResponse) {
                            const httpErr = err as HttpErrorResponse;
                            if (httpErr.status === 404) {
                                errHandled = true;
                                this.router.navigate(['/']);
                                alert(`Upps! El producto ${id} no existe`);
                            }
                        }
                        if (!errHandled) {
                            alert('Upps! Estamos con dificultades técnicas. Por favor intenta más tarde');
                        }
                    });
            });
    }

    buy() {
        alert('Muy buena elección!');
    }

}
