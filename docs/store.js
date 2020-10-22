const bookmarks = [];
const filter = 1;
const error = null;

const addBookmark = function (bookmark) {
  bookmark.expanded = false;
  this.bookmarks.push(bookmark);
};

const findById = function(id) {
  return this.bookmarks.find(bm => bm.id === id);
};

const deleteBookmark = function(id) {
  this.bookmarks = this.bookmarks.filter(bookmark => bookmark.id !== id);
};

const setError = function(error) {
  this.error = error;
};

export default {
  addBookmark,
  findById,
  deleteBookmark,
  setError,
  bookmarks,
  filter,
  error
};