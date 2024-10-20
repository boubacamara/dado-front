import { Pipe, PipeTransform } from '@angular/core';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

@Pipe({
  name: 'relativeTime',
  standalone: true
})
export class RelativeTimePipe implements PipeTransform {

  transform(value: Date | string | number): string {
    if (!value) {
      return '';
    }
    
    const date = typeof value === 'string' || typeof value === 'number' ? new Date(value) : value;

    return formatDistanceToNow(date, { addSuffix: true, locale: fr });
  }

}
