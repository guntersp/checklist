import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AppService } from '../app.service';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

class Checklist {
  id!: string
}

class Category {
  id!: string
  checklists: Checklist[] = []
}

@Component({
  selector: 'app-list-all',
  templateUrl: './list-all.component.html',
  styleUrls: ['./list-all.component.scss']
})
export class ListAllComponent {

  all = new BehaviorSubject<Category[] | undefined>(undefined)

  constructor(
    route: ActivatedRoute,
    private httpClient: HttpClient,
    private appService: AppService
  ) {
    route.params.subscribe((params) => {
      //console.log(params["category"]);

      this.loadList(params['category'])
    })
  }

  public async loadList(category?: string) {
    this.all.next(undefined)

    if (!category) {
      this.appService.title.next('Alle Checklisten')
    } else {
      this.appService.title.next('Checklisten: ' + category)
    }

    this.httpClient.get('/checklists/list.php' + (category ? '?category=' + encodeURI(category) : ''), {
      responseType: 'json'
    }).subscribe((data: any) => {

      const categories: Category[] = []

      for (const c in data) {
        if (Object.prototype.hasOwnProperty.call(data, c)) {
          const lists = data[c];

          const cat: Category = {
            id: c,
            checklists: []
          }

          for (const l of lists) {
            cat.checklists.push({
              id: l
            })
          }

          if (cat.checklists.length > 0) {
            categories.push(cat)
          }
        }
      }

      this.all.next(categories)
    });
  }

  public getChecklistUrl(c: Category, l: Checklist): string {
    return `/${c.id}/${l.id}`
  }
}
