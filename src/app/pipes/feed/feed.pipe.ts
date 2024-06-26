import { Pipe, PipeTransform } from '@angular/core';
import { FEED_TYPES } from '@constants';

@Pipe({
    name: 'feed',
    standalone: true,
})
export class FeedPipe implements PipeTransform {
    private feedTypes: string[] = FEED_TYPES;

    transform(value: string): boolean {
        return this.feedTypes.includes(value);
    }
}
