import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-public-layout',
  imports: [MatToolbarModule,
    RouterOutlet,
    MatIconModule,
    MatButtonModule,
    CommonModule,
    RouterModule
  ],
  templateUrl: './public-layout.component.html',
  styleUrl: './public-layout.component.scss'
})
export class PublicLayoutComponent {

  isMobile = false;
  menuOpen = false;

  constructor(private breakpointObserver: BreakpointObserver) {
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
      this.isMobile = result.matches;
      if (!this.isMobile) {
        this.menuOpen = true; // Menu sempre aberto em desktop
      }
    });
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

}
