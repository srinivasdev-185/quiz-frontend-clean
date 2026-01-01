import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Question } from '../pages/create-quiz/create-quiz';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class Quiz {
  private apiUrl = `${environment.apiBaseUrl}/quiz`
  private http = inject(HttpClient);
  createQuiz(data: any) {
    return this.http.post<any>(this.apiUrl + '/createChapter', { data })
  }
  getQuizesData() {
    return this.http.get<any>(this.apiUrl + '/getQuizesData', {})
  }
  createQution(data: any) {
    console.log(data);
    return this.http.post<any>(this.apiUrl + '/createQuestion', { data });
  }
  getQuestionsOfQuiz(id: any) {
    return this.http.get<any>(this.apiUrl + '/getQuestionOfQuiz', { params: { id: id } });
  }
  updateQuestion(data: any) {
    return this.http.post<any>(this.apiUrl + '/updateQuestion', data);
  }
  getDashboardData() {
    return this.http.get<any>(this.apiUrl + '/getDashboardData', {});
  }
  addChapter(chapterName: string) {
    return this.http.post<any>(this.apiUrl + '/addChapter', { chapterName });
  }

  addTopic(chapterId: string, topicName: string) {
    return this.http.post<any>(this.apiUrl + '/addTopic', { chapterId, topicName });
  }

  addQuiz(chapterId: string, topicId: string, quizName: string) {
    return this.http.post<any>(this.apiUrl + '/addQuiz', { chapterId, topicId, quizName });
  }
  attemptQuiz(data: any) {
    return this.http.post<any>(this.apiUrl + '/attemptQuiz', data);
  }
  submitAttempt(data: any) {
    return this.http.post<any>(this.apiUrl + '/submitQuiz', data);
  }
  getAttemptedAnswers(data: any) {
    return this.http.get<any>(this.apiUrl + '/getAttemptedAnswers', { params: { id: data } });
  }
  getattempterQuizes() {
    return this.http.get<any>(this.apiUrl + '/getattempterQuize', {});
  }
}
