const prodKey = {
  apiKey: 'AIzaSyCBPI3CQMk712K5E9hBs2Yvisfw3ICgZ4E',
  authDomain: 'sensorhub-190611.firebaseapp.com',
  databaseURL: 'https://sensorhub-190611.firebaseio.com',
  projectId: 'sensorhub-190611',
  storageBucket: 'sensorhub-190611.appspot.com',
  messagingSenderId: '307336367571',
};

const testKey = {
  apiKey: 'AIzaSyCBPI3CQMk712K5E9hBs2Yvisfw3ICgZ4E',
  authDomain: 'sensorhub-190611.firebaseapp.com',
  databaseURL: 'https://sensorhub-190611.firebaseio.com',
  projectId: 'sensorhub-190611',
  storageBucket: 'sensorhub-190611.appspot.com',
  messagingSenderId: '307336367571',
};

export const endpoint = '/catalogManagement/v2';

export default window.location.host === 'sensorhub-190611.firebaseapp.com'
  ? prodKey : testKey;
