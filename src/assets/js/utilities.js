// @ts-nocheck

export const isEmpty = (x) => {
    return (
        [Object, Array].includes((x || {}).constructor) &&
        !Object.entries(x || {}).length
    );
};

export const isTrackExist = (array, objectToSearch) => {
    return array.find(x => x.path === objectToSearch.path);
};