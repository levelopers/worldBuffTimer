const ONYX_CD = 6 * 60 * 60 * 1000;
const REND_CD = 3 * 60 * 60 * 1000;
const NEF_CD = 8 * 60 * 60 * 1000;
const BUFF_TYPE_ENUM = {
    ONYX: 'onyx',
    REND: 'rend',
    NEF: 'nef'
};
const TIMER_TYPE_ENUM = {
    FIXED: 'fixed',
    USER: 'user'
};
Object.freeze(BUFF_TYPE_ENUM);
Object.freeze(TIMER_TYPE_ENUM);
const REQUEST_STATUS = {
    PENDING: 'pending',
    SUCCESS: 'success',
    FAIL: 'fail'
};
export {
    ONYX_CD,
    REND_CD,
    NEF_CD,
    BUFF_TYPE_ENUM,
    TIMER_TYPE_ENUM,
    REQUEST_STATUS
}
