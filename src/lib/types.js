import { dateify, hmToMinutes } from './tools';

/**
 * What days of the week does system acknowledges
 */
export const DAYS_OF_WEEK = {
  monday: 'monday',
  tuesday: 'tuesday',
  wednesday: 'wednesday',
  thursday: 'thursday',
  friday: 'friday',
  saturday: 'saturday',
  sunday: 'sunday',
};

export const DAYS_OF_WEEK_LABELS = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
};

/**
 * Working hours of the school
 */
export const WORKING_HOURS = {
  startMinutes: hmToMinutes(8),
  endMinutes: hmToMinutes(19),
};

/**
 * How long is lecture allowed to last
 */
export const LECTURE_DURATION_LIMITS = {
  minMinutes: 30,
  maxMinutes: 180,
};

/**
 * How many teachers can there be in a lesson
 */
export const MAX_TEACHERS_PER_LESSON = 3;

/**
 * What minute increments are allowed
 */
export const MINUTE_INCREMENTS = 15;

// *********************************************************************************************************************

export class CustomError extends Error {
  constructor(message, status = 500) {
    super(message);
    Object.defineProperty(this, 'message', {
      enumerable: true,
    });
    this.status = status;
    this.error = this.constructor.name;
  }
}

export class Breadcrumb {
  constructor(route, title) {
    this.route = route;
    this.title = title;
  }
}

// *********************************************************************************************************************

export class Teacher {
  constructor(/** Teacher */ source) {
    this.id = undefined;
    this.fullName = undefined;
    this.email = undefined;
    this.avatar = undefined;
    this.createdAt = undefined;
    this.updatedAt = undefined;

    Object.assign(this, source);
    dateify(this, 'createdAt', 'updatedAt');
  }
}

export class Room {
  constructor(/** Room */ source) {
    this.id = undefined;
    this.designation = undefined;
    this.description = undefined;
    this.createdAt = undefined;
    this.updatedAt = undefined;

    Object.assign(this, source);
    dateify(this, 'createdAt', 'updatedAt');
  }
}

export class Lecture {
  constructor(/** Lecture */ source) {
    this.id = undefined;

    /**
     * ID of the room where lecture takes place
     * @type {Number}
     */
    this.roomId = undefined;

    /**
     * List of teacher ids which will hold the lecture
     * @type {Number[]}
     */
    this.teacherIds = undefined;

    /**
     * Title of the lecture
     * @type {string}
     */
    this.title = undefined;

    /**
     * Day of week this lecture will be held
     * @type {string}
     */
    this.dayOfWeek = undefined;

    /**
     * Hour of day when this lecture starts
     * @type {Number}
     */
    this.startHour = undefined;

    /**
     * Minute when this lecture starts
     * @type {Number}
     */
    this.startMinute = undefined;

    /**
     * Hour when the lecture ends
     * @type {Number}
     */
    this.endHour = undefined;

    /**
     * Minute when the lecture ends
     * @type {Number}
     */
    this.endMinute = undefined;

    Object.assign(this, source);
  }
}
