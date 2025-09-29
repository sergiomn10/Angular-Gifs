import {  Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { GifService } from 'src/app/gifs/services/gifs.service';

interface MenuOption {
  icon: string;
  label: string;
  subLabel: string;
  route: string;
}


@Component({
  selector: 'gift-side-menu-options',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './gift-side-menu-options.component.html',
 
})
export class GiftSideMenuOptionsComponent {

  gifService = inject(GifService);

  menuOptions:MenuOption[] = [
    {
      icon: 'fa-solid fa-chart-line',
      label: 'Trending',
      subLabel: 'Gifs Populares',
      route: '/dashboard/trending',
    },
    {
      icon: 'fa-solid fa-magnifying-glass',
      label: 'Buscador',
      subLabel: 'Buscar gifs',
      route: '/dashboard/search',
    },
  ];

 }
