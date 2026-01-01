import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Quiz } from '../../services/quiz';

@Component({
  selector: 'app-user-statastics',
  imports: [CommonModule],
  templateUrl: './user-statastics.html',
  styleUrl: './user-statastics.scss',
})
export class UserStatastics {
  constructor(private quizService: Quiz) {
  }

  quizes = signal<any[]>([]);
  ngOnInit() {
    this.quizService.getattempterQuizes().subscribe(res => {
      console.log(res.data);
      if (res.success) {
        this.quizes.set(res.data);
      }
    })
  }
}
