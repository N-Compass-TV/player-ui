import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LicenseSetupComponent } from './license-setup.component';

describe('LicenseSetupComponent', () => {
    let component: LicenseSetupComponent;
    let fixture: ComponentFixture<LicenseSetupComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LicenseSetupComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(LicenseSetupComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
