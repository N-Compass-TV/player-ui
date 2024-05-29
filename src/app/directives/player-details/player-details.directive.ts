import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
    selector: '[appPlayerDetails]',
    standalone: true,
})
export class PlayerDetailsDirective {
    /**
     * Event emitter that triggers when CTRL + SHIFT + Y is pressed.
     * @event
     */
    @Output() public onShowPlayerDetails = new EventEmitter<void>();

    /**
     * Handles the keyboard event to detect CTRL + SHIFT + Y key combination.
     * @param {KeyboardEvent} event - The keyboard event.
     */
    @HostListener('window:keydown', ['$event'])
    public handleKeyboardEvent(event: KeyboardEvent): void {
        if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'y') {
            this.onShowPlayerDetails.emit();
        }
    }
}
