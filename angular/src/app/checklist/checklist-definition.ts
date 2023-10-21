
export type ChecklistPointState = 'ok' | 'nok'

export class ChecklistPoint {
    title = 'Untitled Checkpoint'
    description?: string

    checkpoints?: ChecklistPoint[]

    state?: ChecklistPointState
}

export interface ChecklistLink {
    title?: string
    url: string
}


export class ChecklistDefinition {
    title = 'Untitled Checklist'
    subtitle?: string

    header_file: string = 'header'
    header?: string

    checkpoints?: ChecklistPoint[]

    footer_file?: string
    footer?: string
    
    links?: ChecklistLink[]
}
