import {
    searchParams,
    hideLoading,
    useLoading,
    Scratchblocks
} from './core.js';
import generatePostFromJSON from './post.js';

(async () => {
    let postId = searchParams.get('id');
    if (typeof postId !== 'string' || /[^\d]/.test(postId) || /^0+$/.test(postId)) {
        return useLoading('Invalid post ID');
    }
    postId = postId.replace(/^0+/, '');
    let resultJSON = {};
    try {
        const resp = await fetch(`https://scratchdb.lefty.one/v2/forum/post/${postId}`);
        if (!resp.ok) {
            console.error('API request failed with', resp.status);
            return useLoading(`API failed with ${resp.status}`);
        }
        resultJSON = await resp.json();
    } catch (e) {
        console.error('Error with API request', e);
        return useLoading('API failed');
    }

    const {elem, needsSB} = generatePostFromJSON(resultJSON);

    document.getElementById('post').appendChild(elem);

    hideLoading();

    if (needsSB) {
        await Scratchblocks.load();
        await Scratchblocks.render();
    }
})();
