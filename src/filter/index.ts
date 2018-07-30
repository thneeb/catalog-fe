import Vue from 'vue';
import * as moment from 'moment';

Vue.filter('datetime', (value: string) => {
  if (!value || value === '1970-01-01T00:00:00Z') {
    return '-';
  }
  return moment(value).format('DD.MM.YYYY HH:mm:ss');
});
