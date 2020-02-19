import { API_URL } from './settings';
import { CustomError, Teacher, Room, Lecture } from './types';

export class RequestError extends CustomError {
  constructor(source) {
    super(source.message, source.status);
    Object.assign(this, source);
    this.error = `Remote.` + source.error;
  }
}

async function request(method, path, body = undefined) {
  const url = API_URL + path;

  // NOTE: This session will lock this particular browser to a certain set of data.
  //       If you clear cookies, you will start from the default seeded data. Which may be
  //       what you want to do anyway under some circumstances
  let session = localStorage.getItem('session');
  if (!session) {
    session = Math.random()
      .toString()
      .slice(2);
    localStorage.setItem('session', session);
  }

  let response;
  let data;

  try {
    response = await fetch(url, {
      method,
      headers: {
        session,
        'content-type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    data = await response.json();
  } catch (err) {
    throw new CustomError(err.message, 0);
  }

  if (response && response.status >= 400) {
    throw new RequestError(data);
  }

  return data;
}

// *********************************************************************************************************************

/**
 * @return {Teacher[]}
 */
export async function fetchTeachers() {
  const items = await request('GET', '/teachers');
  return items.map(i => new Teacher(i));
}

/**
 * @return {Object.<string, Teacher>}
 */
export async function fetchTeacherLookup() {
  const items = await request('GET', '/teachers');
  const lookup = {};
  for (const item of items) {
    lookup[item.id] = new Teacher(item);
  }
  return lookup;
}

/**
 * @return {Teacher}
 */
export async function fetchTeacher(id) {
  const item = await request('GET', '/teachers/' + id);
  return new Teacher(item);
}

/**
 * @param {Teacher} payload
 * @return {Teacher}
 */
export async function createTeacher(payload) {
  const created = await request('POST', '/teachers', payload);
  return new Teacher(created);
}

/**
 * @param id
 * @param {Teacher} payload
 * @return {Teacher}
 */
export async function updateTeacher(id, payload) {
  const updated = await request('PUT', '/teachers/' + id, payload);
  return new Teacher(updated);
}

/**
 * @param id
 * @return {Teacher}
 */
export async function deleteTeacher(id) {
  const deleted = await request('DELETE', '/teachers/' + id);
  return new Teacher(deleted);
}

// *********************************************************************************************************************

/**
 * @return {Room[]}
 */
export async function fetchRooms() {
  const items = await request('GET', '/rooms');
  return items.map(i => new Room(i));
}

/**
 * @return {Object.<string, Room>}
 */
export async function fetchRoomLookup() {
  const items = await request('GET', '/rooms');
  const lookup = {};
  for (const item of items) {
    lookup[item.id] = new Room(item);
  }
  return lookup;
}

/**
 * @return {Room}
 */
export async function fetchRoom(id) {
  const item = await request('GET', '/rooms/' + id);
  return new Room(item);
}

/**
 * @param {Room} payload
 * @return {Room}
 */
export async function createRoom(payload) {
  const created = await request('POST', '/rooms', payload);
  return new Room(created);
}

/**
 * @param id
 * @param {Room} payload
 * @return {Room}
 */
export async function updateRoom(id, payload) {
  const updated = await request('PUT', '/rooms/' + id, payload);
  return new Room(updated);
}

/**
 * @param id
 * @return {Room}
 */
export async function deleteRoom(id) {
  const deleted = await request('DELETE', '/rooms/' + id);
  return new Room(deleted);
}

// *********************************************************************************************************************

/**
 * @return {Lecture[]}
 */
export async function fetchLectures() {
  const items = await request('GET', '/lectures');
  return items.map(i => new Lecture(i));
}

/**
 * @return {Lecture}
 */
export async function fetchLecture(id) {
  const item = await request('GET', '/lectures/' + id);
  return new Lecture(item);
}

/**
 * @param {Lecture} payload
 * @return {Lecture}
 */
export async function createLecture(payload) {
  const created = await request('POST', '/lectures', payload);
  return new Lecture(created);
}

/**
 * @param id
 * @param {Lecture} payload
 * @return {Lecture}
 */
export async function updateLecture(id, payload) {
  const updated = await request('PUT', '/lectures/' + id, payload);
  return new Lecture(updated);
}

/**
 * @param id
 * @return {Lecture}
 */
export async function deleteLecture(id) {
  const deleted = await request('DELETE', '/lectures/' + id);
  return new Lecture(deleted);
}
