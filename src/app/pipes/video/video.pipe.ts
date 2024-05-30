import { Pipe, PipeTransform } from '@angular/core';
import { VIDEO_TYPES } from '@constants';

@Pipe({
    name: 'video',
    standalone: true,
})
export class VideoPipe implements PipeTransform {
    private videoTypes: string[] = VIDEO_TYPES;

    transform(value: string): boolean {
        return this.videoTypes.includes(value);
    }
}
