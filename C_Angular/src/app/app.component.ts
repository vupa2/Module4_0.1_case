import { Component } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'angular';

  frontendStyles = [];
  frontendScripts = [];

  backendStyles = [
    "assets/backend/plugins/simplebar/css/simplebar.css",
    "assets/backend/plugins/perfect-scrollbar/css/perfect-scrollbar.css",
    "assets/backend/plugins/metismenu/css/metisMenu.min.css",
    "assets/backend/css/pace.min.css",
    "assets/backend/css/bootstrap.min.css",
    "https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap",
    "assets/backend/css/app.css",
    "assets/backend/css/icons.css",
    "assets/backend/css/dark-theme.css",
    "assets/backend/css/semi-dark.css",
    "assets/backend/css/header-colors.css",
  ];

  backendScripts = [
    "assets/backend/js/pace.min.js",
    "assets/backend/js/bootstrap.bundle.min.js",
    "assets/backend/js/jquery.min.js",
    "assets/backend/plugins/simplebar/js/simplebar.min.js",
    "assets/backend/plugins/metismenu/js/metisMenu.min.js",
    "assets/backend/plugins/perfect-scrollbar/js/perfect-scrollbar.js",
    "assets/backend/js/app.js"
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const CustomJsList = document.querySelectorAll('script.custom_js');
        if (CustomJsList.length > 0) {
          CustomJsList.forEach((customJs) => {
            customJs.remove();
          });
        }
        this.loadAssets();
      }
    });
  }

  loadAssets() {
    if (window.location.pathname.startsWith('/backend')) {
      // this.loadCustomBackend();
      this.loadStyles(this.backendStyles);
      this.loadScripts(this.backendScripts);
    } else {
      this.loadStyles(this.frontendStyles);
      this.loadScripts(this.frontendScripts);
    }
  }

  // loadCustomBackend() {
  //   const body = document.querySelector('body');
  //   body!.className =
  //     'header-fixed header-tablet-and-mobile-fixed toolbar-enabled toolbar-fixed toolbar-tablet-and-mobile-fixed aside-enabled aside-fixed';
  //   body!.setAttribute(
  //     'style',
  //     '--kt-toolbar-height:55px;--kt-toolbar-height-tablet-and-mobile:55px'
  //   );
  //   body!.id = 'kt_body';
  // }

  loadStyles(styles: string[]) {
    for (let i = 0; i < styles.length; i++) {
      const node = document.createElement('link');
      node.type = 'text/css';
      node.rel = 'stylesheet';
      node.href = styles[i];
      document.querySelector('head')?.appendChild(node);
    }
  }

  loadScripts(scripts: string[]) {
    for (let i = 0; i < scripts.length; i++) {
      const node = document.createElement('script');
      node.type = 'text/javascript';
      node.className = 'custom_js';
      node.async = false;
      node.src = scripts[i];
      document.querySelector('body')?.appendChild(node);
    }
  }
}
