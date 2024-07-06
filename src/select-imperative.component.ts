import { Component, inject, signal } from '@angular/core';
import { DataItem, DataService, dataItems } from './data-service.service';

@Component({
  selector: 'app-select-imperative',
  standalone: true,
  template: `
  <select (change)="onChange($event)">
    @for(item of displayData; track item.id){
      <option [value]="item.id">{{ item.name }}</option>
    }
  </select>

  <h3>Selected Items </h3>

  <!-- displayed options -->
  @for(item of selectedItems(); track item.id){
    <div class="item-selected" (click)="onRemove(item)"> 
      {{ item.name }} 
    </div>
  }
  
  <!-- display loading state -->
  @if(isLoadingData()){
    <div class="item-loading"> Loading ... </div>
  }

  <!-- reset button -->
  @if(selectedItems().length > 0){
    <button type="button" class="remove" (click)="onReset()">
      Reset
    </button>
  }

  `,
})
export class SelectImperativeComponent {
  private dataService = inject(DataService);

  displayData = dataItems;

  /**
   * displayed data on the UI - loaded from the BE
   */
  selectedItems = signal<DataItem[]>([]);

  isLoadingData = signal(false);

  /**
   * on select change - load data from API
   */
  onChange(event: any) {
    const itemId = event.target.value;

    // check if already saved
    const savedIds = this.selectedItems().map((d) => d.id);
    if (savedIds.includes(itemId)) {
      return;
    }

    // set loading to true
    this.isLoadingData.set(true);

    // fake load data from BE
    this.dataService.getDataFakeAPI(itemId).subscribe((res) => {
      // save data
      this.selectedItems.update((prev) => [...prev, res]);
      // set loading to false
      this.isLoadingData.set(false);
    });
  }

  /**
   * removes item from selected array
   */
  onRemove(item: DataItem) {
    this.selectedItems.update((prev) => prev.filter((d) => d.id !== item.id));
  }

  onReset() {
    this.selectedItems.set([]);
  }
}
