export const CharacterSelectEvents = {
    toServer: {
        submitUsername: 'character:select:submit:username',
        trashCharacter: 'character:select:trash',
        spawnCharacter: 'character:select:spawn',
        syncCharacter: 'character:select:sync',
    },
    toClient: {
        handleError: 'character:select:username:handle:error',
        populateCharacters: 'character:select:populate',
        toggleControls: 'character:select:toggle:controls',
    },
};
