const SB_URL = 'https://scratchblocks.github.io/js/scratchblocks-v3.5-min.js';
const SBL_URL = 'https://scratchblocks.github.io/js/translations-all-v3.5.js';

const searchParams = new URL(location.href).searchParams;

class PostURLFormatter {
    constructor () {
        this.fetchConfig();
    }

    fetchConfig () {
        if (searchParams.has('surl')) {
            this.force = true;
            this.useScratchURL = searchParams.get('surl') === 'true';
            return;
        }
        this.force = false;
        this.useScratchURL = window.localStorage.getItem('useScratchURL') === 'true';
    }

    qs (obj) {
        const q = new URLSearchParams(Object.entries(obj));
        if (this.force) qs.set('surl', this.useScratchURL.toString());
        let qstr = q.toString();
        if (qstr !== '') qstr = `?${qstr}`;
        return qstr;
    }

    postURL (id) {
        if (this.useScratchURL) {
            return `https://scratch.mit.edu/discuss/post/${id}/`;
        }
        return `./post${this.qs({id})}`;
    }

    topicURL (id) {
        if (this.useScratchURL) {
            return `https://scratch.mit.edu/discuss/topic/${id}/`;
        }
        return `./topic${this.qs({id})}`;
    }

    forumURL (id) {
        return `https://scratch.mit.edu/discuss/${id}/`;
    }

    userURL (name) {
        if (this.useScratchURL) {
            return `https://scratch.mit.edu/users/${name}/`;
        }
        return `./user${this.qs({name})}`;
    }
}

const PostURLSingleton = new PostURLFormatter();

const hideLoading = () => Array.from(document.getElementsByClassName('loading')).forEach(i => i.hidden = true);

const useLoading = c => Array.from(document.getElementsByClassName('loading')).forEach(i => i.innerText = c);

const setAttr = (doc, attrs, mapping) => {
    new Set([...attrs, 'html', 'content']).forEach(attr => {
        const elems = Array.from(doc.querySelectorAll(`[data-attr_${attr}]`));
        elems.forEach(elem => {
            const key = elem.dataset[`attr_${attr}`];
            switch (attr) {
                case 'html': elem.innerHTML = mapping[key]; break;
                case 'content': elem.innerText = mapping[key]; break;
                default: elem[attr] = mapping[key];
            }
        })
    });
};

const FORUM_NAME_LANG_MAPPING = {
    'Deutsch': 'de',
    'Español': 'es',
    'Français': 'fr',
    '中文': 'zh_tw',
    'Polski': 'po',
    '日本語': 'ja',
    'Nederlands': 'nl',
    'Português': 'pt',
    'Italiano': 'it',
    'עברית': 'he',
    '한국어': 'ko',
    'Norsk': 'nb',
    'Türkçe': 'tr',
    'Ελληνικά': 'el',
    'Pусский': 'ru',
    'Català': 'ca',
    'Bahasa Indonesia': 'id'
};

class ScratchblocksLoader {
    constructor () {
        this.isLoaded = false;
    }

    needsSB (html) {
        return html.includes('<pre class="blocks">');
    }

    _loadScript (url) {
        return new Promise((resolve, reject) => {
            const elem = document.createElement('script');
            elem.addEventListener('load', () => resolve());
            elem.addEventListener('error', e => reject(e));
            elem.src = url;
            elem.defer = true;
            document.head.appendChild(elem);
        })
    }

    load () {
        return new Promise((resolve, reject) => {
            if (this.isLoaded) {
                return resolve();
            }
            this._loadScript(SB_URL)
                .then(() => this._loadScript(SBL_URL))
                .then(() => resolve())
                .catch(e => reject(e));
        });
    }

    _renderAsync (locale) {
        const locales = [];
        if (locale) locales.unshift(locale);
        if (locale === 'zh_tw') locales.unshift('zh_cn');
        if (!locales.includes('en')) locales.push('en');
        return new Promise(resolve => {
            scratchblocks.renderMatching(
                `article:lang(${locale}) pre.blocks`,
                {
                    languages: locales,
                    style: 'scratch2'
                }
            );
            resolve();
        });
    }

    render () {
        return Promise.all(
            Object.values(FORUM_NAME_LANG_MAPPING)
                  .concat('en')
                  .map(locale => this._renderAsync(locale))
        );
    }
}

const ScratchblocksLoaderSingleton = new ScratchblocksLoader();

class Paginator {
    constructor (items, page, maxPerPage) {
        this.items = items;
        this.page = Number(page); // 0-indexed
        this.maxPerPage = maxPerPage || 50;
    }

    get canGoBack () {
        return this.page !== 0;
    }

    get canGoForward () {
        return this.items.length === this.maxPerPage;
    }

    render () {
        const template = document.getElementById('paginator');
        const clone = template.content.cloneNode(true);
        const pageElem = clone.querySelector('[data-content="page"]');
        pageElem.innerText = this.page + 1;
        const back = clone.querySelector('a[data-direction="back"]');
        const _mSearchParams = new URL(location.href).searchParams;
        if (this.canGoBack) {
            _mSearchParams.set('page', this.page - 1);
            const backURL = new URL(`?${_mSearchParams.toString()}`, location.href);
            back.href = backURL.toString();
        } else {
            back.href = '';
            back.classList.add('disabled');
        }

        const forward = clone.querySelector('a[data-direction="forward"]');
        if (this.canGoForward) {
            _mSearchParams.set('page', this.page + 1);
            const forwardURL = new URL(`?${_mSearchParams.toString()}`, location.href);
            forward.href = forwardURL.toString();
        } else {
            forward.href = '';
            forward.classList.add('disabled');
        }

        Array.from(document.getElementsByClassName('paginate')).forEach(elem => {
            const kuroon = clone.cloneNode(true);
            elem.appendChild(kuroon);
        });
    }
}

export {
    searchParams,
    PostURLSingleton as PostURL,
    hideLoading,
    useLoading,
    setAttr,
    ScratchblocksLoaderSingleton as Scratchblocks,
    FORUM_NAME_LANG_MAPPING,
    Paginator
};

export const FORUM_NAME_MAPPING = {
    'Suggestions': 1,
    // dustbin
    'Bugs and Glitches': 3,
    'Questions about Scratch': 4,
    'Announcements': 5,
    'New Scratchers': 6,
    'Help With Scripts': 7,
    'Show and Tell': 8,
    'Project Ideas': 9,
    'Collaboration': 10,
    'Requests': 11,
    'Deutsch': 13,
    'Español': 14,
    'Français': 15,
    '中文': 16,
    'Polski': 17,
    '日本語': 18,
    'Nederlands': 19,
    'Português': 20,
    'Italiano': 21,
    'עברית': 22,
    '한국어': 23,
    'Norsk': 24,
    'Türkçe': 25,
    'Ελληνικά': 26,
    'Pусский': 27,
    'Translating Scratch': 28,
    'Things I\'m Making and Creating': 29,
    'Things I\'m Reading and Playing': 30,
    'Advanced Topics': 31,
    'Connecting to the Physical World': 32,
    'Català': 33,
    'Other Languages': 34,
    'Bahasa Indonesia': 36,
    'Developing Scratch Extensions': 48,
    'Open Source Projects': 49,
    'Africa': 55
};
