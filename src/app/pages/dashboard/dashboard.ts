import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { Quiz } from '../../services/quiz';
import { MatButtonModule } from '@angular/material/button';
import { LoadingService } from '../../services/loading.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddChapterDialog } from './components/add-chapter-dialog/add-chapter-dialog';
import { AddTopicDialog } from './components/add-topic-dialog/add-topic-dialog';
import { AddQuizDialog } from './components/add-quiz-dialog/add-quiz-dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, MatIconModule, MatCardModule, MatButtonModule, MatDialogModule, MatTooltipModule],
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  public quizesData: any = [];
  public loadingService = inject(LoadingService);

  // Navigation State
  public selectedChapter: any = null;
  public selectedTopic: any = null;

  public user: any = null;
  public adminReq: any = [];
  ngOnInit() {
    this.loadDashboardData();
    this.authService.user$.subscribe(user => {
      if (user) {
        this.user = typeof user === 'string' ? JSON.parse(user) : user;
        console.log('User role:', this.user.role);
        if(this.user.role==='SuperAdmin'){
          this.getAdminReq();
        }
      } else {
        this.user = null;
      }
    })
  }

  loadDashboardData() {
    this.quizSerive.getDashboardData().subscribe(res => {
      this.quizesData = res.data;
    })
  }
  getAdminReq(){
    this.authService.getAdminReq().subscribe(res => {
      if(res.success){
        this.adminReq = res.data;
        console.log(this.adminReq);
      }
    })
  }
  constructor(
    private route: Router,
    private quizSerive: Quiz,
    private dialog: MatDialog,
    private authService: AuthService

  ) {

  }

  // Navigation Methods
  selectChapter(chapter: any) {
    this.selectedChapter = chapter;
    this.selectedTopic = null;
  }

  selectTopic(topic: any) {
    this.selectedTopic = topic;
  }

  // Action Methods
  onAddChapter() {
    const dialogRef = this.dialog.open(AddChapterDialog, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
        this.quizSerive.addChapter(result).subscribe({
          next: (res) => {
            console.log(res,'');
            if(res.success)
            this.loadDashboardData();
            else
            console.log(res);
          },
          error: (err) => {
            console.error('Error adding chapter:', err);
          }
        });
      }
    });
  }

  onAddTopic() {
    if (!this.selectedChapter) return;

    const dialogRef = this.dialog.open(AddTopicDialog, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.quizSerive.addTopic(this.selectedChapter._id, result).subscribe({
          next: () => {
            this.loadDashboardData();
            this.forceReload();
          },
          error: (err) => {
            console.error('Error adding topic:', err);
          }
        });
      }
    });
  }

  onAddQuiz() {
    if (!this.selectedChapter || !this.selectedTopic) return;

    const dialogRef = this.dialog.open(AddQuizDialog, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.quizSerive.addQuiz(this.selectedChapter._id, this.selectedTopic._id, result).subscribe({
          next: (res) => {
            console.log(res,'');
            if(res.success){
            this.loadDashboardData();
            this.forceReload();}
            else
            console.log(res);
          },
          error: (err) => {
            console.error('Error adding quiz:', err);
          }
        });
      }
    });
  }

  // Helper to maintain view state after reload
  forceReload() {
    const chapterId = this.selectedChapter?._id;
    const topicId = this.selectedTopic?._id;

    this.quizSerive.getDashboardData().subscribe(res => {
      this.quizesData = res.data;

      // Restore selection if possible
      if (chapterId) {
        this.selectedChapter = this.quizesData.find((c: any) => c._id === chapterId);
        if (this.selectedChapter && topicId) {
          this.selectedTopic = this.selectedChapter.topics.find((t: any) => t._id === topicId);
        }
      }
    });
  }

  goBackToChapters() {
    this.selectedChapter = null;
    this.selectedTopic = null;
  }

  goBackToTopics() {
    this.selectedTopic = null;
  }

  createQuize(quizId: any) {
    this.route.navigate(['/createQuiz'], {
      queryParams: { quizId: quizId ,mode:'attempt'}
    })
  }

  onEditQuiz(quiz: any) {
    this.route.navigate(['/createQuiz'], {
      queryParams: { quizId: quiz }
    })
  }
  approveAdminReq(id:any){
    this.authService.approveAdminReq(id).subscribe(res => {
      if(res.success){
        this.getAdminReq();
      }
    })
  }
  rejectAdminReq(id:any){
    this.authService.rejectAdminReq(id).subscribe(res => {
      if(res.success){
        this.getAdminReq();
      }
    })
  }
}
