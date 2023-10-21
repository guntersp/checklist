import { Component, ElementRef, ViewContainerRef, Input } from '@angular/core';

import {
  MarkdownService,
  MarkedOptions,
  MarkedRenderer,
  MarkdownComponent as NgxMarkdownComponent
} from 'ngx-markdown';


export function cleanUrl(href: string) {
  try {
    href = encodeURI(href).replace(/%25/g, '%');
  } catch (e) {
    return null;
  }
  return href;
}

// function that returns `MarkedOptions` with renderer override
export function markedOptionsFactory(): MarkedOptions {
  const renderer = new MarkedRenderer();

  renderer.image = (href: string, title: string, text: string) => {
    const cleanHref = cleanUrl(href);
    if (cleanHref === null) {
      return text;
    }
    href = cleanHref;

    let out = `<img src="${href}" alt="${text}"`;
    if (title) {
      out += ` title="${title}"`;
    }
    out += '>';
    return out;
  };

  return {
    renderer: renderer
  };
}


@Component({
  selector: 'app-markdown',
  templateUrl: './markdown.component.html',
  styleUrls: ['./markdown.component.scss']
})
export class MarkdownComponent extends NgxMarkdownComponent {

  @Input()
  public assetResolver?: (url: string) => string

  constructor(element: ElementRef<HTMLElement>,
    markdownService: MarkdownService,
    viewContainerRef: ViewContainerRef
  ) {

    /*const div = element.nativeElement.ownerDocument.createElement('div')
    div.className = "markdown"
    element.nativeElement.appendChild(div)
    element = new ElementRef<HTMLElement>(div)*/

    super(element, markdownService, viewContainerRef)

    this.katex = true
    this.mermaid = true


    const options = markdownService.options

    if (true) {//this.assetResolver) {
      const renderer = new MarkedRenderer();
      renderer.image = (href: string, title: string, text: string) => {
        const cleanHref = cleanUrl(href);
        if (cleanHref === null) {
          return text;
        }
        href = cleanHref;

        if (this.assetResolver) {
          href = this.assetResolver(href)
        }

        let out = `<img src="${href}" alt="${text}"`;// style="max-width:80%"`;
        if (title) {
          out += ` title="${title}"`;
        }
        out += '>';
        return out;
      };
      options.renderer = renderer
    }
  }

}
