import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ChecklistDefinition } from './checklist-definition';
import { HttpClient } from '@angular/common/http';
import { AppService } from '../app.service';
import * as YAML from 'yaml';

@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.component.html',
  styleUrls: ['./checklist.component.scss']
})
export class ChecklistComponent {

  public readonly data = new BehaviorSubject<ChecklistDefinition | undefined>(undefined)

  public readonly meta = new BehaviorSubject<{
    category?: string
  }>({})

  constructor(
    route: ActivatedRoute,
    private httpClient: HttpClient,
    private appService: AppService
  ) {
    route.params.subscribe((params) => {
      //console.log(params["category"], params['checklist']);

      this.loadChecklist(params['category'], params['checklist'])
    })
  }

  public get hasChecklist(): boolean {
    return !!this.data.value
  }

  public get hasLinks(): boolean {
    const d = this.data.value
    if (!d) {
      return false
    }

    return !!d.links && d.links.length > 0
  }

  public async loadChecklist(category: string, checklist: string) {
    const url = this.getDefinitionUrl(category, checklist)
    if (!url) {
      this.setChecklist(category, undefined)
      return
    }

    this.httpClient.get(url, {
      responseType: 'text'
    }).subscribe((data: string) => {

      try {
        const def: Partial<ChecklistDefinition> =
          //JSON.parse(data)
          YAML.parse(data)

        //console.log(def)

        this.setChecklist(category, { ...new ChecklistDefinition(), ...def })

      } catch (e) {
        this.setChecklist(category, undefined)

        console.log(e)
        alert('ungültige Checkliste:\n'+ e)
      }
    });
  }

  public setChecklist(category: string, def?: ChecklistDefinition) {
    this.meta.next({
      category: category
    })
    this.appService.title.next(def?.title)

    /*if (def?.header_file) {
      this.loadMarkdown(def, def.header_file, 'header')
    }
    if (def?.footer_file) {
      this.loadMarkdown(def, def.footer_file, 'footer')
    }*/

    this.data.next(def)
  }

  public getDefinitionUrl(category: string, checklist: string): string {
    return `checklists/${category}/${checklist}.yaml`
  }

  public getMarkdownUrl(category: string, file: string): string {
    return `checklists/${category}/${file}.md`
  }

  public getFileUrl(category: string, file: string): string {
    return `checklists/${category}/files/${file}`
  }

  private async loadMarkdown(def: ChecklistDefinition, file: string, attribute: 'header' | 'footer') {
    if (!def) {
      return
    }

    switch (attribute) {
      case 'header':
        def.header = undefined
        break

      case 'footer':
        def.footer = undefined
        break
    }

    const category = this.meta.value?.category
    if (!category) {
      return
    }

    const url = this.getMarkdownUrl(category, file)
    if (!url) {
      return
    }

    this.httpClient.get(url, {
      responseType: 'text'
    }).subscribe((data: string) => {
      //console.log(data)

      switch (attribute) {
        case 'header':
          def.header = data
          break

        case 'footer':
          def.footer = data
          break
      }
    });
  }

  public assetResolver(url: string): string {
    const category = this.meta.value?.category
    if (!category) {
      return url
    }

    if (url.startsWith('./files/')) {
      url = url.substring(8)

    } else if (url.startsWith('./')) {
      url = url.substring(2)
    }

    // console.log(url)
    return this.getFileUrl(category, url)
  }
}
