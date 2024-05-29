import { Pipe, PipeTransform } from '@angular/core';
import { IMAGE_TYPES } from '@constants';

@Pipe({
    name: 'image',
    standalone: true,
})
export class ImagePipe implements PipeTransform {
    private imageTypes: string[] = IMAGE_TYPES;

    transform(value: string): boolean {
        return this.imageTypes.includes(value);
    }
}
