import AbstractObserver from '../utils/abstract-observer.js';

export default class Comments extends AbstractObserver {
  constructor() {
    super();
    this._comments = [];
  }

  setComments(comments) {
    this._comments = comments.slice();
  }

  getComments() {
    return this._comments;
  }

  addComment(updateType, update) {
    this._comments = [...this._comments, update];
    this._notify(updateType, update);
  }

  deleteComment(updateType, id) {
    const index = this._comments.findIndex((comment) => comment.id === id);
    this._comments = index === -1 ? this._comments : [...this._comments.slice(0, index), ...this._comments.slice(index + 1)];
    this._notify(updateType);
  }
}


