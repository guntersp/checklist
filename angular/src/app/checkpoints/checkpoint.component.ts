import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ChecklistPoint, ChecklistPointState } from '../checklist/checklist-definition';
import { MatButtonToggleChange } from '@angular/material/button-toggle';

@Component({
  selector: 'app-checkpoint',
  templateUrl: './checkpoint.component.html',
  styleUrls: ['./checkpoint.component.scss']
})
export class CheckpointComponent {
  @Input()
  checkpoint!: ChecklistPoint

  @Input()
  level: number = 0

  @Input()
  prefix?: string

  @Input()
  public assetResolver?: (url: string) => string

  @Output()
  public get state(): ChecklistPointState | undefined {
    return this.getSubState(this.checkpoint)
  }

  public getSubState(cp: ChecklistPoint): ChecklistPointState | undefined {
    if (!cp.checkpoints || cp.checkpoints.length <= 0) {
      return cp.state
    }

    let hasUndefined = false

    for (const scp of cp.checkpoints) {
      const s = this.getSubState(scp)
      if (s === 'nok') {
        return s
      }

      if (!s) {
        hasUndefined = true
        continue
      }
    }

    return hasUndefined ? undefined : 'ok'
  }

  public setState(e: MatButtonToggleChange) {
    if (!this.checkpoint) return

    if (this.checkpoint.state === e.value) {
      return
    }

    if (this.checkpoint.checkpoints && this.checkpoint.checkpoints.length > 0) {
      // prevent update
      return
    }

    this.checkpoint.state = e.value

    this.updateSubStates(this.checkpoint.checkpoints)
  }

  public updateSubStates(cps?: ChecklistPoint[]) {
    if (!cps) {
      return
    }

    for (const cp of cps) {
      cp.state = this.checkpoint.state

      this.updateSubStates(cp.checkpoints)
    }
  }
}
