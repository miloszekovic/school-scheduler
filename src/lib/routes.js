import { Breadcrumb } from './types';

export const R = {
  home: '/',

  teachers: '/teachers',
  teacherNew: '/teachers/new',
  teacherEdit: '/teachers/edit/:id',

  rooms: '/rooms',
  roomNew: '/rooms/new',
  roomEdit: '/rooms/edit/:id',

  lectures: '/lectures',
  lectureNew: '/lectures/new',
  lectureEdit: '/lectures/edit/:id',
};

export const makeLink = (route, ...params) => {
  let fromIndex = 0;
  let url = [];
  for (const param of params) {
    const index = route.indexOf(':', fromIndex);
    if (index < 0) {
      break;
    }
    url.push(route.slice(fromIndex, index));
    url.push(param);
    fromIndex = index + 1;
    while (fromIndex < route.length && /[a-zA-Z0-9]/.test(route[fromIndex])) {
      fromIndex++;
    }
  }
  url.push(route.slice(fromIndex));
  return url.join('');
};

export const BREADCRUMBS = {
  home: 'Home',

  teachers: 'Teachers',
  teacherNew: 'New',
  teacherEdit: `Edit`,

  rooms: 'Rooms',
  roomNew: 'New',
  roomEdit: 'Edit',

  lectures: 'Lectures',
  lectureNew: 'New',
  lectureEdit: 'Edit',
};

for (const key in BREADCRUMBS) {
  BREADCRUMBS[key] = new Breadcrumb(R[key], BREADCRUMBS[key]);
}
