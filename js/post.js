import {
    PostURL,
    FORUM_NAME_MAPPING,
    FORUM_NAME_LANG_MAPPING,
    Scratchblocks,
    setAttr
} from './core.js';

const httpsifyCU = html => html.replace(
    /\<img src=\"http\:\/\/([a-z])\.cubeupload\.com\//g,
    '<img src="https://$1.cubeupload.com/'
);

const generatePostFromJSON = resultJSON => {
    const template = document.getElementById('posttemplate');
    const clone = template.content.cloneNode(true);
    const html = httpsifyCU(resultJSON.content.html);
    setAttr(
        clone,
        ['href', 'datetime', 'lang'],
        {
            user: PostURL.userURL(resultJSON.author),
            username: resultJSON.author,

            forum: PostURL.forumURL(FORUM_NAME_MAPPING[resultJSON.topic.category]),
            forumname: resultJSON.topic.category,

            topic: PostURL.topicURL(resultJSON.topic.id),
            topicname: resultJSON.topic.name,

            timestamp: resultJSON.post_time,
            datetime: new Date(resultJSON.post_time).toLocaleString('en-us'),

            post: PostURL.postURL(resultJSON.id),
            postid: resultJSON.id,

            content: html,

            locale: FORUM_NAME_LANG_MAPPING[resultJSON.topic.category] || 'en'
        }
    );

    return ({
        elem: clone,
        needsSB: Scratchblocks.needsSB(html)
    });
};

export default generatePostFromJSON;
