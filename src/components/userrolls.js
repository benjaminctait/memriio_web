import React from 'react';

export const UR_SYSTEM_ADMINISTRATOR = 0
// export const UR_SYSTEM_ADMINISTRATOR
// export const UR_CLOUD_ADMINISTRATOR
// export const UR_STANDARD_USER
// export const UR_EDITOR

//-------------------------------------------------------------------------------

export function showAdminOnNavBar( userid ){
    return userid === 1
}

//-------------------------------------------------------------------------------

export function canEditMemories( userid ){
    return userid === 1
}

//-------------------------------------------------------------------------------

export function canDeleteMemories( userid ){
    return userid === 1
}

//-------------------------------------------------------------------------------
