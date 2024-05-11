<script lang="ts" setup>
import { ref } from 'vue';

import { Character } from '@Shared/types';
import { useTranslate } from '@Shared/translate';

import { CharacterSelectEvents } from '../shared/characterSelectEvents';

import '../translate/index';

import { useEvents } from '../../../../webview/composables/useEvents';

import Confirmation from './components/Confirmation.vue';
import CharacterSelectUsername from './components/CharacterSelectUsername.vue';

// Import translations
const { t } = useTranslate('en');

const events = useEvents();
const characters = ref<Character[]>([
    { _id: '663914c4012562fe4e0e3b42', account_id: '6630561244ad1a217ae19d5f', name: 'Stuyk_Test' },
    // { _id: '663914c4012562fe4e0e3b42', account_id: '6630561244ad1a217ae19d5f', name: 'Stuyk2_Test2' },
]);

const errorMessage = ref<string | undefined>();
const isReady = ref(false);
const isSelectingUsername = ref(false);
const isTrashing = ref(false);
const selectedCharacterIndex = ref(0);
const timeout = ref<undefined | NodeJS.Timeout>(undefined);

function handlePopulateCharacters(_characters: Character[]) {
    selectedCharacterIndex.value = 0;
    characters.value = _characters;
    isReady.value = true;
    isSelectingUsername.value = false;
    events.emitServer(CharacterSelectEvents.toServer.syncCharacter, characters.value[selectedCharacterIndex.value]._id);
}

function spawnCharacter() {
    events.emitServer(
        CharacterSelectEvents.toServer.spawnCharacter,
        characters.value[selectedCharacterIndex.value]._id,
    );
}

function trashCharacter() {
    isTrashing.value = true;
}

function confirmTrashCharacter() {
    isTrashing.value = false;

    events.emitServer(
        CharacterSelectEvents.toServer.trashCharacter,
        characters.value[selectedCharacterIndex.value]._id,
    );
}

function selectCharacter(index: number) {
    selectedCharacterIndex.value = index;
    events.emitServer(CharacterSelectEvents.toServer.syncCharacter, characters.value[selectedCharacterIndex.value]._id);
}

function handleError(msg: string) {
    if (timeout.value) {
        clearInterval(timeout.value);
        timeout.value = undefined;
    }

    errorMessage.value = msg;
    timeout.value = setTimeout(() => {
        timeout.value = undefined;
        errorMessage.value = undefined;
    }, 5000);
}

events.on(CharacterSelectEvents.toClient.handleError, handleError);
events.on(CharacterSelectEvents.toClient.populateCharacters, handlePopulateCharacters);
</script>

<template>
    <div class="flex h-screen w-screen items-center justify-center overflow-hidden text-neutral-950">
        <!-- Notification -->
        <div
            class="animate-fadein fixed top-6 min-w-96 select-none gap-3 rounded-lg bg-red-400 bg-gradient-to-r from-red-500 p-3 text-center text-2xl font-bold text-white shadow-md"
            v-if="errorMessage"
        >
            {{ errorMessage }}
        </div>

        <!-- Select Username -->
        <CharacterSelectUsername
            v-if="characters.length <= 0 || isSelectingUsername"
            :can-cancel="characters.length >= 1"
            @cancel="isSelectingUsername = false"
        />
        <Confirmation v-else-if="isTrashing" @confirm="confirmTrashCharacter" @cancel="isTrashing = false">
            {{ t('character.select.confirm.delete') }} {{ characters[selectedCharacterIndex].name }}?
        </Confirmation>
        <template v-else-if="!isTrashing">
            <!-- No Appearance Warning -->
            <div
                v-if="!characters[selectedCharacterIndex].appearance"
                class="select-none gap-3 rounded-lg bg-neutral-950 bg-opacity-70 p-3 text-4xl font-bold text-white shadow-lg"
            >
                {{ t('character.select.no.appearance') }}
            </div>

            <!-- Select Character-->
            <div
                class="fixed left-6 top-6 flex flex-col items-center gap-3 rounded-lg bg-neutral-950 bg-opacity-70 p-3 shadow-lg"
            >
                <div
                    v-for="(character, index) in characters"
                    :key="index"
                    class="flex h-12 w-full min-w-[350px] max-w-[350px] flex-row items-center justify-between rounded-lg px-6 font-medium text-white hover:cursor-pointer active:scale-95"
                    :class="
                        selectedCharacterIndex === index
                            ? ['bg-cyan-400 bg-gradient-to-r from-indigo-500', 'bg-opacity-100', 'text-black']
                            : ['bg-white', 'bg-opacity-20', 'hover:bg-opacity-25 ']
                    "
                    @click="selectCharacter(index)"
                >
                    {{ character.name.replace('_', ' ') }}
                </div>
            </div>

            <!-- Spawn -->
            <div
                class="fixed bottom-6 right-6 flex min-w-[350px] max-w-[350px] flex-col gap-6 rounded-lg bg-neutral-950 bg-opacity-70 p-3 shadow-lg"
            >
                <button
                    @click="spawnCharacter"
                    class="h-12 w-full rounded-lg bg-white bg-opacity-20 px-6 text-center font-medium text-white shadow-md hover:bg-cyan-400 hover:bg-gradient-to-r hover:from-indigo-500 active:scale-95"
                >
                    {{ t('character.select.spawn') }}
                </button>
            </div>

            <!-- Create / Delete -->
            <div
                class="fixed bottom-6 left-6 flex min-w-[350px] max-w-[350px] flex-col gap-3 rounded-lg bg-neutral-950 bg-opacity-70 p-3 shadow-lg"
            >
                <button
                    @click="trashCharacter"
                    class="h-12 w-full rounded-lg bg-white bg-opacity-20 px-6 text-center font-medium text-white shadow-md hover:bg-red-400 hover:bg-gradient-to-r hover:from-red-500 active:scale-95"
                >
                    {{ t('character.select.delete') }}
                </button>
                <button
                    @click="isSelectingUsername = true"
                    class="h-12 w-full rounded-lg bg-white bg-opacity-20 px-6 text-center font-medium text-white shadow-md hover:bg-cyan-400 hover:bg-gradient-to-r hover:from-green-500 active:scale-95"
                >
                    {{ t('character.select.create') }}
                </button>
            </div>
        </template>
    </div>
</template>
