import getCookie from './helpers/getCokie';

export const baseAPIUrl = 'http://' + $(location).attr('hostname') + ':8000';
export const csrftoken = getCookie('csrftoken');