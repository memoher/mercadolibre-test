import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';

@Component({
    selector: 'app-search-bar',
    templateUrl: './search-bar.component.html',
    styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit {

    filter: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        this.route.queryParams
            .pipe(
                filter((params: Params) => params.search),
                map((params: Params) => params.search)
            )
            .subscribe(search => {
                this.filter = search;
            });
    }

    search() {
        this.router.navigate(['/items'], { queryParams: { search: this.filter } });
    }

}
