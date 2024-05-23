import * as alt from 'alt-server';
import { useRebar } from '@Server/index.js';
import { useTranslate } from '@Shared/translate.js';
import { Character } from '@Shared/types/character.js';
import { CollectionNames } from '@Server/document/shared.js';

import * as PluginAPI from './api.js';

import { CharacterSelectConfig } from '../shared/config.js';
import { CharacterSelectEvents } from '../shared/characterSelectEvents.js';

import '../translate/index.js';

const SpawnPos = new alt.Vector3({ x: -864.1437377929688, y: -172.6201934814453, z: 37.799232482910156 });
const MAX_ATTEMPTS = 5;
const Rebar = useRebar();
const api = Rebar.useApi();
const db = Rebar.database.useDatabase();
const sessionKey = 'can-select-character';
const { t } = useTranslate('en');

async function showSelection(player: alt.Player, attempts = 0) {
    Rebar.player.useNative(player).invoke('displayRadar', false);
    player.emit(CharacterSelectEvents.toClient.toggleControls, false);

    if (attempts > MAX_ATTEMPTS) {
        player.kick();
        return;
    }

    if (!player.getMeta(sessionKey)) {
        return;
    }

    const accDocument = Rebar.document.account.useAccount(player);
    if (!accDocument) {
        player.kick(t('character.select.no.account'));
        return;
    }

    const characters = await db.getMany<Character>(
        { account_id: accDocument.getField('_id') },
        CollectionNames.Characters,
    );

    if (CharacterSelectConfig.maxCharacters == 1 && characters.length == 1) {
        handleSpawnCharacter(player, characters[0]._id);
        return;
    }

    const webview = Rebar.player.useWebview(player);
    webview.show('CharacterSelect', 'page');
    const result = await webview.isReady('CharacterSelect', 'page');
    if (!result) {
        attempts++;
        showSelection(player, attempts);
        return;
    }

    webview.emit(CharacterSelectEvents.toClient.populateCharacters, characters);
}

async function handleUsernameSubmit(player: alt.Player, first: string, last: string) {
    if (!player.getMeta(sessionKey)) {
        return;
    }

    const webview = Rebar.player.useWebview(player);

    if (first.length < CharacterSelectConfig.minLength || first.length > CharacterSelectConfig.maxLength) {
        webview.emit(CharacterSelectEvents.toClient.handleError, t('character.select.first.invalid'));
        return;
    }

    if (!/[\p{Letter}\p{Mark}]+/gu.test(first)) {
        webview.emit(CharacterSelectEvents.toClient.handleError, t('character.select.invalid.characters'));
        return;
    }

    if (CharacterSelectConfig.askForLastName) {
        if (last.length < CharacterSelectConfig.minLength || last.length > CharacterSelectConfig.maxLength) {
            webview.emit(CharacterSelectEvents.toClient.handleError, t('character.select.last.invalid'));
            return;
        }

        if (!/[\p{Letter}\p{Mark}]+/gu.test(last)) {
            webview.emit(CharacterSelectEvents.toClient.handleError, t('character.select.invalid.characters'));
            return;
        }
    }

    // username or User_Name
    const combinedName = CharacterSelectConfig.askForLastName ? `${first}_${last}` : first;
    if (CharacterSelectConfig.noDuplicateNames) {
        const characters = await db.getMany<Character>({ name: combinedName }, CollectionNames.Characters);
        if (characters.length >= 1) {
            webview.emit(CharacterSelectEvents.toClient.handleError, t('character.select.username.taken'));
            return;
        }
    }

    const accDocument = Rebar.document.account.useAccount(player);
    if (!accDocument) {
        player.kick(t('character.select.no.account'));
        return;
    }

    const characters = await db.getMany<Character>(
        { account_id: accDocument.getField('_id') },
        CollectionNames.Characters,
    );
    if (characters.length >= CharacterSelectConfig.maxCharacters) {
        webview.emit(CharacterSelectEvents.toClient.handleError, t('character.select.max.characters.reached'));
        return;
    }

    // Create the character, then show the selection again.
    const _id = await db.create<Character>(
        { account_id: accDocument.getField('_id'), name: combinedName },
        CollectionNames.Characters,
    );
    if (!_id) {
        player.kick(t('character.select.bad.write'));
        return;
    }

    showSelection(player);
}

async function getCharacter(player: alt.Player, id: string): Promise<Character | undefined> {
    if (!player.getMeta(sessionKey)) {
        return undefined;
    }

    const accDocument = Rebar.document.account.useAccount(player);
    if (!accDocument) {
        return undefined;
    }

    return await db.get<Character>({ account_id: accDocument.getField('_id'), _id: id }, CollectionNames.Characters);
}

async function handleSpawnCharacter(player: alt.Player, id: string) {
    const character = await getCharacter(player, id);
    if (!character) {
        Rebar.player
            .useWebview(player)
            .emit(CharacterSelectEvents.toClient.handleError, t('character.select.character.not.found'));
        return;
    }

    Rebar.document.character.useCharacterBinder(player).bind(character);

    Rebar.player.useNative(player).invoke('displayRadar', true);
    Rebar.player.useWebview(player).hide('CharacterSelect');
    player.emit(CharacterSelectEvents.toClient.toggleControls, true);
    player.dimension = 0;

    if (character.appearance) {
        player.visible = true;
        Rebar.player.usePlayerAppearance(player).sync();
    }

    Rebar.player.useClothing(player).sync();

    // Emit bound character event here
    player.frozen = false;
    player.deleteMeta(sessionKey);
    PluginAPI.invokeSelect(player, character);
}

async function handleTrashCharacter(player: alt.Player, id: string) {
    const character = await getCharacter(player, id);
    if (!character) {
        Rebar.player
            .useWebview(player)
            .emit(CharacterSelectEvents.toClient.handleError, t('character.select.character.not.found'));
        showSelection(player);
        return;
    }

    await db.deleteDocument(id, CollectionNames.Characters);
    showSelection(player);
}

async function handleSyncCharacter(player: alt.Player, id: string) {
    const character = await getCharacter(player, id);
    if (!character) {
        Rebar.player
            .useWebview(player)
            .emit(CharacterSelectEvents.toClient.handleError, t('character.select.character.not.found'));
        return;
    }

    if (character.appearance) {
        player.visible = true;
        Rebar.player.usePlayerAppearance(player).apply(character.appearance);
    } else {
        player.visible = false;
    }

    Rebar.player.useClothing(player).apply(character);
}

async function handleLogin(player: alt.Player) {
    player.model = 'mp_m_freemode_01';
    player.spawn(SpawnPos);
    player.pos = SpawnPos;
    player.frozen = true;
    player.visible = false;
    await alt.Utils.wait(500);

    player.dimension = player.id + 1;
    player.setMeta(sessionKey, true);
    showSelection(player);
}

async function init() {
    await alt.Utils.waitFor(() => api.isReady('auth-api'), 30000);
    const auth = api.get('auth-api');
    auth.onLogin(handleLogin);
    alt.onClient(CharacterSelectEvents.toServer.submitUsername, handleUsernameSubmit);
    alt.onClient(CharacterSelectEvents.toServer.trashCharacter, handleTrashCharacter);
    alt.onClient(CharacterSelectEvents.toServer.spawnCharacter, handleSpawnCharacter);
    alt.onClient(CharacterSelectEvents.toServer.syncCharacter, handleSyncCharacter);
}

init();
