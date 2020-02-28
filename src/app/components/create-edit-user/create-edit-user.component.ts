import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {IClient, IDialogData} from '../../interfaces/clients.interface';
import {CITIES, CITIZENSHIP, DISABILITY, MARTIAL_STATUS, MODES, SEXES} from '../../constants/clients.constant';
import {ClientService} from '../../services/client.service';
import {finalize} from 'rxjs/operators';

@Component({
  selector: 'app-create-edit-user',
  templateUrl: './create-edit-user.component.html',
  styleUrls: ['./create-edit-user.component.scss']
})
export class CreateEditUserComponent implements OnInit {
  public clientForm: FormGroup;
  public loading: boolean;
  public readonly mode: MODES;
  public readonly MODES = MODES;
  public readonly SEXES = SEXES;
  public readonly CITIES = CITIES;
  public readonly citiesValues = Object.values(CITIES);
  public readonly CITIZENSHIP = CITIZENSHIP;
  public readonly citizenshipValues = Object.values(this.CITIZENSHIP);
  public readonly MARTIAL_STATUS = MARTIAL_STATUS;
  public readonly martialStatusValues = Object.values(MARTIAL_STATUS);
  public readonly DISABILITY = DISABILITY;
  public readonly disabilityValues = Object.values(DISABILITY);

  constructor(private readonly dialogRef: MatDialogRef<CreateEditUserComponent>,
              private readonly clientService: ClientService,
              @Inject(MAT_DIALOG_DATA) private readonly data: IDialogData) {
    this.mode = data.mode;
  }

  ngOnInit(): void {
    this.buildForm(this.data.mode, this.data.client);
  }

  private buildForm(mode: MODES, client?: IClient): void {
    this.clientForm = new FormGroup({
      lastName: new FormControl(
        { value: client ? client.lastName : '', disabled: mode === MODES.INFO},
        [Validators.required, Validators.minLength(2)]
      ),
      firstName: new FormControl(
        { value: client ? client.firstName : '', disabled: mode === MODES.INFO},
        [Validators.required, Validators.minLength(2)]
      ),
      middleName: new FormControl(
        { value: client ? client.middleName : '', disabled: mode === MODES.INFO},
        [Validators.required, Validators.minLength(2)]
      ),
      birthDay: new FormControl(
        { value: client ? client.birthDay : '', disabled: mode === MODES.INFO},
        [Validators.required]
      ),
      sex: new FormControl(
        { value: client ? client.sex : SEXES.MALE, disabled: mode === MODES.INFO},
        [Validators.required]
      ),
      passportSeries: new FormControl(
        { value: client ? client.passportSeries : '', disabled: mode === MODES.INFO},
        [Validators.required, Validators.minLength(2), Validators.maxLength(2)]
      ),
      passportNumber: new FormControl(
        { value: client ? client.passportNumber : '', disabled: mode === MODES.INFO},
        [Validators.required, Validators.minLength(7), Validators.maxLength(7), Validators.pattern('[0-9]*')]
      ),
      passportIssuer: new FormControl(
        { value: client ? client.passportIssuer : '', disabled: mode === MODES.INFO},
        [Validators.required]
      ),
      passportIssueDate: new FormControl(
        { value: client ? client.passportIssueDate : '', disabled: mode === MODES.INFO},
        [Validators.required]
      ),
      idNumber: new FormControl(
        { value: client ? client.idNumber : '', disabled: mode === MODES.INFO},
        [Validators.required, Validators.minLength(14), Validators.maxLength(14)]
      ),
      birthPlace: new FormControl(
        { value: client ? client.birthPlace : '', disabled: mode === MODES.INFO},
        [Validators.required]
      ),
      currentCity: new FormControl(
        { value: client ? client.currentCity : '', disabled: mode === MODES.INFO},
        [Validators.required]
      ),
      currentAddress: new FormControl(
        { value: client ? client.currentAddress : '', disabled: mode === MODES.INFO},
        [Validators.required]
      ),
      mobilePhone: new FormControl({ value: client ? client.mobilePhone : '', disabled: mode === MODES.INFO}),
      email: new FormControl({ value: client ? client.email : '', disabled: mode === MODES.INFO}, [Validators.email]),
      registeredCity: new FormControl(
        { value: client ? client.registeredCity : '', disabled: mode === MODES.INFO},
        [Validators.required]
      ),
      martialStatus: new FormControl(
        { value: client ? client.martialStatus : '', disabled: mode === MODES.INFO},
        [Validators.required]
      ),
      citizenship: new FormControl(
        { value: client ? client.citizenship : '', disabled: mode === MODES.INFO},
        [Validators.required]
      ),
      disability: new FormControl({ value: client ? client.disability : null, disabled: mode === MODES.INFO}),
      retired: new FormControl({ value: client ? client.retired : false, disabled: mode === MODES.INFO}),
      monthlyIncome: new FormControl({ value: client ? client.monthlyIncome : '', disabled: mode === MODES.INFO}),
    });
  }

  public performAction(): void {
    this.loading = true;
    if (this.mode === MODES.CREATE) {
      this.createUser();
    } else {
      this.updateUser();
    }
  }

  private createUser(): void {
    this.clientService.createClient(this.clientForm.value)
    .pipe(finalize(() => this.loading = false))
    .subscribe(user => {
      this.dialogRef.close(user);
    });
  }

  private updateUser(): void {
    this.clientService.updateClient(this.data.client._id, this.clientForm.value)
    .pipe(finalize(() => this.loading = false))
    .subscribe(user => {
      this.dialogRef.close(user);
    });
  }

}
