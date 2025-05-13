import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface AppPage {
  title: string;
  url: string;
  icon: string;
}

interface GroupedAppPages {
  heading: string;
  pages: AppPage[];
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
})
export class SidebarComponent {
  public groupedAppPages: GroupedAppPages[] = [
    {
      heading: 'Contracts',
      pages: [
        { title: 'Initiate Contract', url: 'contracts/initiate', icon: 'fa-plus-circle' },
        { title: 'Draft Contracts', url: 'contracts/drafts', icon: 'fa-inbox' },
        { title: 'Closed Contracts', url: 'contracts/closed', icon: 'fa-lock' },
      ],
    },
    {
      heading: 'Settings',
      pages: [
        { title: 'Our Services', url: 'our-services', icon: 'fa-cog' }, 
        { title: 'Site Configrations', url: 'settings', icon: 'fa-wrench' }, 
      ],
    },
  ];

  activeGroupIndex: number | null = 0;

  toggleGroup(index: number): void {
    this.activeGroupIndex = this.activeGroupIndex === index ? null : index;
  }

  isGroupShown(index: number): boolean {
    return this.activeGroupIndex === index;
  }
}