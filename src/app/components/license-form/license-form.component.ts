import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
    AbstractControl,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    ValidationErrors,
    ValidatorFn,
    Validators,
} from '@angular/forms';

@Component({
    selector: 'app-license-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './license-form.component.html',
    styleUrl: './license-form.component.scss',
})
export class LicenseFormComponent {
    /**
     * Indicates whether the license is currently being registered
     * @type {boolean}
     * @default false
     */
    @Input() registeringLicense: boolean = false;

    /**
     * Saved License Key
     * @type {string}
     * @default false
     */
    @Input() savedLicenseKey!: string;

    /**
     * Event emitter to notify parent component when the form is submitted
     */
    @Output() onFormSubmit: EventEmitter<string> = new EventEmitter();

    /**
     * Form group for the license key input
     * @type {FormGroup}
     */
    licenseKeyForm!: FormGroup;

    /**
     * Constants used in the form
     */
    formConstants: any = {
        buttonText: 'Enter',
        licenseError: 'License key is required',
        invalidUUIDError: 'Invalid UUID format',
        placeholder: 'e.g., 123e4567-e89b-12d3-a456-426614174000',
    };

    ngOnInit() {
        this.licenseKeyForm = new FormGroup({
            licenseKey: new FormControl(this.savedLicenseKey || '', [Validators.required, this.uuidValidator()]),
        });
    }

    /**
     * Gets the license key form control
     * @returns {AbstractControl | null} The form control for the license key
     */
    get licenseKey(): AbstractControl | null {
        return this.licenseKeyForm.get('licenseKey');
    }

    /**
     * Validator function for checking if the control value is a valid UUID
     * @private
     * @returns {ValidatorFn} The validator function
     */
    private uuidValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
            const isValid = uuidPattern.test(control.value);
            return isValid ? null : { invalidUuid: { value: control.value } };
        };
    }

    /**
     * Handles form submission, logging the form value if valid, or an error if invalid
     * @public
     * @returns void
     */
    public onSubmit(licenseKey: string): void {
        this.onFormSubmit.emit(licenseKey);
    }
}
