<script lang="ts" setup>
import { ref } from 'vue';
import { CharacterSelectEvents } from '../../shared/characterSelectEvents';
import { CharacterSelectConfig } from '../../shared/config';
import { useEvents } from '../../../../../webview/composables/useEvents';
import { useTranslate } from '@Shared/translate';

// Import translations
const { t } = useTranslate('en');

const events = useEvents();
const first = ref('');
const last = ref('');
const allValid = ref(false);
const usernameError = ref<undefined | string>('');
const props = defineProps<{ canCancel: boolean }>();
const emits = defineEmits<{ (e: 'cancel'): void }>();

let firstError = ref<undefined | string>('');
let lastError = ref<undefined | string>('');

function validate() {
    allValid.value = false;
    usernameError.value = undefined;
    firstError.value = undefined;
    lastError.value = undefined;

    if (first.value.length < CharacterSelectConfig.minLength) {
        firstError.value = `${CharacterSelectConfig.minLength} is minimum length`;
        return;
    }

    if (first.value.length > CharacterSelectConfig.maxLength) {
        firstError.value = `${CharacterSelectConfig.maxLength} exceeds maximum length`;
        return;
    }

    if (!/[\p{Letter}\p{Mark}]+/gu.test(first.value)) {
        firstError.value = `Invalid characters found`;
        return;
    }

    if (CharacterSelectConfig.askForLastName) {
        if (last.value.length < CharacterSelectConfig.minLength) {
            lastError.value = `${CharacterSelectConfig.minLength} is minimum length`;
            return;
        }

        if (last.value.length > CharacterSelectConfig.maxLength) {
            lastError.value = `${CharacterSelectConfig.maxLength} exceeds maximum length`;
            return;
        }

        if (!/[\p{Letter}\p{Mark}]+/gu.test(last.value)) {
            lastError.value = `Invalid characters found`;
            return;
        }
    }

    allValid.value = true;
}

function create() {
    if (!allValid.value) {
        return;
    }

    events.emitServer(CharacterSelectEvents.toServer.submitUsername, first.value, last.value);
}
</script>

<template>
    <div class="flex h-screen w-screen items-center justify-center overflow-hidden text-neutral-950">
        <div class="w-1/3 rounded-lg bg-neutral-950 bg-opacity-70 p-3 shadow-lg">
            <div class="flex flex-col gap-4 text-white">
                <span class="text-lg font-medium">{{ t('character.select.first') }}</span>
                <span class="py-6 font-medium text-red-400" v-if="usernameError">{{ usernameError }}</span>
                <input
                    v-model="first"
                    :placeholder="t('character.select.first')"
                    type="text"
                    @input="validate"
                    class="rounded-lg border-2 border-neutral-50 border-opacity-20 bg-neutral-950 bg-opacity-80 px-4 py-4 outline-none placeholder:text-neutral-500 focus:border-opacity-50"
                />
                <span class="rounded-md bg-red-400 px-4 py-2 font-medium" v-if="firstError">{{ firstError }}</span>
                <span class="text-lg font-medium">{{ t('character.select.last') }}</span>
                <input
                    v-model="last"
                    :placeholder="t('character.select.last')"
                    type="text"
                    @input="validate"
                    v-if="CharacterSelectConfig.askForLastName"
                    class="rounded-lg border-2 border-neutral-50 border-opacity-20 bg-neutral-950 bg-opacity-80 px-4 py-4 outline-none placeholder:text-neutral-500 focus:border-opacity-50"
                />
                <span class="rounded-md bg-red-400 px-4 py-2 font-medium" v-if="lastError">{{ lastError }}</span>
                <div class="flex flex-row gap-3">
                    <button
                        class="h-12 w-full rounded-lg bg-white bg-opacity-20 px-6 text-center font-medium text-white shadow-md hover:bg-red-400 hover:bg-gradient-to-r hover:from-red-500 active:scale-95"
                        @click="emits('cancel')"
                        v-if="props.canCancel"
                    >
                        {{ t('character.select.cancel') }}
                    </button>
                    <button
                        class="h-12 w-full rounded-lg bg-white bg-opacity-20 px-6 text-center font-medium text-white shadow-md hover:bg-cyan-400 hover:bg-gradient-to-r hover:from-green-500 active:scale-95"
                        @click="allValid ? create() : () => {}"
                        v-if="allValid"
                    >
                        {{ t('character.select.submit') }}
                    </button>
                    <button
                        v-else
                        class="h-12 w-full rounded-lg bg-white bg-opacity-10 px-6 text-center opacity-50 shadow-md hover:cursor-default"
                    >
                        {{ t('character.select.submit') }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
