import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Ui } from './pages/ui/ui';

export const routes: Routes = [
    { path: '', component: Home }, 
    { path: 'ui', component: Ui },
];
