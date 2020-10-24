import $ from 'jquery';
import store from './store';
import api from './api';

const generateHtmlString = function () {
  return `<header>
    <label for="heading"></label>
    <div id="main" class="container">
    
        <h2>Bookmarks</h2>
        <form id="bookmark-container">
        <fieldset>
        <p>${store.error?store.error:''}</p>
        <label for="bookmark-input">Bookmark:</label>
        <input id="bookmark-input" type="text" placeholder="Bookmark Name"><br>
        <div id="url-container">
        <label for="address-input">Address:</label>
        <input id="address-input" type="text" placeholder="Enter URL"><br>
        <label for="description-input">Description:</label>
        <input id="description-input" type="text area" placeholder="Enter Description" value=""><br>
        <label for="rating-btn">Rating:</label><br>

        <input type="radio" name="rate" id="rate-1" value="1">⭐<label for="rate-5" class="rate-btn"></label><br>
        <input type="radio" name="rate" id="rate-2" value="2">⭐⭐<label for="rate-5" class="rate-btn"></label><br>
        <input type="radio" name="rate" id="rate-3" value="3">⭐⭐⭐<label for="rate-5" class="rate-btn"></label><br>
        <input type="radio" name="rate" id="rate-4" value="4">⭐⭐⭐⭐<label for="rate-5" class="rate-btn"></label><br>
        <input type="radio" name="rate" id="rate-5" value="5">⭐⭐⭐⭐⭐<label for="rate-5" class="rate-btn"></label><br>

        <input id="add" type="submit" value="Add">
        <label for="radio-btn"></label>
        <select name="rating">
            <option value = "">Select By Rating</option>
            <option value="1">⭐</option>
            <option value="2">⭐⭐</option>
            <option value="3">⭐⭐⭐</option>
            <option value="4">⭐⭐⭐⭐</option>
            <option value="5">⭐⭐⭐⭐⭐</option>
            </div>
        </form>
        </select>
        </fieldset>
        </div>`;
};

const addBtn = function () {
  $('main').on('submit', '#bookmark-container', function (e) {
    e.preventDefault();
    let title = $('#bookmark-input').val();
    let url = $('#address-input').val();
    let desc = $('#description-input').val();
    let rating = $("input[name = 'rate']:checked").val();
    $('#bookmark-input').val('');
    $('#address-input').val('');
    const bookmark = { title: title, url: url, desc: desc, rating: rating };

    api
      .createItem(bookmark)
      .then((data) => {
        store.addBookmark(data);
        render();
      })
      .catch((error) => {
        store.setError(error.message);
        renderError();
      });
  });
};

const renderError = function () {
    if (store.error) {
        render();
        store.setError(null);
    }
    store.setError(null);
};

const handleDelete = function () {
    $('main').on('click', '.delete', function (e) {
        let id = $(e.currentTarget).closest('.bookmark').attr('id');
        api
            .deleteItem(id)
            .then(() => {
                store.deleteBookmark(id);
                render();
            })
            .catch((error) => {
                store.setError(error.message);
                renderError();
            });
    });
};

const filterBy = function () {
    $('main').on('change', 'select', function () {
        const rating = $('select').val();
        if (rating) {
            store.filter = rating;
            $('select').val('');
            render();
        }
    });
};

const generateBookmarkString = function (bookmarks) {
    let bookmarkList = bookmarks.map((bookmark) => {
        if (bookmark.rating >= store.filter) {
            if (bookmark.expanded === false) {
                return `
                <div id="${bookmark.id}" class="bookmark">
                    <span class="title">${bookmark.title}</span>
                    <span class="rating">${bookmark.rating}</span>
                </div>`;
            } else {
                return `
                <div id=${bookmark.id} class="bookmark">
                    <div class="header-1">
                        <span class="title">${bookmark.title}</span>
                        <span><button class="delete">Delete</button></span>
                    </div>
                    <div class="header-2">
                        <span class="url"><a href="${bookmark.url}" class="visit">Visit Website</a></span>
                        <span class="rating">Rating: ${bookmark.rating}</span>
                    </div>
                    <div class="desc">${bookmark.desc}</div>
                </div>`;
            }
        } else {
            return '';
        }
    });

    return `
    <fieldset class="bookmark-list">
    ${bookmarkList.join('')}
    </fieldset>`;
};

const generateBookmarkList = function () {
    let bookmarks = [...store.bookmarks];
    const bookmarksString = generateBookmarkString(bookmarks);
    return bookmarksString;
};

const render = function () {
    let page = generateHtmlString();
    page += generateBookmarkList();
    $('main').html(page);
};

function handleExpand() {
    $('main').on('click', '.bookmark', function (e) {
        let id = e.currentTarget.id;
        let bookmark = store.findById(id);
        bookmark.expanded = !bookmark.expanded;

        render();
    });
}

const bindEventListeners = function () {
    addBtn();
    handleDelete();
    handleExpand();
    filterBy();
};

export default {
    render,
    bindEventListeners,
};