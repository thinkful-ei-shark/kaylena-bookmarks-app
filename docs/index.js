import $, { data } from 'jquery';
import css from './style.css';
import api from './api';
import store from './store';
import bookmark from './bookmark';

function main() {
  api.getItems().then((data) => {
    data.forEach((data) => store.addBookmark(data));
    bookmark.render();
  });
  bookmark.render();
  bookmark.bindEventListeners();
}

$(main);