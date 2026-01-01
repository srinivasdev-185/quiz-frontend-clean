import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';
import { MatIconModule } from '@angular/material/icon';
import { Quiz } from '../../services/quiz';

export interface Question {
  _id?: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface AttemptedAnswer {
  questionId: string;
  selectedOption: number;
}

@Component({
  selector: 'app-create-quiz',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatRadioModule,
    MatSnackBarModule,
    MatIconModule
  ],
  templateUrl: './create-quiz.html',
  styleUrl: './create-quiz.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class CreateQuiz {

  questions: Question[] = [];
  attemptedAnswers: AttemptedAnswer[] = [];

  currentIndex = 0;
  quiz!: string;
  mode!: string;
  isAttemptMode = false;

  questionText = '';
  options: string[] = ['', '', '', ''];
  selectedOption: number | null = null;

  constructor(
    private snackBar: MatSnackBar,
    private quizService: Quiz,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.quiz = params['quizId'];
      this.mode = params['mode'];
      this.isAttemptMode = this.mode === 'attempt';
      this.loadSelectedOption();
      if (this.quiz) {
        this.loadQuestions();
        this.loadSelectedOption()
      }
    });
  }
  loadSelectedOption() {
    this.quizService.getAttemptedAnswers(this.quiz).subscribe(res => {
      if (res.success) {
        this.attemptedAnswers = [];

        Object.entries(res.data).forEach(([key, value]: [string, any]) => {
          this.attemptedAnswers.push({
            questionId: key,
            selectedOption: value
          });
        });

        console.log(this.attemptedAnswers);
      }
    });
  }
  loadQuestions() {
    this.quizService.getQuestionsOfQuiz(this.quiz).subscribe(res => {
      if (res.success) {
        this.questions = res.data;
        this.currentIndex = 0;
        this.loadQuestion();
      }
    });
  }

  loadQuestion() {
    const q = this.questions[this.currentIndex];

    this.questionText = q.question;
    this.options = [...q.options];

    if (this.isAttemptMode) {
      const attempt = this.attemptedAnswers.find(a => a.questionId === q._id);
      this.selectedOption = attempt ? attempt.selectedOption : null;
    } else {
      this.selectedOption = q.correctAnswer;
    }

    this.cdr.detectChanges();
  }

  selectOption(option: number) {
    this.selectedOption = option;

    if (this.isAttemptMode) {
      const qId = this.questions[this.currentIndex]._id!;
      const existing = this.attemptedAnswers.find(a => a.questionId === qId);
      const correctAnswer = this.questions[this.currentIndex].correctAnswer === option ? 1 : 0;
      this.quizService.attemptQuiz({ quizId: this.quiz, questionId: qId, correctAnswer: correctAnswer, option: option }).subscribe((res) => {
        console.log(res);
      });
      if (existing) {
        existing.selectedOption = option;
      } else {
        this.attemptedAnswers.push({
          questionId: qId,
          selectedOption: option
        });
      }
    }
  }

  nextQuestion() {
    if (this.isAttemptMode) {
      if (this.selectedOption === null) {
        this.showError('Please select an option');
        return;
      }

      if (this.currentIndex < this.questions.length - 1) {
        this.currentIndex++;
        this.loadQuestion();
      }
    } else {
      this.saveQuestion();
    }
  }

  prevQuestion() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.loadQuestion();
    }
  }

  saveQuestion() {
    if (!this.questionText.trim()) {
      this.showError('Please enter the question');
      return;
    }
    if (this.options.some(opt => !opt.trim())) {
      this.showError('Please fill all options');
      return;
    }
    if (this.selectedOption === null) {
      this.showError('Select correct answer');
      return;
    }

    const payload = {
      question: this.questionText,
      options: [...this.options],
      correctAnswer: this.selectedOption,
      quizId: this.quiz
    };

    this.quizService.createQution(payload).subscribe(res => {
      if (res.success) {
        this.questions.push(res.data);
        this.currentIndex = this.questions.length - 1;
        this.prepareNewQuestion();
      }
    });
  }

  prepareNewQuestion() {
    this.questionText = '';
    this.options = ['', '', '', ''];
    this.selectedOption = null;
    this.cdr.detectChanges();
  }

  submitQuiz() {
    console.log(this.isAttemptMode);
    if (this.isAttemptMode) {
      this.quizService.submitAttempt({ quizId: this.quiz }).subscribe((res) => {
        console.log(res);
        if (res.success) {
          this.router.navigate(['/userStatastics']);
        }
      });
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  hasPrev(): boolean {
    return this.currentIndex > 0;
  }

  showError(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'right'
    });
  }
}
