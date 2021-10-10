import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ShowLoadingDialogComponent } from './show-loading-dialog.component';
import { DialogService } from 'src/app/services/dialog.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

describe('ShowLoadingDialogComponent', () => {
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

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShowLoadingDialogComponent],
      imports: [MatButtonModule, MatDialogModule, BrowserAnimationsModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogMock },
        DialogService,
      ],
    }).compileComponents();

    dialogService = TestBed.inject(DialogService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowLoadingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    dialogSpy = spyOn(TestBed.inject(MatDialog), 'open').and.returnValue(
      dialogRefSpyObj
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open dialog', () => {
    dialogService.ShowLoadingScreen();
    fixture.detectChanges();

    const loadingText = fixture.debugElement.queryAll(By.css('.text'));
    expect(loadingText[0].nativeElement.innerHTML).toBe('Loading...');

    expect(dialogSpy).toHaveBeenCalled();
  });

  it('should close dialog when close button clicked', () => {
    dialogService.ShowLoadingScreen();
    fixture.detectChanges();

    let spy = spyOn(component.dialogRef, 'close').and.callThrough();
    component.closeDialog();
    expect(spy).toHaveBeenCalled();
  });
});
