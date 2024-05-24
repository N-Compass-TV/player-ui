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
        console.log('Keydown event:', event); // Log the event to see if it's detected
        if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'y') {
            console.log('CTRL + SHIFT + Y detected'); // Log when the key combination is detected
            this.onShowPlayerDetails.emit();
        }
    }
}
