import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentSetupComponent } from './content-setup.component';

describe('ContentSetupComponent', () => {
    let component: ContentSetupComponent;
    let fixture: ComponentFixture<ContentSetupComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ContentSetupComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ContentSetupComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
