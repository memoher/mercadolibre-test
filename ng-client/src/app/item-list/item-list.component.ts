import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { filter, map, flatMap } from 'rxjs/operators';
import { APIService, SearchItemsResponseBody } from '../api.service';

@Component({
    selector: 'app-item-list',
    templateUrl: './item-list.component.html',
    styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent implements OnInit {

    search: string;

    categories: string[];

    articles: {
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

    constructor(
        private route: ActivatedRoute,
        private api: APIService
    ) { }

    ngOnInit() {
        this.route.queryParams
            .pipe(
                filter((params: Params) => params.search),
                map((params: Params) => params.search)
            )
            .subscribe(search => {
                this.search = search;
                this.api.searchItems(search)
                    .subscribe(data => {
                        this.categories = data.categories;
                        this.articles = data.items;
                    });
            });
    }

}
