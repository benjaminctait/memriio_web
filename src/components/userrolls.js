import React from 'react';

export const UR_SYSTEM_ADMINISTRATOR = 0
// export const UR_SYSTEM_ADMINISTRATOR
// export const UR_CLOUD_ADMINISTRATOR
// export const UR_STANDARD_USER
// export const UR_EDITOR

//-------------------------------------------------------------------------------

export function showAdminOnNavBar( userid ){
    console.log('ur : showAdminOnNavBar: ', userid, ( userid === 1|| userid === 11 ) );
    return (userid === 1 || userid === 11 ) // Ben or Eddie
}

//-------------------------------------------------------------------------------

export function canEditMemories( userid ,memory , isAlreadyShared ){
    console.log('ur : canEditMemories: ', userid, memory, isAlreadyShared );

    let authorisedCloudEditor = (userid === 1 || userid === 11 ) // Ben or Eddie
    let userIsAuthor = ( userid === memory.userid )
    
    return ( ( userIsAuthor && !isAlreadyShared ) || authorisedCloudEditor )
}

//-------------------------------------------------------------------------------

export function canDeleteMemories( userid ){
    console.log('ur : canDeleteMemories: ', userid, ( userid === 1 ) );
    return userid === 1  // Just Ben for now
}

//-------------------------------------------------------------------------------

export function userIsAuthroizedCloudEditor( userid, clouds ){
    console.log('ur : userIsAuthroizedCloudEditor: ', userid, clouds );

    return ( userid === 1 || userid === 11 ) // Ben or Eddie
}

//-------------------------------------------------------------------------------


