import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoftwareUpdateComponent } from './software-update.component';

describe('SoftwareUpdateComponent', () => {
    let component: SoftwareUpdateComponent;
    let fixture: ComponentFixture<SoftwareUpdateComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SoftwareUpdateComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(SoftwareUpdateComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
