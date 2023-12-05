import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoDetailDialog } from './todo-detail-dialog.component';

describe('TodoDetailComponent', () => {
  let component: TodoDetailDialog;
  let fixture: ComponentFixture<TodoDetailDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoDetailDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodoDetailDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
