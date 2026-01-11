// 🔥 Register all models (SIDE EFFECT IMPORTS)
import './User';
import './Society';
import './Lecture';
import './Event';
import './Sponsor';
import './Developer';
import './Tag';

// (Optional) re-exports for convenience
export { default as Society } from './Society';
export { default as Lecture } from './Lecture';
export { default as Event } from './Event';
export { default as Sponsor } from './Sponsor';
export { default as Developer } from './Developer';
export { default as Tag } from './Tag';
export { default as User } from './User';
export { default as FAQ } from './FAQ';

export type { ISociety } from './Society';
export type { ILecture } from './Lecture';
export type { IEvent } from './Event';
export type { ISponsor } from './Sponsor';
export type { IDeveloper } from './Developer';
export type { ITag } from './Tag';
export type { IFAQ } from './FAQ';