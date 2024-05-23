import { CanDeactivateFn } from '@angular/router';
import { MemeberEditComponent } from '../app/memeber-edit/memeber-edit.component';


export const preventUnsavedChangesGuard: CanDeactivateFn<MemeberEditComponent> = (component: MemeberEditComponent) => {
  if (component.editForm.dirty){
  return confirm('Are you sure you want to leave without saving changes');
  }
  return true;
};
