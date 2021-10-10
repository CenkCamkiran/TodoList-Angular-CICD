import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { AppComponent } from '../app.component';
import { ShowLoadingDialogComponent } from '../components/dialogs/show-loading-dialog/show-loading-dialog.component';

import { DialogService } from './dialog.service';

describe('DialogService', () => {
  let component: ShowLoadingDialogComponent;
  let fixture: ComponentFixture<ShowLoadingDialogComponent>;
  let dialogService: DialogService;
  let dialogSpy: jasmine.Spy;
  let dialogRefSpyObj = jasmine.createSpyObj({
    afterClosed: of({}),
    close: null,
  });

  const dialogMock = {
    close: () => {},
  };

  // dialogRefSpyObj.componentInstance = { body: '' }; // attach componentInstance to the spy object...

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShowLoadingDialogComponent],
      imports: [MatButtonModule, MatDialogModule, BrowserAnimationsModule],
      providers: [
        DialogService,
        { provide: MatDialogRef, useValue: dialogMock },
      ],
    }).compileComponents();
    dialogService = TestBed.inject(DialogService);
  });

  it('should be created', () => {
    expect(dialogService).toBeTruthy();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowLoadingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    dialogSpy = spyOn(TestBed.inject(MatDialog), 'open').and.returnValue(
      dialogRefSpyObj
    );
  });

  it('open modal', () => {
    dialogService.ShowLoadingScreen();
    fixture.detectChanges();

    const loadingText = fixture.debugElement.queryAll(By.css('.text'));
    expect(loadingText[0].nativeElement.innerHTML).toBe('Loading...');

    expect(dialogSpy).toHaveBeenCalled();
  });

  it('close modal', () => {
    dialogService.ShowLoadingScreen();
    fixture.detectChanges();

    let spy = spyOn(component.dialogRef, 'close').and.callThrough();
    component.closeDialog();
    expect(spy).toHaveBeenCalled();
  });
});
