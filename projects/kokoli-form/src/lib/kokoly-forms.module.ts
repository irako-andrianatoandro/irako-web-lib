import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

// PrimeNG Modules
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CalendarModule } from 'primeng/calendar';
import { SliderModule } from 'primeng/slider';
import { InputSwitchModule } from 'primeng/inputswitch';
import { RatingModule } from 'primeng/rating';
import { ColorPickerModule } from 'primeng/colorpicker';
import { EditorModule } from 'primeng/editor';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

// Components
import {
  DynamicFormComponent,
  DynamicFieldComponent,
  TextFieldComponent,
  NumberFieldComponent,
  SelectFieldComponent,
  DateFieldComponent,
  CheckboxFieldComponent,
  OtherFieldComponent,
} from './components';

// Services
import { TransformationService, ValidationService } from './services';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    // PrimeNG Modules
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    InputTextareaModule,
    DropdownModule,
    MultiSelectModule,
    CheckboxModule,
    RadioButtonModule,
    CalendarModule,
    SliderModule,
    InputSwitchModule,
    RatingModule,
    ColorPickerModule,
    EditorModule,
    MessagesModule,
    MessageModule,
    TooltipModule,
    ProgressSpinnerModule,

    // Standalone Components
    DynamicFormComponent,
    DynamicFieldComponent,
    TextFieldComponent,
    NumberFieldComponent,
    SelectFieldComponent,
    DateFieldComponent,
    CheckboxFieldComponent,
    OtherFieldComponent,
  ],
  exports: [DynamicFormComponent],
  providers: [TransformationService, ValidationService],
})
export class KokolyFormsModule {}
