import {
    searchParams,
    hideLoading,
    useLoading,
    Scratchblocks,
    Paginator
} from './core.js';
import generatePostFromJSON from './post.js';

(async () => {
    let topicId = searchParams.get('id');
    if (typeof topicId !== 'string' || /[^\d]/.test(topicId) || /^0+$/.test(topicId)) {
        return useLoading('Invalid topic ID');
    }
    topicId = topicId.replace(/^0+/, '');
    let page = searchParams.get('page') || '0';
    if (/[^\d]/.test(page) || /^00+$/.test(page)) {
        return useLoading('Invalid page');
    }
    page = page.replace(/^0+/, '0') || '0';
    let resultJSON = {};
    try {
        const resp = await fetch(`https://scratchdb.lefty.one/v2/forum/topic/${topicId}/?page=${page}`);
        if (!resp.ok) {
            console.error('API request failed with', resp.status);
            return useLoading(`API failed with ${resp.status}`);
        }
        resultJSON = await resp.json();
    } catch (e) {
        console.error('Error with API request', e);
        return useLoading('API failed');
    }
    if (!resultJSON.posts || resultJSON.posts.length === 0) {
        return useLoading('404 not found');
    }

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
