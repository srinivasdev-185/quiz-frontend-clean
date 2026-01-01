import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { authGuard } from './guards/auth-guard';
import { Mainlayout } from './layout/mainlayout/mainlayout';
import { CreateQuiz } from './pages/create-quiz/create-quiz';
import { UserStatastics } from './pages/user-statastics/user-statastics';
export const routes: Routes = [
{
    path:'',
    component:Mainlayout,
    canActivate:[authGuard],
    children:[
        { path: 'dashboard', component: Dashboard},
        {path:'',component:Dashboard,pathMatch:'full'},
        {path:'createQuiz',component:CreateQuiz},
        {path:'userStatastics',component:UserStatastics}
    ],
},
{
    path:'login',component:Login
}
];
