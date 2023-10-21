import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Title } from '@angular/platform-browser';


@Injectable({
  providedIn: 'root'
})
export class AppService {
  public readonly title = new BehaviorSubject<string | undefined>(undefined)

  constructor(
    private titleSetter: Title
  ) {
    this.title.subscribe((title?: string) => {
      this.titleSetter.setTitle(title || 'Unknwown Checklist')
    })
  }
}
