import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export type DataItem = {
  id: string;
  name: string;
};

export const dataItems: DataItem[] = [
  { id: 'id_1', name: 'item_1' },
  { id: 'id_2', name: 'item_2' },
  { id: 'id_3', name: 'item_3' },
  { id: 'id_4', name: 'item_4' },
  { id: 'id_5', name: 'item_5' },
];

@Injectable({
  providedIn: 'root',
})
export class DataService {
  /**
   * simulate fake API call to the server
   */
  getDataFakeAPI(itemId: string): Observable<DataItem> {
    return of(itemId).pipe(
      map(() => dataItems.find((d) => d.id === itemId)!),
      delay(1000)
    );
  }
}
