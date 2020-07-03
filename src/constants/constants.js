const ONYX_CD = 6 * 60 * 60 * 1000;
const REND_CD = 4 * 60 * 60 * 1000;

const BUFF_TYPE_ENUM = {
    ONYX: 'onyx',
    REND: 'rend'
};
const TIMER_TYPE_ENUM = {
    FIXED: 'fixed',
    USER: 'user'
};
Object.freeze(BUFF_TYPE_ENUM);
Object.freeze(TIMER_TYPE_ENUM);
export {
    ONYX_CD,
    REND_CD,
    BUFF_TYPE_ENUM,
    TIMER_TYPE_ENUM
}
