import { Component } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-chapter-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule],
  template: `
    <h2 mat-dialog-title class="!font-bold !text-xl text-primary-text">Add New Book/Category</h2>
    <mat-dialog-content>
      <p class="text-secondary-text mb-6 text-sm">Enter the name of the Bible book or category you want to create.</p>
      
      <label class="text-sm font-semibold text-primary-text mb-2 block">Book Name</label>
      <mat-form-field appearance="outline" class="w-full custom-field" subscriptSizing="dynamic">
        <input matInput [formControl]="chapterName" placeholder="e.g. Genesis, Psalms, New Testament">
        @if (chapterName.invalid && (chapterName.dirty || chapterName.touched)) {
          <mat-error>Chapter name is required</mat-error>
        }
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end" class="!pb-6 !px-6">
      <button mat-button (click)="onCancel()" class="!mr-2">Cancel</button>
      <button mat-flat-button class="!bg-primary-accent !text-button-text" [disabled]="chapterName.invalid" (click)="onSave()">Create</button>
    </mat-dialog-actions>
  `,
  styles: [`
    :host {
      display: block;
      min-width: 400px;
    }
    ::ng-deep .custom-field .mat-mdc-form-field-subscript-wrapper {
      display: none;
    }
    ::ng-deep .custom-field.mat-form-field-invalid .mat-mdc-form-field-subscript-wrapper {
      display: block;
    }
  `]
})
export class AddChapterDialog {
  chapterName = new FormControl('', [Validators.required]);

  constructor(public dialogRef: MatDialogRef<AddChapterDialog>) { }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.chapterName.valid) {
      this.dialogRef.close(this.chapterName.value);
    }
  }
}
