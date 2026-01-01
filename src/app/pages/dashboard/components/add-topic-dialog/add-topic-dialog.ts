import { Component } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-add-topic-dialog',
    standalone: true,
    imports: [CommonModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule],
    template: `
    <h2 mat-dialog-title class="!font-bold !text-xl text-primary-text">Add New Topic</h2>
    <mat-dialog-content>
      <p class="text-secondary-text mb-6 text-sm">Enter the name of the topic or theme within this book.</p>
      
      <label class="text-sm font-semibold text-primary-text mb-2 block">Topic Name</label>
      <mat-form-field appearance="outline" class="w-full custom-field" subscriptSizing="dynamic">
        <input matInput [formControl]="topicName" placeholder="e.g. Creation, The Exodus, Parables">
        @if (topicName.invalid && (topicName.dirty || topicName.touched)) {
          <mat-error>Topic name is required</mat-error>
        }
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end" class="!pb-6 !px-6">
      <button mat-button (click)="onCancel()" class="!mr-2">Cancel</button>
      <button mat-flat-button class="!bg-primary-accent !text-button-text" [disabled]="topicName.invalid" (click)="onSave()">Create</button>
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
export class AddTopicDialog {
    topicName = new FormControl('', [Validators.required]);

    constructor(public dialogRef: MatDialogRef<AddTopicDialog>) { }

    onCancel(): void {
        this.dialogRef.close();
    }

    onSave(): void {
        if (this.topicName.valid) {
            this.dialogRef.close(this.topicName.value);
        }
    }
}
