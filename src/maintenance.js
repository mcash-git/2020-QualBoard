import moment from 'moment-timezone';

export class MaintenanceMode {
  constructor() {
    const val = window.MAINTENANCE;
    this.initialize(val);

    window.containerState.onUpdate((state) => {
      if (state.maintenance && state.maintenance !== window.MAINTENANCE) {
        this.initialize(state.maintenance);
      }
    });
  }

  initialize(maintenanceValue) {
    this.isEnabled = false;
    this.warningTime = null;

    if (this.isOverridden() || !maintenanceValue || maintenanceValue.toUpperCase() === 'FALSE') {
      // No-op
    } else if (maintenanceValue && maintenanceValue.toUpperCase() === 'TRUE') {
      this.isEnabled = true;
    } else if (moment(maintenanceValue).isValid()) {
      if (moment(maintenanceValue).isBefore(moment())) {
        this.isEnabled = true;
      } else {
        this.warningTime = moment(maintenanceValue).tz(moment.tz.guess());

        window.setTimeout(
          this.showSplash.bind(this),
          moment(maintenanceValue).diff(moment()),
        );
      }
    }

    if (this.isEnabled) {
      this.showSplash();
    } else {
      this.hideSplash();
    }

    if (this.warningTime) {
      this.showWarning();
    }
  }

  isOverridden() {
    const storageVal = window.localStorage.getItem('qb4_maintenance_override');
    if (this.storageVal === 'true') {
      return true;
    }

    const expireTime = moment(storageVal);
    if (expireTime.isValid()) {
      if (expireTime.isBefore(moment())) {
        window.localStorage.removeItem('qb4_maintenance_override');
        return false;
      }

      return true;
    }

    return false;
  }

  showSplash() {
    const el = document.getElementById('maintenance-splash');
    if (el) {
      el.classList.add('enabled');
    }
  }

  hideSplash() {
    const el = document.getElementById('maintenance-splash');
    if (el) {
      el.classList.remove('enabled');
    }
  }

  showWarning() {
    const warningTimeText =
      `${this.warningTime.format('h:mm a zz')} on ${this.warningTime.format('MMMM D')}`;

    const template =
`<p class="message">
<strong>Warning:</strong> QualBoard will be taken offline for maintenance at ${warningTimeText}.
We apologize for any inconvenience.
</p>
<p class="dismiss">Click to dismiss</p>`;

    const element = document.createElement('div');
    element.innerHTML = template;
    element.id = 'maintenance-warning';
    element.classList.add('enabled');
    element.addEventListener('click', (e) => {
      e.stopPropagation();
      this.hideWarning();
    });

    document.body.appendChild(element);
  }

  hideWarning() {
    const warning = document.getElementById('maintenance-warning');
    if (warning) {
      warning.classList.remove('enabled');
    }
  }
}

window.overrideMaintenance = (hours) => {
  let expireTime = 'the end of time.';
  if (hours) {
    expireTime = moment().add(hours, 'hours').format();
    window.localStorage.setItem('qb4_maintenance_override', expireTime);
  } else {
    window.localStorage.setItem('qb4_maintenance_override', 'true');
  }

  console.log(`Maintenance mode disabled until ${expireTime}.`); // eslint-disable-line

  window.location.reload();
};

window.clearMaintenanceOverride = () => {
  window.localStorage.removeItem('qb4_maintenance_override');
  console.log('Maintanence mode override removed.'); // eslint-disable-line
  window.location.reload();
};
