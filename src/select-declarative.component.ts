import { Component, inject, signal } from '@angular/core';
import { DataItem, DataService, dataItems } from './data-service.service';
import { Subject, map, merge, scan, startWith, switchMap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-select-declarative',
  standalone: true,
  template: `
  <select (change)="onChange($event)">
    @for(item of displayData; track item.id){
      <option [value]="item.id">{{ item.name }}</option>
    }
  </select>

  <h3>Selected Items </h3>

  <!-- displayed options -->
  @for(item of selectedItems().data; track item.id){
    <div class="item-selected" (click)="onRemove(item)"> 
      {{ item.name }} 
    </div>
  }
  
  <!-- display loading state -->
  @if(selectedItems().isLoading){
    <div class="item-loading"> Loading ... </div>
  }

  <!-- reset button -->
  @if(selectedItems().data.length > 0){
    <button type="button" class="remove" (click)="onReset()">
      Reset
    </button>
  }

  `,
})
export class SelectDeclarativeComponent {
  private dataService = inject(DataService);

  displayData = dataItems;

  private removeItem$ = new Subject<DataItem>();
  private addItem$ = new Subject<string>();
  private reset$ = new Subject<void>();

  /**
   * displayed data on the UI - loaded from the BE
   */
  selectedItems = toSignal(
    merge(
      // create action to add a new item
      this.addItem$.pipe(
        switchMap((itemId) =>
          this.dataService.getDataFakeAPI(itemId).pipe(
            map((item) => ({
              item,
              action: 'add' as const,
            })),
            startWith({
              item: null,
              action: 'initLoading' as const,
            })
          )
        )
      ),
      // create action to remove an item
      this.removeItem$.pipe(
        map((item) => ({
          item,
          action: 'remove' as const,
        }))
      ),
      // create action to reset everything
      this.reset$.pipe(
        map(() => ({
          item: null,
          action: 'reset' as const,
        }))
      )
    ).pipe(
      scan(
        (acc, curr) => {
          // add reset state
          if (curr.action === 'reset') {
            return {
              isLoading: false,
              data: [],
            };
          }

          // display loading
          if (curr.action === 'initLoading') {
            return {
              data: acc.data,
              isLoading: true,
            };
          }

          // check to remove item
          if (curr.action === 'remove') {
            return {
              isLoading: false,
              data: acc.data.filter((d) => d.id !== curr.item.id),
            };
          }

          // check if already saved
          const savedIds = acc.data.map((d) => d.id);
          if (savedIds.includes(curr.item.id)) {
            return {
              isLoading: false,
              data: acc.data,
            };
          }

          // add item into the rest
          return {
            isLoading: false,
            data: [...acc.data, curr.item],
          };
        },
        { data: [] as DataItem[], isLoading: false }
      )
    ),
    {
      initialValue: {
        data: [],
        isLoading: false,
      },
    }
  );

  /**
   * on select change - load data from API
   */
  onChange(event: any) {
    const itemId = event.target.value;
    this.addItem$.next(itemId);
  }

  /**
   * removes item from selected array
   */
  onRemove(item: DataItem) {
    this.removeItem$.next(item);
  }

  onReset() {
    this.reset$.next();
  }
}
