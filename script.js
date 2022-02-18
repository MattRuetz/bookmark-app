const modal = document.getElementById('modal');
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');
const bookmarkForm = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEl = document.getElementById('website-url');
const bookmarksContainer = document.getElementById('bookmarks-container');


let bookmarks = [];

// Show Modal, focus on input
const showModal = () => {
    modal.classList.add('show-modal');
    websiteNameEl.focus();
}

// Modal Event Listeners
window.addEventListener('click', (e) => (e.target === modal && modal.classList.remove('show-modal'))); //close modal if click outside
modalShow.addEventListener('click', showModal);
modalClose.addEventListener('click', () => modal.classList.remove('show-modal'));


const validate = (nameValue, urlValue) => {
    const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    const regex = new RegExp(expression);

    if(!nameValue || !urlValue) {
        alert('Please submit values for both fields!')
        return false;
    }

    if(!urlValue.match(regex)){
        alert('Invalid URL! Falied to save bookmark.');
        return false;
    }
    return true;
}

// Build DOM elements from loacl storage
const buildBookmarks = () => {
    //First remove all elements in bookmarks container
    bookmarksContainer.textContent = '';


    bookmarks.forEach((bookmark) => {
        const {name, url} = bookmark;
        // Create item
        const item = document.createElement('div');
        item.classList.add('item');
        // Close icon
        const closeIcon = document.createElement('i');
        closeIcon.classList.add('fa-solid', 'fa-xmark');
        closeIcon.setAttribute('title', 'Delete Bookmark');
        closeIcon.setAttribute('onclick', `deleteBookmark('${url}')`);

        // Favicon / link container
        const linkInfo = document.createElement('div');
        linkInfo.classList.add('name');
        // Favicon
        const favicon = document.createElement('img');
        favicon.setAttribute('src', `https://s2.googleusercontent.com/s2/favicons?domain=${url}`)
        favicon.setAttribute('alt', 'Favicon');
        // link
        const link = document.createElement('a');
        link.setAttribute('href', `${url}`);
        link.setAttribute('target', '_blank');
        link.textContent = name;
        // Append bookmarks to container
        linkInfo.append(favicon, link);
        item.append(closeIcon, linkInfo);
        bookmarksContainer.appendChild(item);
    });
};


// Fetch bookmarks from localStorage
const fetchBookmarks = () => {
    if(localStorage.getItem('bookmarks')) {
        bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    } else {
        // Create new bookmarks array in localStorage
        bookmarks = [
            {
                name: 'My Site',
                url: 'http://www.mattruetz.com'
            }
        ];
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }
    buildBookmarks();
}

const deleteBookmark = (url) => {
    bookmarks.forEach((bookmark, i) => {
        if(bookmark.url === url) {
            bookmarks.splice(i, 1);
        }
    });
    // Update bookmarks in localStorage
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();
}


const storeBookmark = (e) => {
    e.preventDefault();

    const nameValue = websiteNameEl.value;
    let urlValue = websiteUrlEl.value;

    //Validating & formatting entered URL using regex
    if (!urlValue.includes('https://') && !urlValue.includes('http://')) {
        urlValue = `https://${urlValue}`; 
    }
    if (!validate(nameValue, urlValue)) {
        return false;
    }

    const bookmark = {
        name: nameValue,
        url: urlValue
    };

    bookmarks.push(bookmark);
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();
    bookmarkForm.reset();
    websiteNameEl.focus();
}


//Event Listeners
bookmarkForm.addEventListener('submit', storeBookmark);

//On load, fetch bookmarks
fetchBookmarks();