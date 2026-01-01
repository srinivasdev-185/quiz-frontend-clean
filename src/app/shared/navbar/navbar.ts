import { Component, TemplateRef, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatAnchor } from "@angular/material/button";
import { MatButton } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInput } from "@angular/material/input";
import { Quiz } from '../../services/quiz';
@Component({
  selector: 'app-navbar',
  imports: [RouterLink,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatIcon, MatMenuModule, MatAnchor, MatButton, MatDialogModule, MatInput],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  public up: boolean = true
  mobileOpen = false;
  createQuizForm!: FormGroup
  public user: {
    id: string,
    firstname: string,
    lastName: string,
    email: string
  } | any = {};
  @ViewChild('creteQuiz') creteQuiz!: TemplateRef<any>


  ngOnInit() {
    this.authService.user$.subscribe(user => {
      console.log(user)
      if (user) {
        this.user = JSON.parse(user);
        console.log('usr', user)
      }
    })
    this.createQuizForm = this.formBuilder.group({
      chapterName: ['', Validators.required],
      topicName: ['', Validators.required],
      quizName: ['', Validators.required],
    })
  }
  constructor(
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private quiz: Quiz
  ) {

  }

  createQuiz() {
    this.dialog.open(this.creteQuiz, { width: '40vw' })
  }
  closeDialog() {
    this.dialog.closeAll();
  }
  logout() {
    this.authService.logout().subscribe(res => {
      this.router.navigate(['/login']);
    })
  }
  get chapterName() {
    return this.createQuizForm.get('chapterName');
  }
  get topicName() {
    return this.createQuizForm.get('topicName');
  }
  get quizName() {
    return this.createQuizForm.get('quizName')
  }
  navigateToQuiz() {
    if (this.createQuizForm.valid) {
      this.quiz.createQuiz(this.createQuizForm.value).subscribe(res => {
        console.log(res);
        if (res.success) {
          this.dialog.closeAll();
          this.router.navigate(['/createQuiz'], {
            queryParams: { quizId: res.data._id }
          })
        }
        else {
          this.dialog.closeAll();
        }
      })
    }
  }
}
