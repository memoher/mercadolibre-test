import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { APIService, GetItemResponseBody } from '../api.service';

@Component({
    selector: 'app-item-details',
    templateUrl: './item-details.component.html',
    styleUrls: ['./item-details.component.scss']
})
export class ItemDetailsComponent implements OnInit {

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
                        this.article = data.item;
                    });
            });
    }

}
