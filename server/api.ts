import * as alt from 'alt-server';
import { useRebar } from '@Server/index.js';
import { Character } from '@Shared/types/character.js';

const API_NAME = 'character-select-api';
const Rebar = useRebar();

const selectCallbacks: Array<(player: alt.Player, character: Character) => void> = [];

export function invokeSelect(player: alt.Player, character: Character) {
    for (let cb of selectCallbacks) {
        cb(player, character);
    }
}

function useApi() {
    function onSelect(callback: (player: alt.Player) => void) {
        selectCallbacks.push(callback);
    }

    return {
        onSelect,
    };
}

declare global {
    export interface ServerPlugin {
        [API_NAME]: ReturnType<typeof useApi>;
    }
}

Rebar.useApi().register(API_NAME, useApi());
