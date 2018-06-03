import getCookie from './helpers/getCokie';

export const baseAPIUrl = 'http://' + $(location).attr('hostname') + ':8000';
export const csrftoken = getCookie('csrftoken');
//TODO need a better way to handle user because it's not a constant and can change
export const user = JSON.parse(localStorage.getItem('user'));