import { Component, Input,  } from '@angular/core';
import { Member } from '../../interfaces/member';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrl: './member-card.component.css'
})
export class MemberCardComponent {
@Input() member!:Member;

 

}
