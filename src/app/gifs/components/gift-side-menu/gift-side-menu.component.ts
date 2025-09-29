import { Component } from '@angular/core';
import { GiftSideMenuHeaderComponent } from "./gift-side-menu-header/gift-side-menu-header.component";
import { GiftSideMenuOptionsComponent } from "./gift-side-menu-options/gift-side-menu-options.component";

@Component({
  selector: 'gift-side-menu',
  imports: [GiftSideMenuHeaderComponent, GiftSideMenuOptionsComponent],
  templateUrl: './gift-side-menu.component.html',
  
})
export class GiftSideMenuComponent {



 }
