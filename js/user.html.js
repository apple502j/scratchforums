import {
    searchParams,
    PostURL,
    hideLoading,
    useLoading,
    setAttr,
    Scratchblocks,
    Paginator,
    FORUM_NAME_MAPPING
} from './core.js';
import generatePostFromJSON from './post.js';

(async () => {
    const username = searchParams.get('name');
    if (typeof username !== 'string' || /[^\w-]/.test(username)) {
        return useLoading('Invalid username');
    }
    let page = searchParams.get('page') || '0';
    if (/[^\d]/.test(page) || /^00+$/.test(page)) {
        return useLoading('Invalid page');
    }
    page = page.replace(/^0+/, '0') || '0';
    let resultJSON = {};
    let userInfo = {};
    try {
        const resp = await fetch(`https://scratchdb.lefty.one/v2/forum/user/posts/${username}/?page=${page}`);
        if (!resp.ok) {
            console.error('API request failed with', resp.status);
            return useLoading(`API failed with ${resp.status}`);
        }
        resultJSON = await resp.json();

        const resp2 = await fetch(`https://scratchdb.lefty.one/v2/forum/user/info/${username}`);
        if (!resp2.ok) {
            console.error('API request failed with', resp2.status);
            return useLoading(`API failed with ${resp2.status}`);
        }
        userInfo = await resp2.json();
    } catch (e) {
        console.error('Error with API request', e);
        return useLoading('API failed');
    }
    if (!resultJSON.posts || resultJSON.posts.length === 0) {
        return useLoading('404 not found');
    }

    document.getElementById('username').innerText = `${username}'s stats`;
    const template = document.getElementById('forumitem');
    const postcounts = document.getElementById('postcounts');
    const c = userInfo.counts;
    Object.keys(c).sort(
        (o1, o2) => c[o2].count - c[o1].count
    ).forEach(key => {
        const isTotal = key === 'total';
        const postCount = c[key].count;
        const clone = template.content.cloneNode(true);
        setAttr(
            clone,
            ['href'],
            {
                forumurl: isTotal ? '#' : PostURL.forumURL(FORUM_NAME_MAPPING[key]),
                forumname: isTotal ? 'Total' : key,
                count: postCount || '0'
            }
        );
        postcounts.appendChild(clone);
    });

    let needsSB = false;
    resultJSON.posts.forEach(item => {
        const gen = generatePostFromJSON(item);
        document.getElementById('posts').appendChild(gen.elem);
        needsSB = needsSB || gen.needsSB;
    });

    hideLoading();

    if (needsSB) {
        await Scratchblocks.load();
        await Scratchblocks.render();
    }

    const paginator = new Paginator(resultJSON.posts, page);
    paginator.render();
})();
